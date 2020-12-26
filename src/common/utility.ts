import { UserModuleMap, UserModule } from './types';
import { USER_MODULE_PERIMISSION } from './constants';
import { CacheService } from '../services/local-storage.service';
import { CACHE_KEYS } from '../types';

export const showContentIfRequiredModuleIsPresent = (userModulesMap: UserModuleMap) => (
  userRequiredModules: UserModule[] | UserModule,
  checkAtLeastPermission = false,
): boolean => {
  if (typeof userRequiredModules === 'object' && (userRequiredModules as UserModule[]).length !== undefined) {
    for (const moduleItem of userRequiredModules as UserModule[]) {
      if (
        userModulesMap[moduleItem.moduleName] &&
        (userModulesMap[moduleItem.moduleName] === moduleItem.permission ||
          (checkAtLeastPermission && userModulesMap[moduleItem.moduleName] === USER_MODULE_PERIMISSION.OWNER))
      ) {
        return true;
      }
    }
  } else {
    const userRequiredModulesAsObject = userRequiredModules as UserModule;
    return (
      userModulesMap[userRequiredModulesAsObject.moduleName] &&
      (userModulesMap[userRequiredModulesAsObject.moduleName] === userRequiredModulesAsObject.permission ||
        (checkAtLeastPermission &&
          userModulesMap[userRequiredModulesAsObject.moduleName] === USER_MODULE_PERIMISSION.OWNER))
    );
  }

  return false;
};

export const getAccessToken = (): string | null => {
  const rawAuthState = CacheService.getProperty(CACHE_KEYS.RC_AUTH_STATE);
  if (rawAuthState) {
    try {
      const authState = JSON.parse(rawAuthState);

      return authState[CACHE_KEYS.ACCESS_TOKEN_SUB_KEY] ? authState[CACHE_KEYS.ACCESS_TOKEN_SUB_KEY] : null;
    } catch (error) {
      return null;
    }
  }
  return null;
};

export function setCurrentPageTitle(pageTitle: string) {
  document.title = pageTitle;
}
