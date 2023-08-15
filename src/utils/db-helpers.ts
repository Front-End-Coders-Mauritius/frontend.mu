import { supabase } from "./supabase";
import { userProfile } from "../store/userStore";
import type {
  User,
  RSVPMetaObject,
  MeetupAttendees,
  IRSVPStatus,
} from "./types";

/* User Profile Functions */

export const getUserProfile = async () => {
  const { data, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.log(sessionError);
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data?.session?.user?.id);

  if (error) {
    console.log(error);
    return null;
  }

  return profile[0];
};

export const updateUserProfile = async (profile: Partial<User>) => {
  const userProfileData = userProfile.get();

  const { data, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", userProfileData?.id)
    .select("*");

  if (error) {
    console.log(error);
    return null;
  }

  return data[0];
};

/* Meetup RSVP Functions */

export const getMeetupRSVPStatus = async (
  meetupId: string
): Promise<IRSVPStatus | null> => {
  const userProfileData = userProfile.get();

  const { data, error } = await supabase
    .from("meetup_rsvp")
    .select("*")
    .eq("meetup_id", meetupId)
    .eq("user_uid", userProfileData?.id)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return data;
};

export const setMeetupRSVP = async (
  meetupId: string,
  rsvp: boolean,
  meta: RSVPMetaObject,
  allowOnSite: boolean
) => {
  const userProfileData = userProfile.get();

  // check if user has already RSVP'd
  const { data: existingRSVP, error: existingRSVPError } = await supabase
    .from("meetup_rsvp")
    .select("*")
    .eq("meetup_id", meetupId)
    .eq("user_uid", userProfileData?.id);

  if (existingRSVPError) {
    // console.log(existingRSVPError);
    return null;
  }

  // if user has already RSVP'd, update their RSVP
  if (existingRSVP[0]) {
    const { data, error } = await supabase
      .from("meetup_rsvp")
      .update({
        user_metadata: userProfileData,
        meta,
        rsvp,
        showOnSite: allowOnSite,
      })
      .eq("id", existingRSVP[0].id);

      if (error) {
      console.log(error);
      return null;
    }

    return data;
  } else {
    // if user has not RSVP'd, create a new RSVP
    const { data, error } = await supabase
      .from("meetup_rsvp")
      .insert([
        {
          meetup_id: meetupId,
          user_uid: userProfileData?.id,
          user_metadata: userProfileData,
          meta,
          rsvp,
          showOnSite: allowOnSite,
        },
      ])
      .select("*");

    if (error) {
      console.log(error);
      return null;
    }

    return data;
  }
};

export const getMeetupAttendees = async (
  meetupId: string
): Promise<MeetupAttendees[] | null> => {
  const { data, error } = await supabase
    .rpc("get_rsvp_list", {
      meetup_id: meetupId,
    })
    .select("*");

  if (error) {
    console.log(error);
    return null;
  }

  return data;
};

const getMeetupAttendeesCount = async (meetupId: string): Promise<any> => {
  const { data, error } = await supabase
    .rpc("get_rsvp_list_count", {
      meetup_id: meetupId,
    })
    .single<{ cnt: number }>();

  if (error) {
    console.log(error);
    return null;
  }

  return data?.cnt;
};
