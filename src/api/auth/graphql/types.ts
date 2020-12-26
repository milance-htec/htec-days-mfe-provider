import { UserModule } from '../../../common/types';
import { Role } from '../../../services/reef-cloud-auth.service';

export type GET_TOKENS_QUERY_RESPONSE = {
  getTokens: AuthenticationResponse;
};

export type GET_TOKENS_QUERY_VARIABLES = {
  accessCode: string;
  redirectUrl: string;
};

export type USER_INFO_QUERY_RESPONSE = {
  organizationUserData: OrganizationUser;
  userAuthorizationData: UserAuthorizationData;
};

export type USER_INFO_QUERY_VARIABLES = {
  organizationId: string;
};

export type USER_ORGANIZATIONS_QUERY_RESPONSE = {
  userOrganizations: OrganizationsResponse;
};

export type OrganizationsResponse = {
  content: Organization[];
  totalPages: number;
  totalItems: number;
};

export type AuthenticationResponse = {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
};

export type OrganizationUser = {
  id: string;
  username: string;
  isSsoUser: boolean;
  givenName: string;
  familyName: string;
  fullName: string;
  email: string;
  temporaryEmail: string;
  profilePictureUrl: string;
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

export type UserOrganizationAuthorizationData = {
  organizationId: string;
  modulePermissions: UserModule[];
};

// export type UserModule = {
//   moduleName: string;
//   permission: string;
// };

export type Organization = {
  id: string;
  name: string;
  description: string;
  status: string;
};
