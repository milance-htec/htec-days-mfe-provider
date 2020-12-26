import { gql } from "graphql-request";

export const GET_TOKENS_QUERY = gql`
  query getTokens($accessCode: String!, $redirectUrl: String!) {
    getTokens(accessCode: $accessCode, redirectUrl: $redirectUrl) {
      idToken
      accessToken
      refreshToken
      expiresIn
      tokenType
    }
  }
`;

export const USER_INFO_QUERY = gql`
  query userInfo($organizationId: ID!) {
    userAuthorizationData {
      globalReefAdmin
      organizationAuthorizationData {
        organizationId
        modulePermissions {
          moduleName
          permission
        }
      }
    }
    organizationUserData(organizationId: $organizationId) {
      id
      username
      isSsoUser
      givenName
      familyName
      fullName
      email
      temporaryEmail
      phoneNumber
      userStatus
      invitedOnDate
      acceptedOnDate
      roles {
        id
        name
      }
    }
  }
`;

export const USER_ORGANIZATIONS_QUERY = gql`
  query userOrganizations {
    userOrganizations(pageSize: 100) {
      content {
        id
        name
        description
        status
      }
    }
  }
`;
