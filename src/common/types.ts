export type UserModuleMap = { [moduleName: string]: UserModulePermission };

export type UserModulePermission = "OWNER" | "VIEWER";

export type UserModule = {
  moduleName: string;
  permission: UserModulePermission;
};
