import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import ReefCloudAuthService, {
  ReefCloudAuthState,
  OrganizationUserData,
  UserAuthorizationData,
} from './services/reef-cloud-auth.service';
import { ReefCloudContext } from './reef-cloud.context';

/* Pages */
import Login from './pages/login.page';
import LogOutCallback from './pages/logut-callback.page';
import HandleCallback from './pages/handle-callback.page';

/* Types */
import { ReefCloudProviderOptions, SuspendedData, SuspendData } from './types';
import { UserModuleMap, UserModule } from './common/types';

/* Constants */
import { SuspendError, SuspendType } from './constants';

type IReefCloudProviderProps = {
  options: ReefCloudProviderOptions;
  children: React.ReactNode;
};

export default function ReefCloudProvider({ options, children }: IReefCloudProviderProps) {
  const RCAuthService = new ReefCloudAuthService(options.authServiceOptions);

  const [authState, setAuthState] = useState<ReefCloudAuthState | null>(RCAuthService.getAuthState());
  const [loading, setLoading] = useState<boolean>(true);

  const [userModules, setUserModules] = useState<UserModule[] | undefined>();
  const [userModulesMap, setUserModulesMap] = useState<UserModuleMap | undefined>();

  const [suspendedActionData, setSuspendedActionData] = useState<SuspendedData | null>(null);

  const [userOrganizationId, setUserOrganizationId] = useState<string | null>(
    ReefCloudAuthService.getCachedOrganizationId(),
  );

  const [organizationUserData, setOrganizationUserData] = React.useState<OrganizationUserData | null>(null);

  const [userAuthorizationData, setUserAuthorizationData] = React.useState<UserAuthorizationData | null>(null);

  const fetchUserInfo = async () => {
    if (userOrganizationId) {
      setLoading(true);
      const userData = await RCAuthService.getUserData(userOrganizationId);

      if (userData) {
        setOrganizationUserData(userData.organizationUserData);
        setUserAuthorizationData(userData.userAuthorizationData);
      }

      setLoading(false);
    }
  };

  const refetchUserOrganizationData = () => {
    fetchUserInfo();
  };

  const setSuspendUserData = (suspendUserData: SuspendData | null) => {
    switch (suspendUserData?.reason) {
      case SuspendError.SUSPENDED:
        setSuspendedActionData({ type: SuspendType.SUSPENDED });
        break;
      default:
        setSuspendedActionData(null);
        break;
    }
  };

  const logout = () => {
    RCAuthService.logout();
    setAuthState(RCAuthService.getAuthState());
    setOrganizationUserData(null);
    setUserAuthorizationData(null);
  };

  const setOrganizationId = (organizationId: string) => {
    ReefCloudAuthService.setOrganizationId(organizationId);
    setUserOrganizationId(organizationId);
  };

  useEffect(() => {
    if (authState) {
      const fetchOrganizationId = async () => {
        setLoading(true);

        const organizationId = await RCAuthService.getOrganizationId();
        setUserOrganizationId(organizationId);
      };
      fetchOrganizationId();
    } else {
      // setUserOrganizationId(null);
      setOrganizationUserData(null);
      setUserAuthorizationData(null);
      setUserModules([]);
      setUserModulesMap({});
      setLoading(false);
    }
  }, [authState]);

  useEffect(() => {
    const allUserModulesAndOrganizationId = userAuthorizationData?.organizationAuthorizationData;
    if (allUserModulesAndOrganizationId !== undefined) {
      if (allUserModulesAndOrganizationId) {
        const filteredModulesByUserId = allUserModulesAndOrganizationId.find((item) => {
          return item.organizationId === userOrganizationId?.toString();
        });

        if (filteredModulesByUserId) {
          setUserModules(filteredModulesByUserId.modulePermissions);

          const userModulesForMap = filteredModulesByUserId.modulePermissions.reduce((accumulator, currentItem) => {
            accumulator[currentItem.moduleName] = currentItem.permission;
            return accumulator;
          }, {} as UserModuleMap);

          setUserModulesMap(userModulesForMap);
        } else {
          setUserModules([]);
          setUserModulesMap({});
        }
      }
    }
  }, [userAuthorizationData]);

  useEffect(() => {
    if (userOrganizationId) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [userOrganizationId]);

  return (
    <ReefCloudContext.Provider
      value={{
        loading,
        authState,
        userModules,
        userModulesMap,
        userOrganizationId,
        organizationUserData,
        userAuthorizationData,
        suspendedActionData,
        login: RCAuthService.login,
        logout,
        getTokens: RCAuthService.getTokens,
        globalLogout: RCAuthService.globalLogout,
        setOrganizationId: setOrganizationId,
        setSuspendUserData,
        refetchUserOrganizationData: refetchUserOrganizationData,
      }}
    >
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/logout" component={LogOutCallback} />
        <Route path="/login-callback" component={HandleCallback} />
        <Route path="/" render={() => children} />
      </Switch>
    </ReefCloudContext.Provider>
  );
}
