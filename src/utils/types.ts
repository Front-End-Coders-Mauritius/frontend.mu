export interface GoogleInfo {
  avatar_url: string;
  email: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  name: string;
  picture: string;
  provider_id: string;
  sub: string;
}

export interface User {
  id: string;
  full_name: string | null;
  email: string;
  current_occupation: string | null;
  veg: boolean | null;
  phone: string | null;
  created_at: string;
  avatar_url: string | null;
  google?: GoogleInfo;
}

export type Transport = "car" | "bus" | "need a ride";

export type Meal = "nonveg" | "veg" | "not-eating";

export type RSVPMetaObject = {
  transport: Transport;
  meal: Meal;
  avatar_url: string;
};
