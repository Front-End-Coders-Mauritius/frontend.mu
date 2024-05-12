import { atom } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import type { User } from "@/utils/types";

export const isUserLoggedIn = atom<boolean>(false);

export const userProfile = persistentAtom<User | null>("userProfile", null, {
  encode(value) {
    return JSON.stringify(value);
  },
  decode(value) {
    return JSON.parse(value);
  },
});
