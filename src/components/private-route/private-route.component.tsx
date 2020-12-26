import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import { useLocation } from 'react-router-dom';
import { UserModule } from '../../common/types';
import useReefCloud from '../../reef-cloud.hook';
import { IPrivateRouteProps } from './private-route.types';
import { showContentIfRequiredModuleIsPresent } from '../../common/utility';

export const PrivateRoute = ({
  render,
  component: ReactComponent,
  requiredUserModules,
  ...rest
}: IPrivateRouteProps) => {
  const { authState, loading, userModules, userModulesMap } = useReefCloud();
  const { pathname } = useLocation();

  const getRoutePassState = (requiredUserModules?: UserModule | UserModule[]) => {
    if (!requiredUserModules) return true;

    if (!userModules || !userModulesMap) return false;

    return showContentIfRequiredModuleIsPresent(userModulesMap)(requiredUserModules, true) ? true : false;
  };

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!!authState && !loading) {
          return getRoutePassState(requiredUserModules) ? (
            render ? (
              render(props)
            ) : (
              //@ts-ignore
              <ReactComponent {...props} />
            )
          ) : (
            <Redirect
              to={{
                pathname: '/not-found',
                state: { referrer: pathname },
              }}
            />
          );
        }

        if (authState && loading) return null;

        return (
          <Redirect
            to={{
              pathname: '/login',
              state: { referrer: pathname },
            }}
          />
        );
      }}
    />
  );
};
