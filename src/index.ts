import useReefCloud from './reef-cloud.hook';
import ReefCloudProvider from './reef-cloud.provider';
import { UserModule, UserModuleMap, UserModulePermission } from './common/types';
import { ReefCloudAuthServiceOptions } from './types';
import { ReefCloudContext } from './reef-cloud.context';
import { PrivateRoute } from './components/private-route';
import { showContentIfRequiredModuleIsPresent, getAccessToken, setCurrentPageTitle } from './common/utility';
import { AuthorizationContent } from './components/authorization-content';

export {
  UserModule,
  UserModuleMap,
  UserModulePermission,
  PrivateRoute,
  useReefCloud,
  ReefCloudContext,
  ReefCloudProvider,
  AuthorizationContent,
  ReefCloudAuthServiceOptions,
  getAccessToken,
  showContentIfRequiredModuleIsPresent,
  setCurrentPageTitle,
};

export default ReefCloudProvider;
