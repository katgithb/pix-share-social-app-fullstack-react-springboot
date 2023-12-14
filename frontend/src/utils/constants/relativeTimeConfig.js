// Thresholds for calculating relative time units
const RELATIVE_TIME_THRESHOLDS = [
  { l: "s", r: 1 },
  { l: "m", r: 1 },
  { l: "mm", r: 59, d: "minute" },
  { l: "h", r: 1 },
  { l: "hh", r: 23, d: "hour" },
  { l: "d", r: 1 },
  { l: "dd", r: 6, d: "day" },
  { l: "w", r: 1 },
  { l: "ww", r: 4, d: "week" },
  { l: "M", r: 1 },
  { l: "MM", r: 11, d: "month" },
  { l: "y", r: 1 },
  { l: "yy", d: "year" },
];

// Config for dayjs relativeTime plugin
export const RELATIVE_TIME_CONFIG = {
  thresholds: RELATIVE_TIME_THRESHOLDS,
  rounding: Math.floor,
};
