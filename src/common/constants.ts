import { UserModulePermission } from "./types";

export const USER_MODULE_PERIMISSION: {
  [K in UserModulePermission]: UserModulePermission;
} = {
  OWNER: "OWNER",
  VIEWER: "VIEWER",
};
