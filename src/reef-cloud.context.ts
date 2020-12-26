import React from 'react';
import { IReefCloudContext } from './types';

export type OrganizationUserDataRole = {
  id: string;
  name: string;
};

export const ReefCloudContext = React.createContext<IReefCloudContext>({
  userModules: [],
  userModulesMap: {},
  loading: true,
  authState: null,
  userOrganizationId: null,
  organizationUserData: null,
  userAuthorizationData: null,
  suspendedActionData: null,
  setSuspendUserData: () => {},
  refetchUserOrganizationData: () => {},
  login: () => {},
  logout: () => {},
  getTokens: () => Promise.resolve(''),
  globalLogout: () => {},
  setOrganizationId: () => {},
});
