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

export interface IRSVPStatus {
  created_at?: string;
  id?: string;
  meetup_id?: string;
  meta?: RSVPMetaObject;
  rsvp: Boolean;
  showOnSite?: Boolean;
  user_metadata?: User;
  user_uid?: string;
}

export interface User {
  id: string;
  full_name: string | null;
  email: string;
  current_occupation: string | null;
  meal: string | null;
  transport: string | null;
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
  current_occupation: string;
  phone: string;
};

export interface MeetupAttendees {
  meetup_id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export type DirectusEvent = {
  id: number
  title: string
  description: any
  Location: string
  Venue: string
  Date: string
  Time: string
  Attendees: number
  images: any
  rsvplink: any
  album: any
  seats_available: number
  accepting_rsvp: boolean
  rsvp_closing_date: string
  rsvp: Array<number>
};

export type DirectusAstroUser = {
  id?: string
  first_name?: string
  last_name?: string
  email?: string
  meal?: string
  Events?: { Events_id: DirectusEvent | string }[]
}