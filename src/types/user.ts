// The user data the API sends back (matches toPublicUser in theo-api)
export type Role = "user" | "admin" | "superadmin";

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  bio: string;
  location: string;
};
