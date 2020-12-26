import { FunctionComponent } from "react";

/* Types */
import { UserModule } from "../../common/types";
import useReefCloud from "../../reef-cloud.hook";
import { AuthorizationContentProps } from "./authorization-content.types";
import { showContentIfRequiredModuleIsPresent } from "../../common/utility";

export const AuthorizationContent: FunctionComponent<AuthorizationContentProps> = ({
  authOpen,
  checkAtLeastPermission,
  children,
  replacementContent,
  requiredModules,
}) => {
  const { userModules, userModulesMap } = useReefCloud();

  const contentToRender =
    authOpen ||
    (userModulesMap &&
      requiredModules !== undefined &&
      ((typeof (requiredModules as UserModule[]) === "object" &&
        (requiredModules as UserModule[]).length !== undefined) ||
        (requiredModules as UserModule)) &&
      userModules &&
      userModules.length &&
      showContentIfRequiredModuleIsPresent(userModulesMap)(
        requiredModules,
        checkAtLeastPermission
      ))
      ? children
      : replacementContent || null;

  return contentToRender;
};
