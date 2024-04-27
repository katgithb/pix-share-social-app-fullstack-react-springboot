import { RelativeTimeLocale } from "./constants/relativeTimeLocales";
import { getElapsedTimeInSecondsUtc, getRelativeTime } from "./timeUtils";

export const getRelativeCommentTime = (commentTimestamp) => {
  // Calculate the elapsed time between the comment timestamp and the current time
  const elapsedTime = getElapsedTimeInSecondsUtc(commentTimestamp);

  if (elapsedTime < 60) {
    return "just now";
  }

  const commentDayjsLocale = RelativeTimeLocale.COMMENT_LOCALE;

  return getRelativeTime(commentTimestamp, commentDayjsLocale) + " ago";
};

export const isCurrUserComment = (currUserId, commentUserId) => {
  return currUserId && commentUserId && currUserId === commentUserId
    ? true
    : false;
};
