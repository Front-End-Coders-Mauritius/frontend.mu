import { supabase } from "./supabase";
import { userProfile } from "../store/userStore";
import type { User } from "./types";

/* User Profile Functions */

export const getUserProfile = async () => {
  const { data: profile, error } = await supabase.from("profiles").select("*");

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
    .eq("id", userProfileData?.id);

  if (error) {
    console.log(error);
    return null;
  }

  return data;
};

/* Meetup RSVP Functions */

export const setMeetupRSVP = async (
  meetupId: string,
  rsvp: boolean,
  transport: string
) => {
  const userProfileData = userProfile.get();

  const { data, error } = await supabase.from("meetup_rsvp").insert([
    {
      meetup_id: meetupId,
      user_uid: userProfileData?.id,
      user_metadata: userProfileData,
      rsvp,
      transport,
    },
  ]);

  if (error) {
    console.log(error);
    return null;
  }

  return data;
};
