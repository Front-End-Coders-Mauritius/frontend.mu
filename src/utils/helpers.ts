import type { User } from "./types";

export const random = (list: string[] | number[]) =>
  list[Math.floor(Math.random() * list.length)];

// a function that converts string to safe variable name
// Path: src/utils/helpers.ts
export const toSafeVarName = (str: string) => {
  return str
    .toString()
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .toLowerCase();
};

export const getCookieValue = (name) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

export const vTransitionName = (modelType: string = "meetup", str: string) => {
  return `view-transition-name: ${toSafeVarName(modelType)}-${toSafeVarName(
    str
  )}`;
};

// convert 2023-08-26 ti August 26, 2023
// Path: src/utils/helpers.ts
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const mapToValidUser = (user: any): User => {
  return {
    id: user.id,
    full_name: user.first_name + " " + user.last_name,
    email: user.email,
    current_occupation: user?.current_occupation || "",
    meal: user?.meal || "",
    transport: user.transport || "",
    phone: user.phone || "",
    created_at: user?.created_at || "",
    avatar_url: user.avatar_url,
    google: user.google,

  }
}


export const DIRECTUS_URL = () => {
  return 'https://directus.frontend.mu';
  // return process.env.NODE_ENV === 'production'
  //   ? 'https://directus.frontend.mu'
  //   : 'http://localhost:8055'
}