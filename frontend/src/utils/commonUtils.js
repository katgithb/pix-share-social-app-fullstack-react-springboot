import dayjs from "dayjs";
import numbro from "numbro";
import { RelativeTimeLocale } from "./constants/relativeTimeLocales";

// Factory function to create dayjs instance
export const getDayjsInstance = (customLocale = null) => {
  const locale = customLocale
    ? customLocale
    : RelativeTimeLocale.DEFAULT_LOCALE;
  return dayjs().locale("en", locale);
};

// Format given number in a human-readable representation using numbro
export const getHumanReadableNumberFormat = (count) => {
  const formattedCount = numbro(count).format({
    average: true,
    mantissa: 2,
    optionalMantissa: true,
    trimMantissa: true,
    thousandSeparated: true,
  });

  return formattedCount;
};
