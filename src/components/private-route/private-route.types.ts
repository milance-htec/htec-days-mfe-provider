import { RouteProps } from "react-router-dom";
import { UserModule } from "../../common/types";

export interface IPrivateRouteProps extends RouteProps {
  requiredUserModules?: UserModule | UserModule[];
}
