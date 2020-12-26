import axios from "axios";
import queryString from "query-string";
import { IAuthApiClient } from "../../../types";
import {
  USER_INFO_QUERY_RESPONSE,
  AuthenticationResponse,
} from "../graphql/types";

export default class AuthRestClient implements IAuthApiClient {
  tokenEndpoint: string;

  constructor(tokenEndpoint: string) {
    this.tokenEndpoint = tokenEndpoint;
  }
  getUserOrganizations(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getUserInfo(): Promise<USER_INFO_QUERY_RESPONSE | null> {
    throw new Error("Method not implemented.");
  }
  getToken = async (
    accessCode: string,
    callbackUrl: string
  ): Promise<AuthenticationResponse | null> => {
    const { data } = await axios({
      method: "post",
      url: this.tokenEndpoint,
      data: queryString.stringify({
        grant_type: "authorization_code",
        client_id: "32e0bv831hs4t6fa72hn9etptt",
        redirect_uri: callbackUrl,
        code: accessCode,
        scope: "aws.cognito.signin.user.admin email openid phone profile",
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    return {
      idToken: data.id_token as string,
      expiresIn: data.expires_in as number,
      tokenType: data.token_type as string,
      accessToken: data.access_token as string,
      refreshToken: data.refresh_token as string,
    };
  };
}
