import jwt_decode from 'jwt-decode';
import queryString from 'query-string';

import AuthGqlClient from '../api/auth/graphql';
import { CacheService } from './local-storage.service';
import { ReefCloudAuthServiceOptions } from '../types';
import { CACHE_KEYS, LoginOptions, IAuthApiClient } from '../types';
import { UserOrganizationAuthorizationData, Organization } from '../api/auth/graphql/types';

export type ReefCloudAuthState = {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};

export type Role = {
  id: string;
  name: string;
};

export type OrganizationUserData = {
  id: string;
  username: string;
  isSsoUser: boolean;
  givenName: string;
  familyName: string;
  fullName: string;
  profilePictureUrl: string;
  email: string;
  temporaryEmail: string;
  phoneNumber: string;
  userStatus: string;
  invitedOnDate: string;
  acceptedOnDate: string;
  roles: Role[];
};

export type UserAuthorizationData = {
  globalReefAdmin: boolean;
  organizationAuthorizationData: UserOrganizationAuthorizationData[];
};

export type ReefCloudUserInfo = {
  organizationUserData: OrganizationUserData;
  userAuthorizationData: UserAuthorizationData;
};

const CLOCK_DRIFT = 300;

export default class ReefCloudAuthService {
  callbackUrl: string;
  loginUrl: string;
  authState: ReefCloudAuthState | null;
  logoutEndpoint: string | undefined;
  authApiClient: IAuthApiClient;

  constructor(options: ReefCloudAuthServiceOptions) {
    this.callbackUrl = options.callbackUrl;
    this.loginUrl = options.loginUrl;
    this.logoutEndpoint = options.logoutEndpoint;

    this.authApiClient = new AuthGqlClient({
      endpoint: `${options.authApiUrl}/open`,
      securedEndpoint: `${options.authApiUrl}`,
    });

    this.authState = ReefCloudAuthService.getInitialAuthState();
  }

  getAuthState = (): ReefCloudAuthState | null => {
    return this.authState;
  };

  static getInitialAuthState(): ReefCloudAuthState | null {
    try {
      let authState: ReefCloudAuthState | null;

      try {
        authState = JSON.parse(CacheService.getProperty(CACHE_KEYS.RC_AUTH_STATE) || '');
      } catch (error) {
        authState = null;
        console.warn('User not authenticated');
      }

      if (!authState?.accessToken) {
        return null;
      }

      // TODO:check is valid interface ReefCloudAuthState
      const decodedJwt = jwt_decode(authState.accessToken);
      //@ts-ignore
      // TODO: validate epoch is a number
      const accessTokenExpirationEpochTime = decodedJwt['exp'] as number;

      const currentEpochTime = Math.floor(new Date().getTime() / 1000);

      if (accessTokenExpirationEpochTime < currentEpochTime + CLOCK_DRIFT) {
        // TODO: at this point might be expired or have less than 5 min
        CacheService.removeProperty(CACHE_KEYS.RC_AUTH_STATE);
        return null;
      }

      return authState;
    } catch (error) {
      CacheService.removeProperty(CACHE_KEYS.RC_AUTH_STATE);
      return null;
    }
  }

  static getCachedOrganizationId(): string | null {
    let userOrganizationId: string | null = null;

    const cachedOrganizationIdValue = CacheService.getProperty(CACHE_KEYS.ORGANIZATION_ID);

    if (cachedOrganizationIdValue !== null) {
      userOrganizationId = cachedOrganizationIdValue;
    }

    return userOrganizationId;
  }

  getUserData = async (organizationId: string): Promise<ReefCloudUserInfo | null> => {
    console.debug('Fetching user data....');

    try {
      const userInfo = await this.authApiClient.getUserInfo(organizationId);
      if (userInfo) {
        return {
          organizationUserData: userInfo.organizationUserData,
          userAuthorizationData: userInfo.userAuthorizationData,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  static setOrganizationId = (organizationId: String) => {
    CacheService.setProperty(CACHE_KEYS.ORGANIZATION_ID, organizationId);
  };

  getOrganizationId = async (): Promise<string | null> => {
    let userOrganizations: Organization[] | null = null;

    try {
      userOrganizations = await this.authApiClient.getUserOrganizations();
    } catch (error) {
      console.error(error);
    }

    if (!userOrganizations || userOrganizations.length <= 0) {
      CacheService.removeProperty(CACHE_KEYS.RC_AUTH_STATE);
      throw new Error("User doesn't have any organization available");
    }

    const cachedOrganizationId = ReefCloudAuthService.getCachedOrganizationId();

    let currentOrganizationId: string | null = null;

    if (cachedOrganizationId) {
      try {
        if (!userOrganizations?.some((x) => x.id === String(cachedOrganizationId))) {
          console.warn(`organization id:${cachedOrganizationId} not found in current user's organizations`);

          currentOrganizationId = userOrganizations[0].id;

          CacheService.setProperty(CACHE_KEYS.ORGANIZATION_ID, currentOrganizationId.toString());
        } else {
          currentOrganizationId = cachedOrganizationId;
        }
      } catch (error) {
        console.log(error);
        CacheService.removeProperty(CACHE_KEYS.ORGANIZATION_ID);
      }
    } else {
      currentOrganizationId = userOrganizations[0].id;
      CacheService.setProperty(CACHE_KEYS.ORGANIZATION_ID, currentOrganizationId);
    }

    return currentOrganizationId;
  };

  login = (options?: LoginOptions) => {
    const query: any = {
      redirect_url: this.callbackUrl,
      state: btoa(JSON.stringify({ ref_url: options?.ref_url, ...options?.state })),
    };

    const encodedQuery = queryString.stringify(query, {
      skipEmptyString: true,
    });

    window.location.replace(`${this.loginUrl}?${encodedQuery}`);
  };

  logout = () => {
    CacheService.removeProperty(CACHE_KEYS.RC_AUTH_STATE);
    this.authState = null;
  };

  globalLogout = () => {
    if (this.logoutEndpoint) {
      window.location.href = this.logoutEndpoint;
    } else {
      console.warn('Global logout not configured');
    }
  };

  getTokens = async (accessCode: string) => {
    try {
      const data = await this.authApiClient.getToken(accessCode, this.callbackUrl);

      CacheService.setProperty(CACHE_KEYS.RC_AUTH_STATE, JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }

    return '';
  };
}
