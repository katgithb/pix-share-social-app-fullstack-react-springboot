import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getDayjsInstance } from "./commonUtils";
import { RELATIVE_TIME_CONFIG } from "./constants/relativeTimeConfig";

dayjs.extend(relativeTime, RELATIVE_TIME_CONFIG);

// Get the elapsed time in seconds between a timestamp and now
export const getElapsedTimeInSeconds = (timestamp) => {
  const date = dayjs(timestamp);
  const elapsedTimeInSeconds = dayjs().diff(date, "second");

  return elapsedTimeInSeconds;
};

// Format given time using dayjs relativeTime
export const getRelativeTime = (timestamp, locale = null) => {
  const dayjsInstance = getDayjsInstance(locale);

  return dayjsInstance.to(dayjs(timestamp), true);
};
