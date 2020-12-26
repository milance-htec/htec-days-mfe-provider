import { ReefCloudAuthState, OrganizationUserData } from './services/reef-cloud-auth.service';

/* Types */
import {
  AuthenticationResponse,
  USER_INFO_QUERY_RESPONSE,
  Organization,
  UserAuthorizationData,
} from './api/auth/graphql/types';
import { UserModuleMap, UserModule } from './common/types';

/* Cosntants */
import { SuspendError, SuspendType } from './constants';

export const CACHE_KEYS = {
  RC_AUTH_STATE: 'rc_auth',
  ORGANIZATION_ID: 'organizationId',
  ACCESS_TOKEN_SUB_KEY: 'accessToken',
};

export type ReefCloudAuthServiceOptions = {
  callbackUrl: string;
  loginUrl: string;
  logoutEndpoint?: string;
  authApiUrl: string;
};

export type ReefCloudProviderOptions = {
  authServiceOptions: ReefCloudAuthServiceOptions;
};

export type IReefCloudContext = {
  loading: boolean;
  authState: ReefCloudAuthState | null;
  userModules: UserModule[] | undefined;
  userModulesMap: UserModuleMap | undefined;
  userOrganizationId: string | null;
  organizationUserData: OrganizationUserData | null;
  userAuthorizationData: UserAuthorizationData | null;
  suspendedActionData: SuspendedData | null;
  refetchUserOrganizationData: () => void;
  setSuspendUserData: (suspendUserData: SuspendData | null) => void;
  setOrganizationId: (organizationId: string) => void;
  login: (options?: LoginOptions) => void;
  logout: () => void;
  getTokens: (accessCode: string) => Promise<string>;
  globalLogout: () => void;
};

export type LoginOptions = {
  ref_url?: string;
  state?: any;
};

export interface IAuthApiClient {
  getToken(accessCode: string, callbackUrl: string): Promise<AuthenticationResponse | null>;

  getUserInfo(organizationId: string): Promise<USER_INFO_QUERY_RESPONSE | null>;
  getUserOrganizations(): Promise<Array<Organization> | null>;
}

export type SuspendData = {
  reason: SuspendError;
};

export type SuspendedData = {
  type: SuspendType;
};
