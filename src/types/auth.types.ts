export type Role = "customer" | "admin";

export type AuthUser = {
  uid: string;
  email: string;
  role: Role;
};
