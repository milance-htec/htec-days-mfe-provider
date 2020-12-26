import { GraphQLClient } from "graphql-request";

import {
  GET_TOKENS_QUERY,
  USER_INFO_QUERY,
  USER_ORGANIZATIONS_QUERY,
} from "./queries";
import { IAuthApiClient, CACHE_KEYS } from "../../../types";
import { CacheService } from "../../../services/local-storage.service";
import {
  USER_INFO_QUERY_RESPONSE,
  USER_INFO_QUERY_VARIABLES,
  AuthenticationResponse,
  GET_TOKENS_QUERY_RESPONSE,
  GET_TOKENS_QUERY_VARIABLES,
  USER_ORGANIZATIONS_QUERY_RESPONSE,
  Organization,
} from "./types";
import { ReefCloudAuthState } from "../../../services/reef-cloud-auth.service";

export type AuthGqlClientOptions = {
  endpoint: string;
  securedEndpoint: string;
};

export default class AuthGqlClient implements IAuthApiClient {
  gql_client: GraphQLClient;
  gql_secured_client: GraphQLClient;

  constructor(options: AuthGqlClientOptions) {
    this.gql_client = new GraphQLClient(options.endpoint, { headers: {} });
    this.gql_secured_client = new GraphQLClient(options.securedEndpoint, {
      headers: {},
    });
  }

  static getAccessToken(): string | null {
    let authState: ReefCloudAuthState | null = null;

    try {
      authState = JSON.parse(
        CacheService.getProperty(CACHE_KEYS.RC_AUTH_STATE) || ""
      );
    } catch (error) {
      console.warn("User not authenticated");
      return null;
    }

    return authState?.accessToken || null;
  }

  getUserOrganizations = async (): Promise<Array<Organization> | null> => {
    try {
      this.gql_secured_client.setHeader(
        "Authorization",
        `Bearer ${AuthGqlClient.getAccessToken() || ""}`
      );
      const response = await this.gql_secured_client.request<
        USER_ORGANIZATIONS_QUERY_RESPONSE
      >(USER_ORGANIZATIONS_QUERY);

      return response.userOrganizations.content;
    } catch (error) {
      return null;
    }
  };

  getToken = async (
    accessCode: string,
    callbackUrl: string
  ): Promise<AuthenticationResponse | null> => {
    try {
      const data = await this.gql_client.request<
        GET_TOKENS_QUERY_RESPONSE,
        GET_TOKENS_QUERY_VARIABLES
      >(GET_TOKENS_QUERY, {
        accessCode,
        redirectUrl: callbackUrl,
      });

      return data.getTokens;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getUserInfo = async (
    organizationId: string
  ): Promise<USER_INFO_QUERY_RESPONSE | null> => {
    try {
      this.gql_secured_client.setHeader(
        "Authorization",
        `Bearer ${AuthGqlClient.getAccessToken() || ""}`
      );

      const data = await this.gql_secured_client.request<
        USER_INFO_QUERY_RESPONSE,
        USER_INFO_QUERY_VARIABLES
      >(USER_INFO_QUERY, {
        organizationId,
      });

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
