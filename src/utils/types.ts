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
    occupation: string | null;
    phone: string | null;
    created_at: string;
    avatar_url: string | null;
    google?: GoogleInfo;
    github_username?: string;
    profile_picture?: string | null;
    role: "sso_google" | "Admin";
}

// export type Transport = "car" | "bus" | "need a ride";

// export type Meal = "nonveg" | "veg" | "not-eating";

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
    description: string
    Location: string
    Venue: string
    Date: string
    Time: string
    Attendees: number
    images: any
    rsvplink: any
    album: string
    seats_available: any
    accepting_rsvp: any
    rsvp_closing_date: any
    gallery: any[]
    sessions: Session[]
    sponsors: Sponsor[]
};

export interface Session {
    id: number
    Events_id: EventsId
    Session_id: SessionId
}

export interface EventsId {
    id: number
    title: string
    description: string
    Location: string
    Venue: string
    Date: string
    Time: string
    Attendees: number
    images: any
    rsvplink: any
    album: string
    seats_available: any
    accepting_rsvp: any
    rsvp_closing_date: any
    gallery: any[]
    sessions: number[]
    sponsors: number[]
}

export interface SessionId {
    title: string
    speakers: Speakers
}

export interface Speakers {
    name: string
    id: string
    github_account: string
}

export interface Sponsor {
    id: number
    Events_id: number
    Sponsor_id: SponsorId
}

export interface SponsorId {
    id: string
    status: string
    sort: any
    date_created: string
    date_updated: string
    Name: string
    Website: string
    Description: any
    Sponsor_type: string[]
    darkbg: boolean
    Logo: Logo
}

export interface Logo {
    id: string
    storage: string
    filename_disk: string
    filename_download: string
    title: string
    type: string
    folder: any
    uploaded_by: string
    uploaded_on: string
    modified_by: any
    modified_on: string
    charset: any
    filesize: number
    width: number
    height: number
    duration: any
    embed: any
    description: any
    location: any
    tags: any
    metadata: Metadata
}

export interface Metadata { }


export type DirectusAstroUser = {
    id?: string
    first_name?: string
    last_name?: string
    full_name?: string
    email?: string
    meal?: string
    transport?: string
    occupation?: string
    phone?: string | null
    github_username?: string
    profile_picture?: string
    Events?: { Events_id: DirectusEvent | string }[]
}

export type ToastTypes = 'SUCCESS' | 'WARNING' | 'INFO' | 'ERROR'

export type SiteToast = {
    title?: string
    message?: string
    type: ToastTypes | undefined
    visible: boolean,
}

// typescript enums are bad

export type Meal = "veg" | "non_veg" | "no_food"

export type Transport = "bus" | "car" | "need_a_ride" | "other"

export type Occupation = "developer" | "student" | "manager" | "designer" | "hr" | "other"

export type RSVPMetaData = {
    meal: Meal
    transport: Transport
    occupation: Occupation
    is_public: boolean
    meta?: string
    name: string | null | undefined
    profile_picture: string | null | undefined
}

export type Attendee = {
    Events_id: string
    directus_users_id: string
    id: string
    is_public: boolean
    name: string
    profile_picture: string
    verified: boolean
}

export type RSVPResponse = {
    is_public?: boolean
    meal?: string
    name?: string
    occupation?: string
    transport?: string
}