import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { getDayjsInstance } from "./commonUtils";
import { RELATIVE_TIME_CONFIG } from "./constants/relativeTimeConfig";

dayjs.extend(relativeTime, RELATIVE_TIME_CONFIG);
dayjs.extend(utc);

// Get the elapsed time in seconds between a timestamp and now (in UTC)
export const getElapsedTimeInSecondsUtc = (timestamp) => {
  const dateInUtc = dayjs.utc(timestamp); // Convert timestamp to UTC
  const elapsedTimeInSeconds = dayjs.utc().diff(dateInUtc, "second");

  return elapsedTimeInSeconds;
};

// Format given time using dayjs relativeTime with UTC conversion
export const getRelativeTime = (timestamp, locale = null) => {
  const dayjsInstance = getDayjsInstance(locale);
  const timestampInUtc = dayjs.utc(timestamp);

  return dayjsInstance.to(timestampInUtc, true);
};
