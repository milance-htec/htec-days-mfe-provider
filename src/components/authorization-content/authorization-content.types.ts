import { CSSProperties } from "react";

import { UserModule } from "../../common/types";

export interface BaseComponentProps<E = HTMLElement> {
  children?: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<E, MouseEvent>) => void;
  style?: CSSProperties;
}

export interface AuthorizationContentProps extends BaseComponentProps {
  requiredModules?: UserModule[] | UserModule;
  replacementContent?: any;
  authOpen?: boolean;
  checkAtLeastPermission?: boolean;
}
