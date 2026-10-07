// The user data the API sends back (matches toPublicUser in theo-api)
export type Role = "user" | "admin" | "superadmin";

export type User = {
  id: string;
  firstName: string;
  lastName: string; // "" when not given
  name: string; // first and last name joined, built by the API
  username: string;
  email: string;
  role: Role;
  bio: string;
  location: string;
  avatarUrl: string | null; // null = no profile photo yet
};