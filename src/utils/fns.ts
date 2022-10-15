export const getGithubUrl = (username: string) => {
  const speaker_photo = username
    ? "https://github.com/" + username + ".png"
    : "https://github.com/Github.png";

  return speaker_photo;
};
