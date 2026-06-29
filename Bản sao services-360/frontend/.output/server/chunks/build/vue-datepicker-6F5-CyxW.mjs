import { v as vueExports } from './server.mjs';
import { o as onClickOutside, b as unrefElement, d as useSwipe } from './index-QmZAbLx-.mjs';
import { d as useFloating, o as offset, e as arrow, f as flip, s as shift, h as autoUpdate } from './PopperArrow-C9hHWuSZ.mjs';

const millisecondsInWeek = 6048e5;
const millisecondsInDay = 864e5;
const millisecondsInMinute = 6e4;
const millisecondsInHour = 36e5;
const millisecondsInSecond = 1e3;
const constructFromSymbol = /* @__PURE__ */ Symbol.for("constructDateFrom");
function constructFrom(date, value) {
  if (typeof date === "function") return date(value);
  if (date && typeof date === "object" && constructFromSymbol in date)
    return date[constructFromSymbol](value);
  if (date instanceof Date) return new date.constructor(value);
  return new Date(value);
}
function toDate(argument, context) {
  return constructFrom(context || argument, argument);
}
function addDays(date, amount, options) {
  const _date = toDate(date, options?.in);
  if (isNaN(amount)) return constructFrom(options?.in || date, NaN);
  if (!amount) return _date;
  _date.setDate(_date.getDate() + amount);
  return _date;
}
function addMonths(date, amount, options) {
  const _date = toDate(date, options?.in);
  if (isNaN(amount)) return constructFrom(date, NaN);
  if (!amount) {
    return _date;
  }
  const dayOfMonth = _date.getDate();
  const endOfDesiredMonth = constructFrom(date, _date.getTime());
  endOfDesiredMonth.setMonth(_date.getMonth() + amount + 1, 0);
  const daysInMonth = endOfDesiredMonth.getDate();
  if (dayOfMonth >= daysInMonth) {
    return endOfDesiredMonth;
  } else {
    _date.setFullYear(
      endOfDesiredMonth.getFullYear(),
      endOfDesiredMonth.getMonth(),
      dayOfMonth
    );
    return _date;
  }
}
function add(date, duration, options) {
  const {
    years = 0,
    months = 0,
    weeks = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0
  } = duration;
  const _date = toDate(date, options?.in);
  const dateWithMonths = months || years ? addMonths(_date, months + years * 12) : _date;
  const dateWithDays = days || weeks ? addDays(dateWithMonths, days + weeks * 7) : dateWithMonths;
  const minutesToAdd = minutes + hours * 60;
  const secondsToAdd = seconds + minutesToAdd * 60;
  const msToAdd = secondsToAdd * 1e3;
  return constructFrom(date, +dateWithDays + msToAdd);
}
let defaultOptions = {};
function getDefaultOptions$1() {
  return defaultOptions;
}
function startOfWeek(date, options) {
  const defaultOptions2 = getDefaultOptions$1();
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  const _date = toDate(date, options?.in);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  _date.setDate(_date.getDate() - diff);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
function startOfISOWeek(date, options) {
  return startOfWeek(date, { ...options, weekStartsOn: 1 });
}
function getISOWeekYear(date, options) {
  const _date = toDate(date, options?.in);
  const year = _date.getFullYear();
  const fourthOfJanuaryOfNextYear = constructFrom(_date, 0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
  const fourthOfJanuaryOfThisYear = constructFrom(_date, 0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}
function getTimezoneOffsetInMilliseconds(date) {
  const _date = toDate(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds()
    )
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}
function normalizeDates(context, ...dates) {
  const normalize = constructFrom.bind(
    null,
    dates.find((date) => typeof date === "object")
  );
  return dates.map(normalize);
}
function startOfDay(date, options) {
  const _date = toDate(date, options?.in);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
function differenceInCalendarDays(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate
  );
  const laterStartOfDay = startOfDay(laterDate_);
  const earlierStartOfDay = startOfDay(earlierDate_);
  const laterTimestamp = +laterStartOfDay - getTimezoneOffsetInMilliseconds(laterStartOfDay);
  const earlierTimestamp = +earlierStartOfDay - getTimezoneOffsetInMilliseconds(earlierStartOfDay);
  return Math.round((laterTimestamp - earlierTimestamp) / millisecondsInDay);
}
function startOfISOWeekYear(date, options) {
  const year = getISOWeekYear(date, options);
  const fourthOfJanuary = constructFrom(date, 0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  return startOfISOWeek(fourthOfJanuary);
}
function addQuarters(date, amount, options) {
  return addMonths(date, amount * 3, options);
}
function addYears(date, amount, options) {
  return addMonths(date, amount * 12, options);
}
function compareAsc(dateLeft, dateRight) {
  const diff = +toDate(dateLeft) - +toDate(dateRight);
  if (diff < 0) return -1;
  else if (diff > 0) return 1;
  return diff;
}
function isDate(value) {
  return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
}
function isValid(date) {
  return !(!isDate(date) && typeof date !== "number" || isNaN(+toDate(date)));
}
function getQuarter(date, options) {
  const _date = toDate(date, options?.in);
  const quarter = Math.trunc(_date.getMonth() / 3) + 1;
  return quarter;
}
function differenceInCalendarYears(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate
  );
  return laterDate_.getFullYear() - earlierDate_.getFullYear();
}
function getRoundingMethod(method) {
  return (number) => {
    const round = method ? Math[method] : Math.trunc;
    const result = round(number);
    return result === 0 ? 0 : result;
  };
}
function differenceInYears(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate
  );
  const sign = compareAsc(laterDate_, earlierDate_);
  const diff = Math.abs(differenceInCalendarYears(laterDate_, earlierDate_));
  laterDate_.setFullYear(1584);
  earlierDate_.setFullYear(1584);
  const partial = compareAsc(laterDate_, earlierDate_) === -sign;
  const result = sign * (diff - +partial);
  return result === 0 ? 0 : result;
}
function normalizeInterval(context, interval) {
  const [start, end] = normalizeDates(context, interval.start, interval.end);
  return { start, end };
}
function eachDayOfInterval(interval, options) {
  const { start, end } = normalizeInterval(options?.in, interval);
  let reversed = +start > +end;
  const endTime = reversed ? +start : +end;
  const date = reversed ? end : start;
  date.setHours(0, 0, 0, 0);
  let step = 1;
  const dates = [];
  while (+date <= endTime) {
    dates.push(constructFrom(start, date));
    date.setDate(date.getDate() + step);
    date.setHours(0, 0, 0, 0);
  }
  return reversed ? dates.reverse() : dates;
}
function startOfQuarter(date, options) {
  const _date = toDate(date, options?.in);
  const currentMonth = _date.getMonth();
  const month = currentMonth - currentMonth % 3;
  _date.setMonth(month, 1);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
function eachQuarterOfInterval(interval, options) {
  const { start, end } = normalizeInterval(options?.in, interval);
  let reversed = +start > +end;
  const endTime = reversed ? +startOfQuarter(start) : +startOfQuarter(end);
  let date = reversed ? startOfQuarter(end) : startOfQuarter(start);
  let step = 1;
  const dates = [];
  while (+date <= endTime) {
    dates.push(constructFrom(start, date));
    date = addQuarters(date, step);
  }
  return reversed ? dates.reverse() : dates;
}
function startOfMonth(date, options) {
  const _date = toDate(date, options?.in);
  _date.setDate(1);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
function endOfYear(date, options) {
  const _date = toDate(date, options?.in);
  const year = _date.getFullYear();
  _date.setFullYear(year + 1, 0, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
function startOfYear(date, options) {
  const date_ = toDate(date, options?.in);
  date_.setFullYear(date_.getFullYear(), 0, 1);
  date_.setHours(0, 0, 0, 0);
  return date_;
}
function endOfWeek(date, options) {
  const defaultOptions2 = getDefaultOptions$1();
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  const _date = toDate(date, options?.in);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
  _date.setDate(_date.getDate() + diff);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
function endOfQuarter(date, options) {
  const _date = toDate(date, options?.in);
  const currentMonth = _date.getMonth();
  const month = currentMonth - currentMonth % 3 + 3;
  _date.setMonth(month, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
const formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
};
const formatDistance = (token, count, options) => {
  let result;
  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options?.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }
  return result;
};
function buildFormatLongFn(args) {
  return (options = {}) => {
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format2 = args.formats[width] || args.formats[args.defaultWidth];
    return format2;
  };
}
const dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
const timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
const dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
const formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};
const formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
};
const formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];
function buildLocalizeFn(args) {
  return (value, options) => {
    const context = options?.context ? String(options.context) : "standalone";
    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = options?.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = options?.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;
    return valuesArray[index];
  };
}
const eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
};
const quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
};
const monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
};
const dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
};
const dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
};
const formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
};
const ordinalNumber = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};
const localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};
function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;
    const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];
    const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : (
      // [TODO] -- I challenge you to fix the type
      findKey(parsePatterns, (pattern) => pattern.test(matchedString))
    );
    let value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      options.valueCallback(value)
    ) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
function findKey(object, predicate) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}
function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    const matchedString = matchResult[0];
    const parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
const parseOrdinalNumberPattern = /\d+/i;
const matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
const parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
const matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
const parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
const matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
const parseMonthPatterns = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
const matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
const parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
const matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
const parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
const match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};
const enUS = {
  code: "en-US",
  formatDistance,
  formatLong,
  formatRelative,
  localize,
  match,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function getDayOfYear(date, options) {
  const _date = toDate(date, options?.in);
  const diff = differenceInCalendarDays(_date, startOfYear(_date));
  const dayOfYear = diff + 1;
  return dayOfYear;
}
function getISOWeek(date, options) {
  const _date = toDate(date, options?.in);
  const diff = +startOfISOWeek(_date) - +startOfISOWeekYear(_date);
  return Math.round(diff / millisecondsInWeek) + 1;
}
function getWeekYear(date, options) {
  const _date = toDate(date, options?.in);
  const year = _date.getFullYear();
  const defaultOptions2 = getDefaultOptions$1();
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const firstWeekOfNextYear = constructFrom(options?.in || date, 0);
  firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);
  const firstWeekOfThisYear = constructFrom(options?.in || date, 0);
  firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);
  if (+_date >= +startOfNextYear) {
    return year + 1;
  } else if (+_date >= +startOfThisYear) {
    return year;
  } else {
    return year - 1;
  }
}
function startOfWeekYear(date, options) {
  const defaultOptions2 = getDefaultOptions$1();
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const year = getWeekYear(date, options);
  const firstWeek = constructFrom(options?.in || date, 0);
  firstWeek.setFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  const _date = startOfWeek(firstWeek, options);
  return _date;
}
function getWeek(date, options) {
  const _date = toDate(date, options?.in);
  const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);
  return Math.round(diff / millisecondsInWeek) + 1;
}
function addLeadingZeros(number, targetLength) {
  const sign = number < 0 ? "-" : "";
  const output = Math.abs(number).toString().padStart(targetLength, "0");
  return sign + output;
}
const lightFormatters = {
  // Year
  y(date, token) {
    const signedYear = date.getFullYear();
    const year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
  },
  // Month
  M(date, token) {
    const month = date.getMonth();
    return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
  },
  // Day of the month
  d(date, token) {
    return addLeadingZeros(date.getDate(), token.length);
  },
  // AM or PM
  a(date, token) {
    const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return dayPeriodEnumValue.toUpperCase();
      case "aaa":
        return dayPeriodEnumValue;
      case "aaaaa":
        return dayPeriodEnumValue[0];
      case "aaaa":
      default:
        return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(date, token) {
    return addLeadingZeros(date.getHours() % 12 || 12, token.length);
  },
  // Hour [0-23]
  H(date, token) {
    return addLeadingZeros(date.getHours(), token.length);
  },
  // Minute
  m(date, token) {
    return addLeadingZeros(date.getMinutes(), token.length);
  },
  // Second
  s(date, token) {
    return addLeadingZeros(date.getSeconds(), token.length);
  },
  // Fraction of second
  S(date, token) {
    const numberOfDigits = token.length;
    const milliseconds = date.getMilliseconds();
    const fractionalSeconds = Math.trunc(
      milliseconds * Math.pow(10, numberOfDigits - 3)
    );
    return addLeadingZeros(fractionalSeconds, token.length);
  }
};
const dayPeriodEnum = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
};
const formatters = {
  // Era
  G: function(date, token, localize2) {
    const era = date.getFullYear() > 0 ? 1 : 0;
    switch (token) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return localize2.era(era, { width: "abbreviated" });
      // A, B
      case "GGGGG":
        return localize2.era(era, { width: "narrow" });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return localize2.era(era, { width: "wide" });
    }
  },
  // Year
  y: function(date, token, localize2) {
    if (token === "yo") {
      const signedYear = date.getFullYear();
      const year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize2.ordinalNumber(year, { unit: "year" });
    }
    return lightFormatters.y(date, token);
  },
  // Local week-numbering year
  Y: function(date, token, localize2, options) {
    const signedWeekYear = getWeekYear(date, options);
    const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
    if (token === "YY") {
      const twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2);
    }
    if (token === "Yo") {
      return localize2.ordinalNumber(weekYear, { unit: "year" });
    }
    return addLeadingZeros(weekYear, token.length);
  },
  // ISO week-numbering year
  R: function(date, token) {
    const isoWeekYear = getISOWeekYear(date);
    return addLeadingZeros(isoWeekYear, token.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(date, token) {
    const year = date.getFullYear();
    return addLeadingZeros(year, token.length);
  },
  // Quarter
  Q: function(date, token, localize2) {
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "Q":
        return String(quarter);
      // 01, 02, 03, 04
      case "QQ":
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return localize2.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "formatting"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "formatting"
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(date, token, localize2) {
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "q":
        return String(quarter);
      // 01, 02, 03, 04
      case "qq":
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return localize2.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "standalone"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "standalone"
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(date, token, localize2) {
    const month = date.getMonth();
    switch (token) {
      case "M":
      case "MM":
        return lightFormatters.M(date, token);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return localize2.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "MMM":
        return localize2.month(month, {
          width: "abbreviated",
          context: "formatting"
        });
      // J, F, ..., D
      case "MMMMM":
        return localize2.month(month, {
          width: "narrow",
          context: "formatting"
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return localize2.month(month, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(date, token, localize2) {
    const month = date.getMonth();
    switch (token) {
      // 1, 2, ..., 12
      case "L":
        return String(month + 1);
      // 01, 02, ..., 12
      case "LL":
        return addLeadingZeros(month + 1, 2);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return localize2.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "LLL":
        return localize2.month(month, {
          width: "abbreviated",
          context: "standalone"
        });
      // J, F, ..., D
      case "LLLLL":
        return localize2.month(month, {
          width: "narrow",
          context: "standalone"
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return localize2.month(month, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(date, token, localize2, options) {
    const week = getWeek(date, options);
    if (token === "wo") {
      return localize2.ordinalNumber(week, { unit: "week" });
    }
    return addLeadingZeros(week, token.length);
  },
  // ISO week of year
  I: function(date, token, localize2) {
    const isoWeek = getISOWeek(date);
    if (token === "Io") {
      return localize2.ordinalNumber(isoWeek, { unit: "week" });
    }
    return addLeadingZeros(isoWeek, token.length);
  },
  // Day of the month
  d: function(date, token, localize2) {
    if (token === "do") {
      return localize2.ordinalNumber(date.getDate(), { unit: "date" });
    }
    return lightFormatters.d(date, token);
  },
  // Day of year
  D: function(date, token, localize2) {
    const dayOfYear = getDayOfYear(date);
    if (token === "Do") {
      return localize2.ordinalNumber(dayOfYear, { unit: "dayOfYear" });
    }
    return addLeadingZeros(dayOfYear, token.length);
  },
  // Day of week
  E: function(date, token, localize2) {
    const dayOfWeek = date.getDay();
    switch (token) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "EEEEE":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "EEEEEE":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "EEEE":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(date, token, localize2, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case "e":
        return String(localDayOfWeek);
      // Padded numerical value
      case "ee":
        return addLeadingZeros(localDayOfWeek, 2);
      // 1st, 2nd, ..., 7th
      case "eo":
        return localize2.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "eee":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "eeeee":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "eeeeee":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "eeee":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(date, token, localize2, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (same as in `e`)
      case "c":
        return String(localDayOfWeek);
      // Padded numerical value
      case "cc":
        return addLeadingZeros(localDayOfWeek, token.length);
      // 1st, 2nd, ..., 7th
      case "co":
        return localize2.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "ccc":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "standalone"
        });
      // T
      case "ccccc":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "standalone"
        });
      // Tu
      case "cccccc":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "standalone"
        });
      // Tuesday
      case "cccc":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(date, token, localize2) {
    const dayOfWeek = date.getDay();
    const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      // 2
      case "i":
        return String(isoDayOfWeek);
      // 02
      case "ii":
        return addLeadingZeros(isoDayOfWeek, token.length);
      // 2nd
      case "io":
        return localize2.ordinalNumber(isoDayOfWeek, { unit: "day" });
      // Tue
      case "iii":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "iiiii":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "iiiiii":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "iiii":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(date, token, localize2) {
    const hours = date.getHours();
    const dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(date, token, localize2) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    }
    switch (token) {
      case "b":
      case "bb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(date, token, localize2) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }
    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(date, token, localize2) {
    if (token === "ho") {
      let hours = date.getHours() % 12;
      if (hours === 0) hours = 12;
      return localize2.ordinalNumber(hours, { unit: "hour" });
    }
    return lightFormatters.h(date, token);
  },
  // Hour [0-23]
  H: function(date, token, localize2) {
    if (token === "Ho") {
      return localize2.ordinalNumber(date.getHours(), { unit: "hour" });
    }
    return lightFormatters.H(date, token);
  },
  // Hour [0-11]
  K: function(date, token, localize2) {
    const hours = date.getHours() % 12;
    if (token === "Ko") {
      return localize2.ordinalNumber(hours, { unit: "hour" });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Hour [1-24]
  k: function(date, token, localize2) {
    let hours = date.getHours();
    if (hours === 0) hours = 24;
    if (token === "ko") {
      return localize2.ordinalNumber(hours, { unit: "hour" });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Minute
  m: function(date, token, localize2) {
    if (token === "mo") {
      return localize2.ordinalNumber(date.getMinutes(), { unit: "minute" });
    }
    return lightFormatters.m(date, token);
  },
  // Second
  s: function(date, token, localize2) {
    if (token === "so") {
      return localize2.ordinalNumber(date.getSeconds(), { unit: "second" });
    }
    return lightFormatters.s(date, token);
  },
  // Fraction of second
  S: function(date, token) {
    return lightFormatters.S(date, token);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    if (timezoneOffset === 0) {
      return "Z";
    }
    switch (token) {
      // Hours and optional minutes
      case "X":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX":
        return formatTimezone(timezoneOffset);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case "XXXXX":
      case "XXX":
      // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token) {
      // Hours and optional minutes
      case "x":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx":
        return formatTimezone(timezoneOffset);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case "xxxxx":
      case "xxx":
      // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (GMT)
  O: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token) {
      // Short
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "OOOO":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token) {
      // Short
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "zzzz":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Seconds timestamp
  t: function(date, token, _localize) {
    const timestamp = Math.trunc(+date / 1e3);
    return addLeadingZeros(timestamp, token.length);
  },
  // Milliseconds timestamp
  T: function(date, token, _localize) {
    return addLeadingZeros(+date, token.length);
  }
};
function formatTimezoneShort(offset2, delimiter = "") {
  const sign = offset2 > 0 ? "-" : "+";
  const absOffset = Math.abs(offset2);
  const hours = Math.trunc(absOffset / 60);
  const minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset2, delimiter) {
  if (offset2 % 60 === 0) {
    const sign = offset2 > 0 ? "-" : "+";
    return sign + addLeadingZeros(Math.abs(offset2) / 60, 2);
  }
  return formatTimezone(offset2, delimiter);
}
function formatTimezone(offset2, delimiter = "") {
  const sign = offset2 > 0 ? "-" : "+";
  const absOffset = Math.abs(offset2);
  const hours = addLeadingZeros(Math.trunc(absOffset / 60), 2);
  const minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}
const dateLongFormatter = (pattern, formatLong2) => {
  switch (pattern) {
    case "P":
      return formatLong2.date({ width: "short" });
    case "PP":
      return formatLong2.date({ width: "medium" });
    case "PPP":
      return formatLong2.date({ width: "long" });
    case "PPPP":
    default:
      return formatLong2.date({ width: "full" });
  }
};
const timeLongFormatter = (pattern, formatLong2) => {
  switch (pattern) {
    case "p":
      return formatLong2.time({ width: "short" });
    case "pp":
      return formatLong2.time({ width: "medium" });
    case "ppp":
      return formatLong2.time({ width: "long" });
    case "pppp":
    default:
      return formatLong2.time({ width: "full" });
  }
};
const dateTimeLongFormatter = (pattern, formatLong2) => {
  const matchResult = pattern.match(/(P+)(p+)?/) || [];
  const datePattern = matchResult[1];
  const timePattern = matchResult[2];
  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong2);
  }
  let dateTimeFormat;
  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong2.dateTime({ width: "short" });
      break;
    case "PP":
      dateTimeFormat = formatLong2.dateTime({ width: "medium" });
      break;
    case "PPP":
      dateTimeFormat = formatLong2.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong2.dateTime({ width: "full" });
      break;
  }
  return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong2)).replace("{{time}}", timeLongFormatter(timePattern, formatLong2));
};
const longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};
const dayOfYearTokenRE = /^D+$/;
const weekYearTokenRE = /^Y+$/;
const throwTokens = ["D", "DD", "YY", "YYYY"];
function isProtectedDayOfYearToken(token) {
  return dayOfYearTokenRE.test(token);
}
function isProtectedWeekYearToken(token) {
  return weekYearTokenRE.test(token);
}
function warnOrThrowProtectedError(token, format2, input) {
  const _message = message(token, format2, input);
  console.warn(_message);
  if (throwTokens.includes(token)) throw new RangeError(_message);
}
function message(token, format2, input) {
  const subject = token[0] === "Y" ? "years" : "days of the month";
  return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format2}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const formattingTokensRegExp$1 = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
const longFormattingTokensRegExp$1 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
const escapedStringRegExp$1 = /^'([^]*?)'?$/;
const doubleQuoteRegExp$1 = /''/g;
const unescapedLatinCharacterRegExp$1 = /[a-zA-Z]/;
function format(date, formatStr, options) {
  const defaultOptions2 = getDefaultOptions$1();
  const locale = options?.locale ?? defaultOptions2.locale ?? enUS;
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  const originalDate = toDate(date, options?.in);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  let parts = formatStr.match(longFormattingTokensRegExp$1).map((substring) => {
    const firstCharacter = substring[0];
    if (firstCharacter === "p" || firstCharacter === "P") {
      const longFormatter = longFormatters[firstCharacter];
      return longFormatter(substring, locale.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp$1).map((substring) => {
    if (substring === "''") {
      return { isToken: false, value: "'" };
    }
    const firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return { isToken: false, value: cleanEscapedString$1(substring) };
    }
    if (formatters[firstCharacter]) {
      return { isToken: true, value: substring };
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp$1)) {
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + firstCharacter + "`"
      );
    }
    return { isToken: false, value: substring };
  });
  if (locale.localize.preprocessor) {
    parts = locale.localize.preprocessor(originalDate, parts);
  }
  const formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale
  };
  return parts.map((part) => {
    if (!part.isToken) return part.value;
    const token = part.value;
    if (!options?.useAdditionalWeekYearTokens && isProtectedWeekYearToken(token) || !options?.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(token)) {
      warnOrThrowProtectedError(token, formatStr, String(date));
    }
    const formatter = formatters[token[0]];
    return formatter(originalDate, token, locale.localize, formatterOptions);
  }).join("");
}
function cleanEscapedString$1(input) {
  const matched = input.match(escapedStringRegExp$1);
  if (!matched) {
    return input;
  }
  return matched[1].replace(doubleQuoteRegExp$1, "'");
}
function getDay(date, options) {
  return toDate(date, options?.in).getDay();
}
function getDaysInMonth(date, options) {
  const _date = toDate(date, options?.in);
  const year = _date.getFullYear();
  const monthIndex = _date.getMonth();
  const lastDayOfMonth = constructFrom(_date, 0);
  lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
  lastDayOfMonth.setHours(0, 0, 0, 0);
  return lastDayOfMonth.getDate();
}
function getDefaultOptions() {
  return Object.assign({}, getDefaultOptions$1());
}
function getHours(date, options) {
  return toDate(date, options?.in).getHours();
}
function getISODay(date, options) {
  const day = toDate(date, options?.in).getDay();
  return day === 0 ? 7 : day;
}
function getMinutes(date, options) {
  return toDate(date, options?.in).getMinutes();
}
function getMonth(date, options) {
  return toDate(date, options?.in).getMonth();
}
function getSeconds(date) {
  return toDate(date).getSeconds();
}
function getYear(date, options) {
  return toDate(date, options?.in).getFullYear();
}
function isAfter(date, dateToCompare) {
  return +toDate(date) > +toDate(dateToCompare);
}
function isBefore(date, dateToCompare) {
  return +toDate(date) < +toDate(dateToCompare);
}
function isEqual(leftDate, rightDate) {
  return +toDate(leftDate) === +toDate(rightDate);
}
function transpose(date, constructor) {
  const date_ = isConstructor(constructor) ? new constructor(0) : constructFrom(constructor, 0);
  date_.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  date_.setHours(
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
  return date_;
}
function isConstructor(constructor) {
  return typeof constructor === "function" && constructor.prototype?.constructor === constructor;
}
const TIMEZONE_UNIT_PRIORITY = 10;
class Setter {
  subPriority = 0;
  validate(_utcDate, _options) {
    return true;
  }
}
class ValueSetter extends Setter {
  constructor(value, validateValue, setValue, priority, subPriority) {
    super();
    this.value = value;
    this.validateValue = validateValue;
    this.setValue = setValue;
    this.priority = priority;
    if (subPriority) {
      this.subPriority = subPriority;
    }
  }
  validate(date, options) {
    return this.validateValue(date, this.value, options);
  }
  set(date, flags, options) {
    return this.setValue(date, flags, this.value, options);
  }
}
class DateTimezoneSetter extends Setter {
  priority = TIMEZONE_UNIT_PRIORITY;
  subPriority = -1;
  constructor(context, reference) {
    super();
    this.context = context || ((date) => constructFrom(reference, date));
  }
  set(date, flags) {
    if (flags.timestampIsSet) return date;
    return constructFrom(date, transpose(date, this.context));
  }
}
class Parser {
  run(dateString, token, match2, options) {
    const result = this.parse(dateString, token, match2, options);
    if (!result) {
      return null;
    }
    return {
      setter: new ValueSetter(
        result.value,
        this.validate,
        this.set,
        this.priority,
        this.subPriority
      ),
      rest: result.rest
    };
  }
  validate(_utcDate, _value, _options) {
    return true;
  }
}
class EraParser extends Parser {
  priority = 140;
  parse(dateString, token, match2) {
    switch (token) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return match2.era(dateString, { width: "abbreviated" }) || match2.era(dateString, { width: "narrow" });
      // A, B
      case "GGGGG":
        return match2.era(dateString, { width: "narrow" });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return match2.era(dateString, { width: "wide" }) || match2.era(dateString, { width: "abbreviated" }) || match2.era(dateString, { width: "narrow" });
    }
  }
  set(date, flags, value) {
    flags.era = value;
    date.setFullYear(value, 0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  incompatibleTokens = ["R", "u", "t", "T"];
}
const numericPatterns = {
  month: /^(1[0-2]|0?\d)/,
  // 0 to 12
  date: /^(3[0-1]|[0-2]?\d)/,
  // 0 to 31
  dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
  // 0 to 366
  week: /^(5[0-3]|[0-4]?\d)/,
  // 0 to 53
  hour23h: /^(2[0-3]|[0-1]?\d)/,
  // 0 to 23
  hour24h: /^(2[0-4]|[0-1]?\d)/,
  // 0 to 24
  hour11h: /^(1[0-1]|0?\d)/,
  // 0 to 11
  hour12h: /^(1[0-2]|0?\d)/,
  // 0 to 12
  minute: /^[0-5]?\d/,
  // 0 to 59
  second: /^[0-5]?\d/,
  // 0 to 59
  singleDigit: /^\d/,
  // 0 to 9
  twoDigits: /^\d{1,2}/,
  // 0 to 99
  threeDigits: /^\d{1,3}/,
  // 0 to 999
  fourDigits: /^\d{1,4}/,
  // 0 to 9999
  anyDigitsSigned: /^-?\d+/,
  singleDigitSigned: /^-?\d/,
  // 0 to 9, -0 to -9
  twoDigitsSigned: /^-?\d{1,2}/,
  // 0 to 99, -0 to -99
  threeDigitsSigned: /^-?\d{1,3}/,
  // 0 to 999, -0 to -999
  fourDigitsSigned: /^-?\d{1,4}/
  // 0 to 9999, -0 to -9999
};
const timezonePatterns = {
  basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
  basic: /^([+-])(\d{2})(\d{2})|Z/,
  basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
  extended: /^([+-])(\d{2}):(\d{2})|Z/,
  extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
};
function mapValue(parseFnResult, mapFn) {
  if (!parseFnResult) {
    return parseFnResult;
  }
  return {
    value: mapFn(parseFnResult.value),
    rest: parseFnResult.rest
  };
}
function parseNumericPattern(pattern, dateString) {
  const matchResult = dateString.match(pattern);
  if (!matchResult) {
    return null;
  }
  return {
    value: parseInt(matchResult[0], 10),
    rest: dateString.slice(matchResult[0].length)
  };
}
function parseTimezonePattern(pattern, dateString) {
  const matchResult = dateString.match(pattern);
  if (!matchResult) {
    return null;
  }
  if (matchResult[0] === "Z") {
    return {
      value: 0,
      rest: dateString.slice(1)
    };
  }
  const sign = matchResult[1] === "+" ? 1 : -1;
  const hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
  const minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
  const seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;
  return {
    value: sign * (hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * millisecondsInSecond),
    rest: dateString.slice(matchResult[0].length)
  };
}
function parseAnyDigitsSigned(dateString) {
  return parseNumericPattern(numericPatterns.anyDigitsSigned, dateString);
}
function parseNDigits(n, dateString) {
  switch (n) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigit, dateString);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigits, dateString);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigits, dateString);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigits, dateString);
    default:
      return parseNumericPattern(new RegExp("^\\d{1," + n + "}"), dateString);
  }
}
function parseNDigitsSigned(n, dateString) {
  switch (n) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigitSigned, dateString);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigitsSigned, dateString);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigitsSigned, dateString);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigitsSigned, dateString);
    default:
      return parseNumericPattern(new RegExp("^-?\\d{1," + n + "}"), dateString);
  }
}
function dayPeriodEnumToHours(dayPeriod) {
  switch (dayPeriod) {
    case "morning":
      return 4;
    case "evening":
      return 17;
    case "pm":
    case "noon":
    case "afternoon":
      return 12;
    case "am":
    case "midnight":
    case "night":
    default:
      return 0;
  }
}
function normalizeTwoDigitYear(twoDigitYear, currentYear) {
  const isCommonEra = currentYear > 0;
  const absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;
  let result;
  if (absCurrentYear <= 50) {
    result = twoDigitYear || 100;
  } else {
    const rangeEnd = absCurrentYear + 50;
    const rangeEndCentury = Math.trunc(rangeEnd / 100) * 100;
    const isPreviousCentury = twoDigitYear >= rangeEnd % 100;
    result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
  }
  return isCommonEra ? result : 1 - result;
}
function isLeapYearIndex(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
class YearParser extends Parser {
  priority = 130;
  incompatibleTokens = ["Y", "R", "u", "w", "I", "i", "e", "c", "t", "T"];
  parse(dateString, token, match2) {
    const valueCallback = (year) => ({
      year,
      isTwoDigitYear: token === "yy"
    });
    switch (token) {
      case "y":
        return mapValue(parseNDigits(4, dateString), valueCallback);
      case "yo":
        return mapValue(
          match2.ordinalNumber(dateString, {
            unit: "year"
          }),
          valueCallback
        );
      default:
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
    }
  }
  validate(_date, value) {
    return value.isTwoDigitYear || value.year > 0;
  }
  set(date, flags, value) {
    const currentYear = date.getFullYear();
    if (value.isTwoDigitYear) {
      const normalizedTwoDigitYear = normalizeTwoDigitYear(
        value.year,
        currentYear
      );
      date.setFullYear(normalizedTwoDigitYear, 0, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
    date.setFullYear(year, 0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
class LocalWeekYearParser extends Parser {
  priority = 130;
  parse(dateString, token, match2) {
    const valueCallback = (year) => ({
      year,
      isTwoDigitYear: token === "YY"
    });
    switch (token) {
      case "Y":
        return mapValue(parseNDigits(4, dateString), valueCallback);
      case "Yo":
        return mapValue(
          match2.ordinalNumber(dateString, {
            unit: "year"
          }),
          valueCallback
        );
      default:
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
    }
  }
  validate(_date, value) {
    return value.isTwoDigitYear || value.year > 0;
  }
  set(date, flags, value, options) {
    const currentYear = getWeekYear(date, options);
    if (value.isTwoDigitYear) {
      const normalizedTwoDigitYear = normalizeTwoDigitYear(
        value.year,
        currentYear
      );
      date.setFullYear(
        normalizedTwoDigitYear,
        0,
        options.firstWeekContainsDate
      );
      date.setHours(0, 0, 0, 0);
      return startOfWeek(date, options);
    }
    const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
    date.setFullYear(year, 0, options.firstWeekContainsDate);
    date.setHours(0, 0, 0, 0);
    return startOfWeek(date, options);
  }
  incompatibleTokens = [
    "y",
    "R",
    "u",
    "Q",
    "q",
    "M",
    "L",
    "I",
    "d",
    "D",
    "i",
    "t",
    "T"
  ];
}
class ISOWeekYearParser extends Parser {
  priority = 130;
  parse(dateString, token) {
    if (token === "R") {
      return parseNDigitsSigned(4, dateString);
    }
    return parseNDigitsSigned(token.length, dateString);
  }
  set(date, _flags, value) {
    const firstWeekOfYear = constructFrom(date, 0);
    firstWeekOfYear.setFullYear(value, 0, 4);
    firstWeekOfYear.setHours(0, 0, 0, 0);
    return startOfISOWeek(firstWeekOfYear);
  }
  incompatibleTokens = [
    "G",
    "y",
    "Y",
    "u",
    "Q",
    "q",
    "M",
    "L",
    "w",
    "d",
    "D",
    "e",
    "c",
    "t",
    "T"
  ];
}
class ExtendedYearParser extends Parser {
  priority = 130;
  parse(dateString, token) {
    if (token === "u") {
      return parseNDigitsSigned(4, dateString);
    }
    return parseNDigitsSigned(token.length, dateString);
  }
  set(date, _flags, value) {
    date.setFullYear(value, 0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  incompatibleTokens = ["G", "y", "Y", "R", "w", "I", "i", "e", "c", "t", "T"];
}
class QuarterParser extends Parser {
  priority = 120;
  parse(dateString, token, match2) {
    switch (token) {
      // 1, 2, 3, 4
      case "Q":
      case "QQ":
        return parseNDigits(token.length, dateString);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return match2.ordinalNumber(dateString, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return match2.quarter(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.quarter(dateString, {
          width: "narrow",
          context: "formatting"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return match2.quarter(dateString, {
          width: "narrow",
          context: "formatting"
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return match2.quarter(dateString, {
          width: "wide",
          context: "formatting"
        }) || match2.quarter(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.quarter(dateString, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 4;
  }
  set(date, _flags, value) {
    date.setMonth((value - 1) * 3, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  incompatibleTokens = [
    "Y",
    "R",
    "q",
    "M",
    "L",
    "w",
    "I",
    "d",
    "D",
    "i",
    "e",
    "c",
    "t",
    "T"
  ];
}
class StandAloneQuarterParser extends Parser {
  priority = 120;
  parse(dateString, token, match2) {
    switch (token) {
      // 1, 2, 3, 4
      case "q":
      case "qq":
        return parseNDigits(token.length, dateString);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return match2.ordinalNumber(dateString, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return match2.quarter(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match2.quarter(dateString, {
          width: "narrow",
          context: "standalone"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return match2.quarter(dateString, {
          width: "narrow",
          context: "standalone"
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return match2.quarter(dateString, {
          width: "wide",
          context: "standalone"
        }) || match2.quarter(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match2.quarter(dateString, {
          width: "narrow",
          context: "standalone"
        });
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 4;
  }
  set(date, _flags, value) {
    date.setMonth((value - 1) * 3, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  incompatibleTokens = [
    "Y",
    "R",
    "Q",
    "M",
    "L",
    "w",
    "I",
    "d",
    "D",
    "i",
    "e",
    "c",
    "t",
    "T"
  ];
}
class MonthParser extends Parser {
  incompatibleTokens = [
    "Y",
    "R",
    "q",
    "Q",
    "L",
    "w",
    "I",
    "D",
    "i",
    "e",
    "c",
    "t",
    "T"
  ];
  priority = 110;
  parse(dateString, token, match2) {
    const valueCallback = (value) => value - 1;
    switch (token) {
      // 1, 2, ..., 12
      case "M":
        return mapValue(
          parseNumericPattern(numericPatterns.month, dateString),
          valueCallback
        );
      // 01, 02, ..., 12
      case "MM":
        return mapValue(parseNDigits(2, dateString), valueCallback);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return mapValue(
          match2.ordinalNumber(dateString, {
            unit: "month"
          }),
          valueCallback
        );
      // Jan, Feb, ..., Dec
      case "MMM":
        return match2.month(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.month(dateString, { width: "narrow", context: "formatting" });
      // J, F, ..., D
      case "MMMMM":
        return match2.month(dateString, {
          width: "narrow",
          context: "formatting"
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return match2.month(dateString, { width: "wide", context: "formatting" }) || match2.month(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.month(dateString, { width: "narrow", context: "formatting" });
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 11;
  }
  set(date, _flags, value) {
    date.setMonth(value, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
class StandAloneMonthParser extends Parser {
  priority = 110;
  parse(dateString, token, match2) {
    const valueCallback = (value) => value - 1;
    switch (token) {
      // 1, 2, ..., 12
      case "L":
        return mapValue(
          parseNumericPattern(numericPatterns.month, dateString),
          valueCallback
        );
      // 01, 02, ..., 12
      case "LL":
        return mapValue(parseNDigits(2, dateString), valueCallback);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return mapValue(
          match2.ordinalNumber(dateString, {
            unit: "month"
          }),
          valueCallback
        );
      // Jan, Feb, ..., Dec
      case "LLL":
        return match2.month(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match2.month(dateString, { width: "narrow", context: "standalone" });
      // J, F, ..., D
      case "LLLLL":
        return match2.month(dateString, {
          width: "narrow",
          context: "standalone"
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return match2.month(dateString, { width: "wide", context: "standalone" }) || match2.month(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match2.month(dateString, { width: "narrow", context: "standalone" });
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 11;
  }
  set(date, _flags, value) {
    date.setMonth(value, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  incompatibleTokens = [
    "Y",
    "R",
    "q",
    "Q",
    "M",
    "w",
    "I",
    "D",
    "i",
    "e",
    "c",
    "t",
    "T"
  ];
}
function setWeek(date, week, options) {
  const date_ = toDate(date, options?.in);
  const diff = getWeek(date_, options) - week;
  date_.setDate(date_.getDate() - diff * 7);
  return toDate(date_, options?.in);
}
class LocalWeekParser extends Parser {
  priority = 100;
  parse(dateString, token, match2) {
    switch (token) {
      case "w":
        return parseNumericPattern(numericPatterns.week, dateString);
      case "wo":
        return match2.ordinalNumber(dateString, { unit: "week" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 53;
  }
  set(date, _flags, value, options) {
    return startOfWeek(setWeek(date, value, options), options);
  }
  incompatibleTokens = [
    "y",
    "R",
    "u",
    "q",
    "Q",
    "M",
    "L",
    "I",
    "d",
    "D",
    "i",
    "t",
    "T"
  ];
}
function setISOWeek(date, week, options) {
  const _date = toDate(date, options?.in);
  const diff = getISOWeek(_date, options) - week;
  _date.setDate(_date.getDate() - diff * 7);
  return _date;
}
class ISOWeekParser extends Parser {
  priority = 100;
  parse(dateString, token, match2) {
    switch (token) {
      case "I":
        return parseNumericPattern(numericPatterns.week, dateString);
      case "Io":
        return match2.ordinalNumber(dateString, { unit: "week" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 53;
  }
  set(date, _flags, value) {
    return startOfISOWeek(setISOWeek(date, value));
  }
  incompatibleTokens = [
    "y",
    "Y",
    "u",
    "q",
    "Q",
    "M",
    "L",
    "w",
    "d",
    "D",
    "e",
    "c",
    "t",
    "T"
  ];
}
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DAYS_IN_MONTH_LEAP_YEAR = [
  31,
  29,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31
];
class DateParser extends Parser {
  priority = 90;
  subPriority = 1;
  parse(dateString, token, match2) {
    switch (token) {
      case "d":
        return parseNumericPattern(numericPatterns.date, dateString);
      case "do":
        return match2.ordinalNumber(dateString, { unit: "date" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(date, value) {
    const year = date.getFullYear();
    const isLeapYear = isLeapYearIndex(year);
    const month = date.getMonth();
    if (isLeapYear) {
      return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month];
    } else {
      return value >= 1 && value <= DAYS_IN_MONTH[month];
    }
  }
  set(date, _flags, value) {
    date.setDate(value);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  incompatibleTokens = [
    "Y",
    "R",
    "q",
    "Q",
    "w",
    "I",
    "D",
    "i",
    "e",
    "c",
    "t",
    "T"
  ];
}
class DayOfYearParser extends Parser {
  priority = 90;
  subpriority = 1;
  parse(dateString, token, match2) {
    switch (token) {
      case "D":
      case "DD":
        return parseNumericPattern(numericPatterns.dayOfYear, dateString);
      case "Do":
        return match2.ordinalNumber(dateString, { unit: "date" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(date, value) {
    const year = date.getFullYear();
    const isLeapYear = isLeapYearIndex(year);
    if (isLeapYear) {
      return value >= 1 && value <= 366;
    } else {
      return value >= 1 && value <= 365;
    }
  }
  set(date, _flags, value) {
    date.setMonth(0, value);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  incompatibleTokens = [
    "Y",
    "R",
    "q",
    "Q",
    "M",
    "L",
    "w",
    "I",
    "d",
    "E",
    "i",
    "e",
    "c",
    "t",
    "T"
  ];
}
function setDay(date, day, options) {
  const defaultOptions2 = getDefaultOptions$1();
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  const date_ = toDate(date, options?.in);
  const currentDay = date_.getDay();
  const remainder = day % 7;
  const dayIndex = (remainder + 7) % 7;
  const delta = 7 - weekStartsOn;
  const diff = day < 0 || day > 6 ? day - (currentDay + delta) % 7 : (dayIndex + delta) % 7 - (currentDay + delta) % 7;
  return addDays(date_, diff, options);
}
class DayParser extends Parser {
  priority = 90;
  parse(dateString, token, match2) {
    switch (token) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return match2.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
      // T
      case "EEEEE":
        return match2.day(dateString, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "EEEEEE":
        return match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
      // Tuesday
      case "EEEE":
      default:
        return match2.day(dateString, { width: "wide", context: "formatting" }) || match2.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 6;
  }
  set(date, _flags, value, options) {
    date = setDay(date, value, options);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  incompatibleTokens = ["D", "i", "e", "c", "t", "T"];
}
class LocalDayParser extends Parser {
  priority = 90;
  parse(dateString, token, match2, options) {
    const valueCallback = (value) => {
      const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
      return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
    };
    switch (token) {
      // 3
      case "e":
      case "ee":
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
      // 3rd
      case "eo":
        return mapValue(
          match2.ordinalNumber(dateString, {
            unit: "day"
          }),
          valueCallback
        );
      // Tue
      case "eee":
        return match2.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
      // T
      case "eeeee":
        return match2.day(dateString, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "eeeeee":
        return match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
      // Tuesday
      case "eeee":
      default:
        return match2.day(dateString, { width: "wide", context: "formatting" }) || match2.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 6;
  }
  set(date, _flags, value, options) {
    date = setDay(date, value, options);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  incompatibleTokens = [
    "y",
    "R",
    "u",
    "q",
    "Q",
    "M",
    "L",
    "I",
    "d",
    "D",
    "E",
    "i",
    "c",
    "t",
    "T"
  ];
}
class StandAloneLocalDayParser extends Parser {
  priority = 90;
  parse(dateString, token, match2, options) {
    const valueCallback = (value) => {
      const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
      return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
    };
    switch (token) {
      // 3
      case "c":
      case "cc":
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
      // 3rd
      case "co":
        return mapValue(
          match2.ordinalNumber(dateString, {
            unit: "day"
          }),
          valueCallback
        );
      // Tue
      case "ccc":
        return match2.day(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match2.day(dateString, { width: "short", context: "standalone" }) || match2.day(dateString, { width: "narrow", context: "standalone" });
      // T
      case "ccccc":
        return match2.day(dateString, {
          width: "narrow",
          context: "standalone"
        });
      // Tu
      case "cccccc":
        return match2.day(dateString, { width: "short", context: "standalone" }) || match2.day(dateString, { width: "narrow", context: "standalone" });
      // Tuesday
      case "cccc":
      default:
        return match2.day(dateString, { width: "wide", context: "standalone" }) || match2.day(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match2.day(dateString, { width: "short", context: "standalone" }) || match2.day(dateString, { width: "narrow", context: "standalone" });
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 6;
  }
  set(date, _flags, value, options) {
    date = setDay(date, value, options);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  incompatibleTokens = [
    "y",
    "R",
    "u",
    "q",
    "Q",
    "M",
    "L",
    "I",
    "d",
    "D",
    "E",
    "i",
    "e",
    "t",
    "T"
  ];
}
function setISODay(date, day, options) {
  const date_ = toDate(date, options?.in);
  const currentDay = getISODay(date_, options);
  const diff = day - currentDay;
  return addDays(date_, diff, options);
}
class ISODayParser extends Parser {
  priority = 90;
  parse(dateString, token, match2) {
    const valueCallback = (value) => {
      if (value === 0) {
        return 7;
      }
      return value;
    };
    switch (token) {
      // 2
      case "i":
      case "ii":
        return parseNDigits(token.length, dateString);
      // 2nd
      case "io":
        return match2.ordinalNumber(dateString, { unit: "day" });
      // Tue
      case "iii":
        return mapValue(
          match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }),
          valueCallback
        );
      // T
      case "iiiii":
        return mapValue(
          match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }),
          valueCallback
        );
      // Tu
      case "iiiiii":
        return mapValue(
          match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }),
          valueCallback
        );
      // Tuesday
      case "iiii":
      default:
        return mapValue(
          match2.day(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }),
          valueCallback
        );
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 7;
  }
  set(date, _flags, value) {
    date = setISODay(date, value);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  incompatibleTokens = [
    "y",
    "Y",
    "u",
    "q",
    "Q",
    "M",
    "L",
    "w",
    "d",
    "D",
    "E",
    "e",
    "c",
    "t",
    "T"
  ];
}
class AMPMParser extends Parser {
  priority = 80;
  parse(dateString, token, match2) {
    switch (token) {
      case "a":
      case "aa":
      case "aaa":
        return match2.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaaa":
        return match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return match2.dayPeriod(dateString, {
          width: "wide",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  set(date, _flags, value) {
    date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
    return date;
  }
  incompatibleTokens = ["b", "B", "H", "k", "t", "T"];
}
class AMPMMidnightParser extends Parser {
  priority = 80;
  parse(dateString, token, match2) {
    switch (token) {
      case "b":
      case "bb":
      case "bbb":
        return match2.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbbb":
        return match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return match2.dayPeriod(dateString, {
          width: "wide",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  set(date, _flags, value) {
    date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
    return date;
  }
  incompatibleTokens = ["a", "B", "H", "k", "t", "T"];
}
class DayPeriodParser extends Parser {
  priority = 80;
  parse(dateString, token, match2) {
    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return match2.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBBB":
        return match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return match2.dayPeriod(dateString, {
          width: "wide",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  set(date, _flags, value) {
    date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
    return date;
  }
  incompatibleTokens = ["a", "b", "t", "T"];
}
class Hour1to12Parser extends Parser {
  priority = 70;
  parse(dateString, token, match2) {
    switch (token) {
      case "h":
        return parseNumericPattern(numericPatterns.hour12h, dateString);
      case "ho":
        return match2.ordinalNumber(dateString, { unit: "hour" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 12;
  }
  set(date, _flags, value) {
    const isPM = date.getHours() >= 12;
    if (isPM && value < 12) {
      date.setHours(value + 12, 0, 0, 0);
    } else if (!isPM && value === 12) {
      date.setHours(0, 0, 0, 0);
    } else {
      date.setHours(value, 0, 0, 0);
    }
    return date;
  }
  incompatibleTokens = ["H", "K", "k", "t", "T"];
}
class Hour0to23Parser extends Parser {
  priority = 70;
  parse(dateString, token, match2) {
    switch (token) {
      case "H":
        return parseNumericPattern(numericPatterns.hour23h, dateString);
      case "Ho":
        return match2.ordinalNumber(dateString, { unit: "hour" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 23;
  }
  set(date, _flags, value) {
    date.setHours(value, 0, 0, 0);
    return date;
  }
  incompatibleTokens = ["a", "b", "h", "K", "k", "t", "T"];
}
class Hour0To11Parser extends Parser {
  priority = 70;
  parse(dateString, token, match2) {
    switch (token) {
      case "K":
        return parseNumericPattern(numericPatterns.hour11h, dateString);
      case "Ko":
        return match2.ordinalNumber(dateString, { unit: "hour" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 11;
  }
  set(date, _flags, value) {
    const isPM = date.getHours() >= 12;
    if (isPM && value < 12) {
      date.setHours(value + 12, 0, 0, 0);
    } else {
      date.setHours(value, 0, 0, 0);
    }
    return date;
  }
  incompatibleTokens = ["h", "H", "k", "t", "T"];
}
class Hour1To24Parser extends Parser {
  priority = 70;
  parse(dateString, token, match2) {
    switch (token) {
      case "k":
        return parseNumericPattern(numericPatterns.hour24h, dateString);
      case "ko":
        return match2.ordinalNumber(dateString, { unit: "hour" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 24;
  }
  set(date, _flags, value) {
    const hours = value <= 24 ? value % 24 : value;
    date.setHours(hours, 0, 0, 0);
    return date;
  }
  incompatibleTokens = ["a", "b", "h", "H", "K", "t", "T"];
}
class MinuteParser extends Parser {
  priority = 60;
  parse(dateString, token, match2) {
    switch (token) {
      case "m":
        return parseNumericPattern(numericPatterns.minute, dateString);
      case "mo":
        return match2.ordinalNumber(dateString, { unit: "minute" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 59;
  }
  set(date, _flags, value) {
    date.setMinutes(value, 0, 0);
    return date;
  }
  incompatibleTokens = ["t", "T"];
}
class SecondParser extends Parser {
  priority = 50;
  parse(dateString, token, match2) {
    switch (token) {
      case "s":
        return parseNumericPattern(numericPatterns.second, dateString);
      case "so":
        return match2.ordinalNumber(dateString, { unit: "second" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 59;
  }
  set(date, _flags, value) {
    date.setSeconds(value, 0);
    return date;
  }
  incompatibleTokens = ["t", "T"];
}
class FractionOfSecondParser extends Parser {
  priority = 30;
  parse(dateString, token) {
    const valueCallback = (value) => Math.trunc(value * Math.pow(10, -token.length + 3));
    return mapValue(parseNDigits(token.length, dateString), valueCallback);
  }
  set(date, _flags, value) {
    date.setMilliseconds(value);
    return date;
  }
  incompatibleTokens = ["t", "T"];
}
class ISOTimezoneWithZParser extends Parser {
  priority = 10;
  parse(dateString, token) {
    switch (token) {
      case "X":
        return parseTimezonePattern(
          timezonePatterns.basicOptionalMinutes,
          dateString
        );
      case "XX":
        return parseTimezonePattern(timezonePatterns.basic, dateString);
      case "XXXX":
        return parseTimezonePattern(
          timezonePatterns.basicOptionalSeconds,
          dateString
        );
      case "XXXXX":
        return parseTimezonePattern(
          timezonePatterns.extendedOptionalSeconds,
          dateString
        );
      case "XXX":
      default:
        return parseTimezonePattern(timezonePatterns.extended, dateString);
    }
  }
  set(date, flags, value) {
    if (flags.timestampIsSet) return date;
    return constructFrom(
      date,
      date.getTime() - getTimezoneOffsetInMilliseconds(date) - value
    );
  }
  incompatibleTokens = ["t", "T", "x"];
}
class ISOTimezoneParser extends Parser {
  priority = 10;
  parse(dateString, token) {
    switch (token) {
      case "x":
        return parseTimezonePattern(
          timezonePatterns.basicOptionalMinutes,
          dateString
        );
      case "xx":
        return parseTimezonePattern(timezonePatterns.basic, dateString);
      case "xxxx":
        return parseTimezonePattern(
          timezonePatterns.basicOptionalSeconds,
          dateString
        );
      case "xxxxx":
        return parseTimezonePattern(
          timezonePatterns.extendedOptionalSeconds,
          dateString
        );
      case "xxx":
      default:
        return parseTimezonePattern(timezonePatterns.extended, dateString);
    }
  }
  set(date, flags, value) {
    if (flags.timestampIsSet) return date;
    return constructFrom(
      date,
      date.getTime() - getTimezoneOffsetInMilliseconds(date) - value
    );
  }
  incompatibleTokens = ["t", "T", "X"];
}
class TimestampSecondsParser extends Parser {
  priority = 40;
  parse(dateString) {
    return parseAnyDigitsSigned(dateString);
  }
  set(date, _flags, value) {
    return [constructFrom(date, value * 1e3), { timestampIsSet: true }];
  }
  incompatibleTokens = "*";
}
class TimestampMillisecondsParser extends Parser {
  priority = 20;
  parse(dateString) {
    return parseAnyDigitsSigned(dateString);
  }
  set(date, _flags, value) {
    return [constructFrom(date, value), { timestampIsSet: true }];
  }
  incompatibleTokens = "*";
}
const parsers = {
  G: new EraParser(),
  y: new YearParser(),
  Y: new LocalWeekYearParser(),
  R: new ISOWeekYearParser(),
  u: new ExtendedYearParser(),
  Q: new QuarterParser(),
  q: new StandAloneQuarterParser(),
  M: new MonthParser(),
  L: new StandAloneMonthParser(),
  w: new LocalWeekParser(),
  I: new ISOWeekParser(),
  d: new DateParser(),
  D: new DayOfYearParser(),
  E: new DayParser(),
  e: new LocalDayParser(),
  c: new StandAloneLocalDayParser(),
  i: new ISODayParser(),
  a: new AMPMParser(),
  b: new AMPMMidnightParser(),
  B: new DayPeriodParser(),
  h: new Hour1to12Parser(),
  H: new Hour0to23Parser(),
  K: new Hour0To11Parser(),
  k: new Hour1To24Parser(),
  m: new MinuteParser(),
  s: new SecondParser(),
  S: new FractionOfSecondParser(),
  X: new ISOTimezoneWithZParser(),
  x: new ISOTimezoneParser(),
  t: new TimestampSecondsParser(),
  T: new TimestampMillisecondsParser()
};
const formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
const longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
const escapedStringRegExp = /^'([^]*?)'?$/;
const doubleQuoteRegExp = /''/g;
const notWhitespaceRegExp = /\S/;
const unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function parse(dateStr, formatStr, referenceDate, options) {
  const invalidDate = () => constructFrom(options?.in || referenceDate, NaN);
  const defaultOptions2 = getDefaultOptions();
  const locale = options?.locale ?? defaultOptions2.locale ?? enUS;
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  if (!formatStr)
    return dateStr ? invalidDate() : toDate(referenceDate, options?.in);
  const subFnOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale
  };
  const setters = [new DateTimezoneSetter(options?.in, referenceDate)];
  const tokens = formatStr.match(longFormattingTokensRegExp).map((substring) => {
    const firstCharacter = substring[0];
    if (firstCharacter in longFormatters) {
      const longFormatter = longFormatters[firstCharacter];
      return longFormatter(substring, locale.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp);
  const usedTokens = [];
  for (let token of tokens) {
    if (!options?.useAdditionalWeekYearTokens && isProtectedWeekYearToken(token)) {
      warnOrThrowProtectedError(token, formatStr, dateStr);
    }
    if (!options?.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(token)) {
      warnOrThrowProtectedError(token, formatStr, dateStr);
    }
    const firstCharacter = token[0];
    const parser = parsers[firstCharacter];
    if (parser) {
      const { incompatibleTokens } = parser;
      if (Array.isArray(incompatibleTokens)) {
        const incompatibleToken = usedTokens.find(
          (usedToken) => incompatibleTokens.includes(usedToken.token) || usedToken.token === firstCharacter
        );
        if (incompatibleToken) {
          throw new RangeError(
            `The format string mustn't contain \`${incompatibleToken.fullToken}\` and \`${token}\` at the same time`
          );
        }
      } else if (parser.incompatibleTokens === "*" && usedTokens.length > 0) {
        throw new RangeError(
          `The format string mustn't contain \`${token}\` and any other token at the same time`
        );
      }
      usedTokens.push({ token: firstCharacter, fullToken: token });
      const parseResult = parser.run(
        dateStr,
        token,
        locale.match,
        subFnOptions
      );
      if (!parseResult) {
        return invalidDate();
      }
      setters.push(parseResult.setter);
      dateStr = parseResult.rest;
    } else {
      if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" + firstCharacter + "`"
        );
      }
      if (token === "''") {
        token = "'";
      } else if (firstCharacter === "'") {
        token = cleanEscapedString(token);
      }
      if (dateStr.indexOf(token) === 0) {
        dateStr = dateStr.slice(token.length);
      } else {
        return invalidDate();
      }
    }
  }
  if (dateStr.length > 0 && notWhitespaceRegExp.test(dateStr)) {
    return invalidDate();
  }
  const uniquePrioritySetters = setters.map((setter) => setter.priority).sort((a, b) => b - a).filter((priority, index, array) => array.indexOf(priority) === index).map(
    (priority) => setters.filter((setter) => setter.priority === priority).sort((a, b) => b.subPriority - a.subPriority)
  ).map((setterArray) => setterArray[0]);
  let date = toDate(referenceDate, options?.in);
  if (isNaN(+date)) return invalidDate();
  const flags = {};
  for (const setter of uniquePrioritySetters) {
    if (!setter.validate(date, subFnOptions)) {
      return invalidDate();
    }
    const result = setter.set(date, flags, subFnOptions);
    if (Array.isArray(result)) {
      date = result[0];
      Object.assign(flags, result[1]);
    } else {
      date = result;
    }
  }
  return date;
}
function cleanEscapedString(input) {
  return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
}
function isSameQuarter(laterDate, earlierDate, options) {
  const [dateLeft_, dateRight_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate
  );
  return +startOfQuarter(dateLeft_) === +startOfQuarter(dateRight_);
}
function subDays(date, amount, options) {
  return addDays(date, -amount, options);
}
function roundToNearestMinutes(date, options) {
  const nearestTo = options?.nearestTo ?? 1;
  if (nearestTo < 1 || nearestTo > 30) return constructFrom(date, NaN);
  const date_ = toDate(date, options?.in);
  const fractionalSeconds = date_.getSeconds() / 60;
  const fractionalMilliseconds = date_.getMilliseconds() / 1e3 / 60;
  const minutes = date_.getMinutes() + fractionalSeconds + fractionalMilliseconds;
  const method = options?.roundingMethod ?? "round";
  const roundingMethod = getRoundingMethod(method);
  const roundedMinutes = roundingMethod(minutes / nearestTo) * nearestTo;
  date_.setMinutes(roundedMinutes, 0, 0);
  return date_;
}
function setMonth(date, month, options) {
  const _date = toDate(date, options?.in);
  const year = _date.getFullYear();
  const day = _date.getDate();
  const midMonth = constructFrom(date, 0);
  midMonth.setFullYear(year, month, 15);
  midMonth.setHours(0, 0, 0, 0);
  const daysInMonth = getDaysInMonth(midMonth);
  _date.setMonth(month, Math.min(day, daysInMonth));
  return _date;
}
function set(date, values, options) {
  let _date = toDate(date, options?.in);
  if (isNaN(+_date)) return constructFrom(date, NaN);
  if (values.year != null) _date.setFullYear(values.year);
  if (values.month != null) _date = setMonth(_date, values.month);
  if (values.date != null) _date.setDate(values.date);
  if (values.hours != null) _date.setHours(values.hours);
  if (values.minutes != null) _date.setMinutes(values.minutes);
  if (values.seconds != null) _date.setSeconds(values.seconds);
  if (values.milliseconds != null) _date.setMilliseconds(values.milliseconds);
  return _date;
}
function setMilliseconds(date, milliseconds, options) {
  const _date = toDate(date, options?.in);
  _date.setMilliseconds(milliseconds);
  return _date;
}
function setSeconds(date, seconds, options) {
  const _date = toDate(date, options?.in);
  _date.setSeconds(seconds);
  return _date;
}
function setYear(date, year, options) {
  const date_ = toDate(date, options?.in);
  if (isNaN(+date_)) return constructFrom(date, NaN);
  date_.setFullYear(year);
  return date_;
}
function subMonths(date, amount, options) {
  return addMonths(date, -amount, options);
}
function sub(date, duration, options) {
  const {
    years = 0,
    months = 0,
    weeks = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0
  } = duration;
  const withoutMonths = subMonths(date, months + years * 12, options);
  const withoutDays = subDays(withoutMonths, days + weeks * 7, options);
  const minutesToSub = minutes + hours * 60;
  const secondsToSub = seconds + minutesToSub * 60;
  const msToSub = secondsToSub * 1e3;
  return constructFrom(date, +withoutDays - msToSub);
}
function subYears(date, amount, options) {
  return addYears(date, -amount, options);
}
function tzName(timeZone, date, format2 = "long") {
  return new Intl.DateTimeFormat("en-US", {
    // Enforces engine to render the time. Without the option JavaScriptCore omits it.
    hour: "numeric",
    timeZone,
    timeZoneName: format2
  }).format(date).split(/\s/g).slice(2).join(" ");
}
const offsetFormatCache = {};
const offsetCache = {};
function tzOffset(timeZone, date) {
  try {
    const format2 = offsetFormatCache[timeZone] ||= new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "longOffset"
    }).format;
    const offsetStr = format2(date).split("GMT")[1];
    if (offsetStr in offsetCache) return offsetCache[offsetStr];
    return calcOffset(offsetStr, offsetStr.split(":"));
  } catch {
    if (timeZone in offsetCache) return offsetCache[timeZone];
    const captures = timeZone?.match(offsetRe);
    if (captures) return calcOffset(timeZone, captures.slice(1));
    return NaN;
  }
}
const offsetRe = /([+-]\d\d):?(\d\d)?/;
function calcOffset(cacheStr, values) {
  const hours = +(values[0] || 0);
  const minutes = +(values[1] || 0);
  const seconds = +(values[2] || 0) / 60;
  return offsetCache[cacheStr] = hours * 60 + minutes > 0 ? hours * 60 + minutes + seconds : hours * 60 - minutes - seconds;
}
class TZDateMini extends Date {
  //#region static
  constructor(...args) {
    super();
    if (args.length > 1 && typeof args[args.length - 1] === "string") {
      this.timeZone = args.pop();
    }
    this.internal = /* @__PURE__ */ new Date();
    if (isNaN(tzOffset(this.timeZone, this))) {
      this.setTime(NaN);
    } else {
      if (!args.length) {
        this.setTime(Date.now());
      } else if (typeof args[0] === "number" && (args.length === 1 || args.length === 2 && typeof args[1] !== "number")) {
        this.setTime(args[0]);
      } else if (typeof args[0] === "string") {
        this.setTime(+new Date(args[0]));
      } else if (args[0] instanceof Date) {
        this.setTime(+args[0]);
      } else {
        this.setTime(+new Date(...args));
        adjustToSystemTZ(this);
        syncToInternal(this);
      }
    }
  }
  static tz(tz, ...args) {
    return args.length ? new TZDateMini(...args, tz) : new TZDateMini(Date.now(), tz);
  }
  //#endregion
  //#region time zone
  withTimeZone(timeZone) {
    return new TZDateMini(+this, timeZone);
  }
  getTimezoneOffset() {
    const offset2 = -tzOffset(this.timeZone, this);
    return offset2 > 0 ? Math.floor(offset2) : Math.ceil(offset2);
  }
  //#endregion
  //#region time
  setTime(time) {
    Date.prototype.setTime.apply(this, arguments);
    syncToInternal(this);
    return +this;
  }
  //#endregion
  //#region date-fns integration
  [/* @__PURE__ */ Symbol.for("constructDateFrom")](date) {
    return new TZDateMini(+new Date(date), this.timeZone);
  }
  //#endregion
}
const re = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((method) => {
  if (!re.test(method)) return;
  const utcMethod = method.replace(re, "$1UTC");
  if (!TZDateMini.prototype[utcMethod]) return;
  if (method.startsWith("get")) {
    TZDateMini.prototype[method] = function() {
      return this.internal[utcMethod]();
    };
  } else {
    TZDateMini.prototype[method] = function() {
      Date.prototype[utcMethod].apply(this.internal, arguments);
      syncFromInternal(this);
      return +this;
    };
    TZDateMini.prototype[utcMethod] = function() {
      Date.prototype[utcMethod].apply(this, arguments);
      syncToInternal(this);
      return +this;
    };
  }
});
function syncToInternal(date) {
  date.internal.setTime(+date);
  date.internal.setUTCSeconds(date.internal.getUTCSeconds() - Math.round(-tzOffset(date.timeZone, date) * 60));
}
function syncFromInternal(date) {
  Date.prototype.setFullYear.call(date, date.internal.getUTCFullYear(), date.internal.getUTCMonth(), date.internal.getUTCDate());
  Date.prototype.setHours.call(date, date.internal.getUTCHours(), date.internal.getUTCMinutes(), date.internal.getUTCSeconds(), date.internal.getUTCMilliseconds());
  adjustToSystemTZ(date);
}
function adjustToSystemTZ(date) {
  const baseOffset = tzOffset(date.timeZone, date);
  const offset2 = baseOffset > 0 ? Math.floor(baseOffset) : Math.ceil(baseOffset);
  const prevHour = /* @__PURE__ */ new Date(+date);
  prevHour.setUTCHours(prevHour.getUTCHours() - 1);
  const systemOffset = -(/* @__PURE__ */ new Date(+date)).getTimezoneOffset();
  const prevHourSystemOffset = -(/* @__PURE__ */ new Date(+prevHour)).getTimezoneOffset();
  const systemDSTChange = systemOffset - prevHourSystemOffset;
  const dstShift = Date.prototype.getHours.apply(date) !== date.internal.getUTCHours();
  if (systemDSTChange && dstShift) date.internal.setUTCMinutes(date.internal.getUTCMinutes() + systemDSTChange);
  const offsetDiff = systemOffset - offset2;
  if (offsetDiff) Date.prototype.setUTCMinutes.call(date, Date.prototype.getUTCMinutes.call(date) + offsetDiff);
  const systemDate = /* @__PURE__ */ new Date(+date);
  systemDate.setUTCSeconds(0);
  const systemSecondsOffset = systemOffset > 0 ? systemDate.getSeconds() : (systemDate.getSeconds() - 60) % 60;
  const secondsOffset = Math.round(-(tzOffset(date.timeZone, date) * 60)) % 60;
  if (secondsOffset || systemSecondsOffset) {
    date.internal.setUTCSeconds(date.internal.getUTCSeconds() + secondsOffset);
    Date.prototype.setUTCSeconds.call(date, Date.prototype.getUTCSeconds.call(date) + secondsOffset + systemSecondsOffset);
  }
  const postBaseOffset = tzOffset(date.timeZone, date);
  const postOffset = postBaseOffset > 0 ? Math.floor(postBaseOffset) : Math.ceil(postBaseOffset);
  const postSystemOffset = -(/* @__PURE__ */ new Date(+date)).getTimezoneOffset();
  const postOffsetDiff = postSystemOffset - postOffset;
  const offsetChanged = postOffset !== offset2;
  const postDiff = postOffsetDiff - offsetDiff;
  if (offsetChanged && postDiff) {
    Date.prototype.setUTCMinutes.call(date, Date.prototype.getUTCMinutes.call(date) + postDiff);
    const newBaseOffset = tzOffset(date.timeZone, date);
    const newOffset = newBaseOffset > 0 ? Math.floor(newBaseOffset) : Math.ceil(newBaseOffset);
    const offsetChange = postOffset - newOffset;
    if (offsetChange) {
      date.internal.setUTCMinutes(date.internal.getUTCMinutes() + offsetChange);
      Date.prototype.setUTCMinutes.call(date, Date.prototype.getUTCMinutes.call(date) + offsetChange);
    }
  }
}
class TZDate extends TZDateMini {
  //#region static
  static tz(tz, ...args) {
    return args.length ? new TZDate(...args, tz) : new TZDate(Date.now(), tz);
  }
  //#endregion
  //#region representation
  toISOString() {
    const [sign, hours, minutes] = this.tzComponents();
    const tz = `${sign}${hours}:${minutes}`;
    return this.internal.toISOString().slice(0, -1) + tz;
  }
  toString() {
    return `${this.toDateString()} ${this.toTimeString()}`;
  }
  toDateString() {
    const [day, date, month, year] = this.internal.toUTCString().split(" ");
    return `${day?.slice(0, -1)} ${month} ${date} ${year}`;
  }
  toTimeString() {
    const time = this.internal.toUTCString().split(" ")[4];
    const [sign, hours, minutes] = this.tzComponents();
    return `${time} GMT${sign}${hours}${minutes} (${tzName(this.timeZone, this)})`;
  }
  toLocaleString(locales, options) {
    return Date.prototype.toLocaleString.call(this, locales, {
      ...options,
      timeZone: options?.timeZone || this.timeZone
    });
  }
  toLocaleDateString(locales, options) {
    return Date.prototype.toLocaleDateString.call(this, locales, {
      ...options,
      timeZone: options?.timeZone || this.timeZone
    });
  }
  toLocaleTimeString(locales, options) {
    return Date.prototype.toLocaleTimeString.call(this, locales, {
      ...options,
      timeZone: options?.timeZone || this.timeZone
    });
  }
  //#endregion
  //#region private
  tzComponents() {
    const offset2 = this.getTimezoneOffset();
    const sign = offset2 > 0 ? "-" : "+";
    const hours = String(Math.floor(Math.abs(offset2) / 60)).padStart(2, "0");
    const minutes = String(Math.abs(offset2) % 60).padStart(2, "0");
    return [sign, hours, minutes];
  }
  //#endregion
  withTimeZone(timeZone) {
    return new TZDate(+this, timeZone);
  }
  //#region date-fns integration
  [/* @__PURE__ */ Symbol.for("constructDateFrom")](date) {
    return new TZDate(+new Date(date), this.timeZone);
  }
  //#endregion
}
function Et() {
  return vueExports.h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 32 32",
      fill: "currentColor",
      "aria-hidden": "true",
      class: "dp__icon",
      role: "img"
    },
    [
      vueExports.h("path", {
        d: "M29.333 8c0-2.208-1.792-4-4-4h-18.667c-2.208 0-4 1.792-4 4v18.667c0 2.208 1.792 4 4 4h18.667c2.208 0 4-1.792 4-4v-18.667zM26.667 8v18.667c0 0.736-0.597 1.333-1.333 1.333 0 0-18.667 0-18.667 0-0.736 0-1.333-0.597-1.333-1.333 0 0 0-18.667 0-18.667 0-0.736 0.597-1.333 1.333-1.333 0 0 18.667 0 18.667 0 0.736 0 1.333 0.597 1.333 1.333z"
      }),
      vueExports.h("path", {
        d: "M20 2.667v5.333c0 0.736 0.597 1.333 1.333 1.333s1.333-0.597 1.333-1.333v-5.333c0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333z"
      }),
      vueExports.h("path", {
        d: "M9.333 2.667v5.333c0 0.736 0.597 1.333 1.333 1.333s1.333-0.597 1.333-1.333v-5.333c0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333z"
      }),
      vueExports.h("path", {
        d: "M4 14.667h24c0.736 0 1.333-0.597 1.333-1.333s-0.597-1.333-1.333-1.333h-24c-0.736 0-1.333 0.597-1.333 1.333s0.597 1.333 1.333 1.333z"
      })
    ]
  );
}
function On() {
  return vueExports.h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 32 32",
      fill: "currentColor",
      "aria-hidden": "true",
      class: "dp__icon",
      role: "img"
    },
    [
      vueExports.h("path", {
        d: "M23.057 7.057l-16 16c-0.52 0.52-0.52 1.365 0 1.885s1.365 0.52 1.885 0l16-16c0.52-0.52 0.52-1.365 0-1.885s-1.365-0.52-1.885 0z"
      }),
      vueExports.h("path", {
        d: "M7.057 8.943l16 16c0.52 0.52 1.365 0.52 1.885 0s0.52-1.365 0-1.885l-16-16c-0.52-0.52-1.365-0.52-1.885 0s-0.52 1.365 0 1.885z"
      })
    ]
  );
}
function Ca() {
  return vueExports.h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 32 32",
      fill: "currentColor",
      "aria-hidden": "true",
      class: "dp__icon",
      role: "img"
    },
    [
      vueExports.h("path", {
        d: "M20.943 23.057l-7.057-7.057c0 0 7.057-7.057 7.057-7.057 0.52-0.52 0.52-1.365 0-1.885s-1.365-0.52-1.885 0l-8 8c-0.521 0.521-0.521 1.365 0 1.885l8 8c0.52 0.52 1.365 0.52 1.885 0s0.52-1.365 0-1.885z"
      })
    ]
  );
}
function xa() {
  return vueExports.h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 32 32",
      fill: "currentColor",
      "aria-hidden": "true",
      class: "dp__icon",
      role: "img"
    },
    [
      vueExports.h("path", {
        d: "M12.943 24.943l8-8c0.521-0.521 0.521-1.365 0-1.885l-8-8c-0.52-0.52-1.365-0.52-1.885 0s-0.52 1.365 0 1.885l7.057 7.057c0 0-7.057 7.057-7.057 7.057-0.52 0.52-0.52 1.365 0 1.885s1.365 0.52 1.885 0z"
      })
    ]
  );
}
function Oa() {
  return vueExports.h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 32 32",
      fill: "currentColor",
      "aria-hidden": "true",
      class: "dp__icon",
      role: "img"
    },
    [
      vueExports.h("path", {
        d: "M16 1.333c-8.095 0-14.667 6.572-14.667 14.667s6.572 14.667 14.667 14.667c8.095 0 14.667-6.572 14.667-14.667s-6.572-14.667-14.667-14.667zM16 4c6.623 0 12 5.377 12 12s-5.377 12-12 12c-6.623 0-12-5.377-12-12s5.377-12 12-12z"
      }),
      vueExports.h("path", {
        d: "M14.667 8v8c0 0.505 0.285 0.967 0.737 1.193l5.333 2.667c0.658 0.329 1.46 0.062 1.789-0.596s0.062-1.46-0.596-1.789l-4.596-2.298c0 0 0-7.176 0-7.176 0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333z"
      })
    ]
  );
}
function Ya() {
  return vueExports.h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 32 32",
      fill: "currentColor",
      "aria-hidden": "true",
      class: "dp__icon",
      role: "img"
    },
    [
      vueExports.h("path", {
        d: "M24.943 19.057l-8-8c-0.521-0.521-1.365-0.521-1.885 0l-8 8c-0.52 0.52-0.52 1.365 0 1.885s1.365 0.52 1.885 0l7.057-7.057c0 0 7.057 7.057 7.057 7.057 0.52 0.52 1.365 0.52 1.885 0s0.52-1.365 0-1.885z"
      })
    ]
  );
}
function Ba() {
  return vueExports.h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 32 32",
      fill: "currentColor",
      "aria-hidden": "true",
      class: "dp__icon",
      role: "img"
    },
    [
      vueExports.h("path", {
        d: "M7.057 12.943l8 8c0.521 0.521 1.365 0.521 1.885 0l8-8c0.52-0.52 0.52-1.365 0-1.885s-1.365-0.52-1.885 0l-7.057 7.057c0 0-7.057-7.057-7.057-7.057-0.52-0.52-1.365-0.52-1.885 0s-0.52 1.365 0 1.885z"
      })
    ]
  );
}
const Ia = /* @__PURE__ */ Symbol("ContextKey"), Yn = (e, A) => {
  const { setTimeModelValue: f } = Ie(), o = Tr(e), c = vueExports.ref(null), s = vueExports.reactive({
    menuFocused: false,
    shiftKeyInMenu: false,
    isInputFocused: false,
    isTextInputDate: false,
    arrowNavigationLevel: 0
  }), r = o.getDate(/* @__PURE__ */ new Date()), u = vueExports.ref(""), v = vueExports.ref([{ month: getMonth(r), year: getYear(r) }]), Y = vueExports.reactive({ hours: 0, minutes: 0, seconds: 0 });
  f(Y, null, r, o.range.value.enabled);
  const P = vueExports.computed({
    get: () => c.value,
    set: (h) => {
      c.value = h;
    }
  }), B = vueExports.computed(
    () => (h) => v.value[h] ? v.value[h].month : 0
  ), O = vueExports.computed(
    () => (h) => v.value[h] ? v.value[h].year : 0
  ), l = (h, _) => {
    s[h] = _;
  }, w = () => {
    f(Y, P.value, r, o.range.value.enabled);
  };
  vueExports.provide(Ia, {
    rootProps: e,
    defaults: o,
    modelValue: P,
    state: vueExports.readonly(s),
    rootEmit: A,
    calendars: v,
    month: B,
    year: O,
    time: Y,
    today: r,
    inputValue: u,
    setState: l,
    updateTime: w,
    getDate: o.getDate
  });
}, Me = () => {
  const e = vueExports.inject(Ia);
  if (!e)
    throw new Error("Can't use context");
  return e;
};
var Ge = /* @__PURE__ */ ((e) => (e.month = "month", e.year = "year", e))(Ge || {}), bt = /* @__PURE__ */ ((e) => (e.header = "header", e.calendar = "calendar", e.timePicker = "timePicker", e))(bt || {}), He = /* @__PURE__ */ ((e) => (e.month = "month", e.year = "year", e.calendar = "calendar", e.time = "time", e.minutes = "minutes", e.hours = "hours", e.seconds = "seconds", e))(He || {});
const Bn = ["timestamp", "date", "iso"];
var Xe = /* @__PURE__ */ ((e) => (e.up = "up", e.down = "down", e.left = "left", e.right = "right", e))(Xe || {}), $e = /* @__PURE__ */ ((e) => (e.arrowUp = "ArrowUp", e.arrowDown = "ArrowDown", e.arrowLeft = "ArrowLeft", e.arrowRight = "ArrowRight", e.enter = "Enter", e.space = " ", e.esc = "Escape", e.tab = "Tab", e.home = "Home", e.end = "End", e.pageUp = "PageUp", e.pageDown = "PageDown", e))($e || {}), Mt = /* @__PURE__ */ ((e) => (e.MONTH_AND_YEAR = "MM-yyyy", e.YEAR = "yyyy", e.DATE = "dd-MM-yyyy", e))(Mt || {}), Ea = /* @__PURE__ */ ((e) => (e[e.Sunday = 0] = "Sunday", e[e.Monday = 1] = "Monday", e[e.Tuesday = 2] = "Tuesday", e[e.Wednesday = 3] = "Wednesday", e[e.Thursday = 4] = "Thursday", e[e.Friday = 5] = "Friday", e[e.Saturday = 6] = "Saturday", e))(Ea || {});
const In = () => {
  const { rootProps: e, state: A } = Me(), f = vueExports.computed(() => A.arrowNavigationLevel), o = vueExports.ref(-1), c = vueExports.ref(-1);
  vueExports.watch(f, (E, k) => {
    b(E === 0 && k > 0);
  });
  const s = vueExports.ref([]), r = vueExports.ref(/* @__PURE__ */ new Map()), u = () => {
    const E = Array.from(
      (void 0).querySelectorAll(`[data-dp-action-element="${f.value}"]`)
    ), k = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map();
    for (const M of E) {
      const R = M.getBoundingClientRect(), $ = R.top, S = R.left;
      k.has($) || k.set($, []), k.get($).push(M), g.set(M, { row: $, col: S });
    }
    s.value = Array.from(k.entries()).sort((M, R) => M[0] - R[0]).map(([M, R]) => v(R, g)), r.value = g;
  }, v = (E, k) => E.sort((g, M) => {
    const R = k.get(g), $ = k.get(M);
    return R.col - $.col;
  }), h = () => {
    vueExports.nextTick().then(() => {
      u();
      const E = s.value[o.value]?.[c.value];
      E && _(E);
    });
  }, _ = (E) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        E.focus({ preventScroll: true });
      });
    });
  }, b = (E) => {
    if (E)
      return h();
    const k = (void 0).querySelector(`[data-dp-element-active="${f.value}"]`);
    if (k && !E)
      _(k);
    else {
      const g = (void 0).querySelector(`[data-dp-action-element="${f.value}"]`);
      g && _(g);
    }
  };
}, En = () => {
  const { checkPartialRangeValue: e, checkRangeEnabled: A, isValidDate: f } = Ue(), { convertType: o, errorMapper: c } = Ie(), {
    getDate: s,
    rootEmit: r,
    state: u,
    rootProps: v,
    inputValue: Y,
    defaults: { textInput: P, range: B, multiDates: O, timeConfig: l, formats: w },
    modelValue: h,
    updateTime: _
  } = Me(), { setTime: b, getWeekFromDate: E } = We(), { formatSelectedDate: k, formatForTextInput: g } = pt();
  vueExports.watch(
    h,
    (y, H) => {
      r("internal-model-change", h.value), JSON.stringify(H ?? {}) !== JSON.stringify(y ?? {}) && _();
    },
    { deep: true }
  ), vueExports.watch(B, (y, H) => {
    y.enabled !== H.enabled && (h.value = null);
  }), vueExports.watch(
    () => w.value.input,
    () => {
      Z();
    }
  );
  const M = (y) => y ? v.modelType ? G(y) : {
    hours: getHours(y),
    minutes: getMinutes(y),
    seconds: l.value.enableSeconds ? getSeconds(y) : 0
  } : null, R = (y) => v.modelType ? G(y) : { month: getMonth(y), year: getYear(y) }, $ = (y) => Array.isArray(y) ? O.value.enabled ? y.map((H) => S(H, setYear(s(), H))) : A(
    () => [
      setYear(s(), y[0]),
      y[1] ? setYear(s(), y[1]) : e(B.value.partialRange)
    ],
    B.value.enabled
  ) : setYear(s(), +y), S = (y, H) => (typeof y == "string" || typeof y == "number") && v.modelType ? de(y) : H, p = (y) => Array.isArray(y) ? [
    S(y[0], b(y[0])),
    S(y[1], b(y[1]))
  ] : S(y, b(y)), D = (y) => {
    const H = set(s(), { date: 1 });
    return Array.isArray(y) ? O.value.enabled ? y.map(
      (fe) => S(fe, set(H, { month: +fe.month, year: +fe.year }))
    ) : A(
      () => [
        S(y[0], set(H, { month: +y[0].month, year: +y[0].year })),
        S(
          y[1],
          y[1] ? set(H, { month: +y[1].month, year: +y[1].year }) : e(B.value.partialRange)
        )
      ],
      B.value.enabled
    ) : S(y, set(H, { month: +y.month, year: +y.year }));
  }, V = (y) => {
    if (Array.isArray(y))
      return y.map((H) => de(H));
    throw new Error(c.dateArr("multi-dates"));
  }, F = (y) => {
    if (Array.isArray(y) && B.value.enabled) {
      const H = y[0], fe = y[1];
      return [
        s(Array.isArray(H) ? H[0] : null),
        Array.isArray(fe) && fe.length ? s(fe[0]) : null
      ];
    }
    return s(y[0]);
  }, L = (y) => v.modelAuto ? Array.isArray(y) ? [de(y[0]), de(y[1])] : v.autoApply ? [de(y)] : [de(y), null] : Array.isArray(y) ? A(
    () => y[1] ? [
      de(y[0]),
      y[1] ? de(y[1]) : e(B.value.partialRange)
    ] : [de(y[0])],
    B.value.enabled
  ) : de(y), ne = () => {
    Array.isArray(h.value) && B.value.enabled && h.value.length === 1 && h.value.push(e(B.value.partialRange));
  }, re2 = () => {
    const y = h.value;
    return [
      G(y[0]),
      y[1] ? G(y[1]) : e(B.value.partialRange)
    ];
  }, X = () => Array.isArray(h.value) ? h.value[1] ? re2() : G(o(h.value[0])) : [], x = () => (h.value || []).map((y) => G(y)), te = (y = false) => (y || ne(), v.modelAuto ? X() : O.value.enabled ? x() : Array.isArray(h.value) ? A(() => re2(), B.value.enabled) : G(o(h.value))), q = (y) => !y || Array.isArray(y) && !y.length ? null : v.timePicker ? p(o(y)) : v.monthPicker ? D(o(y)) : v.yearPicker ? $(o(y)) : O.value.enabled ? V(o(y)) : v.weekPicker ? F(o(y)) : L(o(y)), oe = (y) => {
    if (u.isTextInputDate) return;
    const H = q(y);
    f(o(H)) ? (h.value = o(H), Z()) : (h.value = null, Y.value = "");
  }, K = () => h.value ? O.value.enabled ? h.value.map((y) => k(y)).join("; ") : P.value.enabled ? g() : k(h.value) : "", Z = () => {
    Y.value = K();
  }, de = (y) => v.modelType ? Bn.includes(v.modelType) ? s(y) : v.modelType === "format" && typeof w.value.input == "string" ? parse(y, w.value.input, s(), { locale: v.locale }) : parse(y, v.modelType, s(), { locale: v.locale }) : s(y), G = (y) => y ? v.modelType ? v.modelType === "timestamp" ? +y : v.modelType === "iso" ? y.toISOString() : v.modelType === "format" && typeof w.value.input == "string" ? k(y) : k(y, v.modelType) : y : null, ce = (y) => {
    r("update:model-value", y);
  }, le = (y) => Array.isArray(h.value) ? O.value.enabled ? h.value.map((H) => y(H)) : [y(h.value[0]), h.value[1] ? y(h.value[1]) : null] : y(o(h.value)), we = () => {
    if (Array.isArray(h.value)) {
      const y = E(h.value[0], v.weekStart), H = h.value[1] ? E(h.value[1], v.weekStart) : [];
      return [y.map((fe) => s(fe)), H.map((fe) => s(fe))];
    }
    return E(h.value, v.weekStart).map((y) => s(y));
  }, ve = (y) => ce(o(le(y))), Ae = () => r("update:model-value", we());
  return {
    checkBeforeEmit: () => h.value ? B.value.enabled ? B.value.partialRange ? h.value.length >= 1 : h.value.length === 2 : !!h.value : false,
    parseExternalModelValue: oe,
    formatInputValue: Z,
    emitModelValue: () => (Z(), v.monthPicker ? ve(R) : v.timePicker ? ve(M) : v.yearPicker ? ve(getYear) : v.weekPicker ? Ae() : ce(te()))
  };
}, Vt = () => {
  const {
    defaults: { transitions: e }
  } = Me(), A = vueExports.computed(() => (o) => e.value ? o ? e.value.open : e.value.close : ""), f = vueExports.computed(() => (o) => e.value ? o ? e.value.menuAppearTop : e.value.menuAppearBottom : "");
  return { transitionName: A, showTransition: !!e.value, menuTransition: f };
}, Ft = (e) => {
  const {
    today: A,
    time: f,
    modelValue: o,
    defaults: { range: c }
  } = Me(), { setTimeModelValue: s } = Ie();
  vueExports.watch(
    c,
    (r, u) => {
      r.enabled !== u.enabled && s(f, o.value, A, c.value.enabled);
    },
    { deep: true }
  ), vueExports.watch(
    o,
    (r, u) => {
      e && JSON.stringify(r ?? {}) !== JSON.stringify(u ?? {}) && e();
    },
    { deep: true }
  );
}, Ue = () => {
  const {
    defaults: { safeDates: e, range: A, multiDates: f, filters: o, timeConfig: c },
    rootProps: s,
    getDate: r
  } = Me(), { getMapKeyType: u, getMapDate: v, errorMapper: Y, convertType: P } = Ie(), { isDateBefore: B, isDateAfter: O, isDateEqual: l, resetDate: w, getDaysInBetween: h, setTimeValue: _, getTimeObj: b, setTime: E } = We(), k = (i) => e.value.disabledDates ? typeof e.value.disabledDates == "function" ? e.value.disabledDates(r(i)) : !!v(i, e.value.disabledDates) : false, g = (i) => e.value.maxDate ? s.yearPicker ? getYear(i) > getYear(e.value.maxDate) : O(i, e.value.maxDate) : false, M = (i) => e.value.minDate ? s.yearPicker ? getYear(i) < getYear(e.value.minDate) : B(i, e.value.minDate) : false, R = (i) => {
    if (!i) return false;
    const d = g(i), a = M(i), n = k(i), m = o.value.months.map((Qe) => +Qe).includes(getMonth(i)), N = o.value.weekDays?.length ? o.value.weekDays.some((Qe) => +Qe === getDay(i)) : false, U = V(i), pe = getYear(i), ge = pe < +s.yearRange[0] || pe > +s.yearRange[1];
    return !(d || a || n || m || ge || N || U);
  }, $ = (i, d) => B(...Ae(e.value.minDate, i, d)) || l(...Ae(e.value.minDate, i, d)), S = (i, d) => O(...Ae(e.value.maxDate, i, d)) || l(...Ae(e.value.maxDate, i, d)), p = (i, d, a) => {
    let n = false;
    return e.value.maxDate && a && S(i, d) && (n = true), e.value.minDate && !a && $(i, d) && (n = true), n;
  }, D = (i, d, a, n) => {
    let C = false;
    return n && (e.value.minDate || e.value.maxDate) ? e.value.minDate && e.value.maxDate ? C = p(i, d, a) : (e.value.minDate && $(i, d) || e.value.maxDate && S(i, d)) && (C = true) : C = true, C;
  }, V = (i) => Array.isArray(e.value.allowedDates) && !e.value.allowedDates.length ? true : e.value.allowedDates ? !v(
    i,
    e.value.allowedDates,
    u(s.monthPicker, s.yearPicker)
  ) : false, F = (i) => !R(i), L = (i) => A.value.noDisabledRange ? !eachDayOfInterval({ start: i[0], end: i[1] }).some((a) => F(a)) : true, ne = (i) => {
    if (i) {
      const d = getYear(i);
      return d >= +s.yearRange[0] && d <= s.yearRange[1];
    }
    return true;
  }, re2 = (i, d) => !!(Array.isArray(i) && i[d] && (A.value.maxRange || A.value.minRange) && ne(i[d])), X = (i, d, a = 0) => {
    if (re2(d, a) && ne(i)) {
      const n = differenceInCalendarDays(i, d[a]), C = h(d[a], i), m = C.length === 1 ? 0 : C.filter((U) => F(U)).length, N = Math.abs(n) - (A.value.minMaxRawRange ? 0 : m);
      if (A.value.minRange && A.value.maxRange)
        return N >= +A.value.minRange && N <= +A.value.maxRange;
      if (A.value.minRange) return N >= +A.value.minRange;
      if (A.value.maxRange) return N <= +A.value.maxRange;
    }
    return true;
  }, x = () => !c.value.enableTimePicker || s.monthPicker || s.yearPicker || c.value.ignoreTimeValidation, te = (i) => Array.isArray(i) ? [i[0] ? _(i[0]) : null, i[1] ? _(i[1]) : null] : _(i), q = (i, d, a) => d ? i.find(
    (n) => +n.hours === getHours(d) && n.minutes === "*" ? true : +n.minutes === getMinutes(d) && +n.hours === getHours(d)
  ) && a : false, oe = (i, d, a) => {
    const [n, C] = i, [m, N] = d;
    return !q(n, m, a) && !q(C, N, a) && a;
  }, K = (i, d) => {
    const a = Array.isArray(d) ? d : [d];
    return Array.isArray(s.disabledTimes) ? Array.isArray(s.disabledTimes[0]) ? oe(s.disabledTimes, a, i) : !a.some((n) => q(s.disabledTimes, n, i)) : i;
  }, Z = (i, d) => {
    const a = Array.isArray(d) ? [b(d[0]), d[1] ? b(d[1]) : void 0] : b(d), n = !s.disabledTimes(a);
    return i && n;
  }, de = (i, d) => s.disabledTimes ? Array.isArray(s.disabledTimes) ? K(d, i) : Z(d, i) : d, G = (i) => {
    let d = true;
    if (!i || x()) return true;
    const a = !e.value.minDate && !e.value.maxDate ? te(i) : i;
    return (s.maxTime || e.value.maxDate) && (d = I(
      s.maxTime,
      e.value.maxDate,
      "max",
      P(a),
      d
    )), (s.minTime || e.value.minDate) && (d = I(
      s.minTime,
      e.value.minDate,
      "min",
      P(a),
      d
    )), de(i, d);
  }, ce = (i) => {
    if (!s.monthPicker) return true;
    let d = true;
    const a = r(w(i));
    if (e.value.minDate && e.value.maxDate) {
      const n = r(w(e.value.minDate)), C = r(w(e.value.maxDate));
      return O(a, n) && B(a, C) || l(a, n) || l(a, C);
    }
    if (e.value.minDate) {
      const n = r(w(e.value.minDate));
      d = O(a, n) || l(a, n);
    }
    if (e.value.maxDate) {
      const n = r(w(e.value.maxDate));
      d = B(a, n) || l(a, n);
    }
    return d;
  }, le = vueExports.computed(() => (i) => !c.value.enableTimePicker || c.value.ignoreTimeValidation ? true : G(i)), we = vueExports.computed(() => (i) => s.monthPicker ? Array.isArray(i) && (A.value.enabled || f.value.enabled) ? !i.filter((a) => !ce(a)).length : ce(i) : true), ve = (i, d, a) => {
    if (!d || a && !e.value.maxDate || !a && !e.value.minDate) return false;
    const n = a ? addMonths(i, 1) : subMonths(i, 1), C = [getMonth(n), getYear(n)];
    return a ? !S(...C) : !$(...C);
  }, Ae = (i, d, a) => [set(r(i), { date: 1 }), set(r(), { month: d, year: a, date: 1 })], Q = (i, d, a, n) => {
    if (!i) return true;
    if (n) {
      const C = a === "max" ? isBefore(i, d) : isAfter(i, d), m = { seconds: 0, milliseconds: 0 };
      return C || isEqual(set(i, m), set(d, m));
    }
    return a === "max" ? i.getTime() <= d.getTime() : i.getTime() >= d.getTime();
  }, I = (i, d, a, n, C) => {
    if (Array.isArray(n)) {
      const N = y(i, n[0], d), U = y(i, n[1], d);
      return Q(n[0], N, a, !!d) && Q(n[1], U, a, !!d) && C;
    }
    const m = y(i, n, d);
    return Q(n, m, a, !!d) && C;
  }, y = (i, d, a) => i ? E(i, d) : r(a ?? d);
  return {
    isDisabled: F,
    validateDate: R,
    validateMonthYearInRange: D,
    isDateRangeAllowed: L,
    checkMinMaxRange: X,
    isValidTime: G,
    validateMonthYear: ve,
    validateMinDate: $,
    validateMaxDate: S,
    isValidDate: (i) => Array.isArray(i) ? isValid(i[0]) && (i[1] ? isValid(i[1]) : true) : i ? isValid(i) : false,
    checkPartialRangeValue: (i) => {
      if (i) return null;
      throw new Error(Y.prop("partial-range"));
    },
    checkRangeEnabled: (i, d) => {
      if (d) return i();
      throw new Error(Y.prop("range"));
    },
    checkMinMaxValue: (i, d, a) => {
      const n = a != null, C = d != null;
      if (!n && !C) return false;
      const m = +a, N = +d;
      return n && C ? +i > m || +i < N : n ? +i > m : C ? +i < N : false;
    },
    isTimeValid: le,
    isMonthValid: we
  };
}, Vn = (e) => {
  const {
    rootEmit: A,
    rootProps: f,
    defaults: { timeConfig: o, flow: c }
  } = Me(), s = vueExports.ref(0), r = vueExports.reactive({
    [bt.timePicker]: !o.value.enableTimePicker || f.timePicker || f.monthPicker,
    [bt.calendar]: false,
    [bt.header]: false
  }), u = vueExports.computed(() => f.monthPicker || f.timePicker), v = (l) => {
    if (c.value?.steps?.length) {
      if (!l && u.value) return O();
      r[l] = true, Object.keys(r).filter((w) => !r[w]).length || O();
    }
  }, Y = () => {
    c.value?.steps?.length && s.value !== -1 && (s.value += 1, A("flow-step", s.value), O()), c.value?.steps?.length === s.value && vueExports.nextTick().then(() => P());
  }, P = () => {
    s.value = -1;
  }, B = (l, w, ...h) => {
    c.value?.steps[s.value] === l && e.value && e.value[w]?.(...h);
  }, O = (l = 0) => {
    l && (s.value += l), B(He.month, "toggleMonthPicker", true), B(He.year, "toggleYearPicker", true), B(He.calendar, "toggleTimePicker", false, true), B(He.time, "toggleTimePicker", true, true);
    const w = c.value?.steps[s.value];
    (w === He.hours || w === He.minutes || w === He.seconds) && B(w, "toggleTimePicker", true, true, w);
  };
  return { childMount: v, updateFlowStep: Y, resetFlow: P, handleFlow: O, flowStep: s };
};
function fa(e) {
  return (A = {}) => {
    const f = A.width ? String(A.width) : e.defaultWidth;
    return e.formats[f] || e.formats[e.defaultWidth];
  };
}
function xt(e) {
  return (A, f) => {
    const o = f?.context ? String(f.context) : "standalone";
    let c;
    if (o === "formatting" && e.formattingValues) {
      const r = e.defaultFormattingWidth || e.defaultWidth, u = f?.width ? String(f.width) : r;
      c = e.formattingValues[u] || e.formattingValues[r];
    } else {
      const r = e.defaultWidth, u = f?.width ? String(f.width) : e.defaultWidth;
      c = e.values[u] || e.values[r];
    }
    const s = e.argumentCallback ? e.argumentCallback(A) : A;
    return c[s];
  };
}
function Ot(e) {
  return (A, f = {}) => {
    const o = f.width, c = o && e.matchPatterns[o] || e.matchPatterns[e.defaultMatchWidth], s = A.match(c);
    if (!s)
      return null;
    const r = s[0], u = o && e.parsePatterns[o] || e.parsePatterns[e.defaultParseWidth], v = Array.isArray(u) ? Nn(u, (B) => B.test(r)) : (
      // [TODO] -- I challenge you to fix the type
      Fn(u, (B) => B.test(r))
    );
    let Y;
    Y = e.valueCallback ? e.valueCallback(v) : v, Y = f.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      f.valueCallback(Y)
    ) : Y;
    const P = A.slice(r.length);
    return { value: Y, rest: P };
  };
}
function Fn(e, A) {
  for (const f in e)
    if (Object.prototype.hasOwnProperty.call(e, f) && A(e[f]))
      return f;
}
function Nn(e, A) {
  for (let f = 0; f < e.length; f++)
    if (A(e[f]))
      return f;
}
function Wn(e) {
  return (A, f = {}) => {
    const o = A.match(e.matchPattern);
    if (!o) return null;
    const c = o[0], s = A.match(e.parsePattern);
    if (!s) return null;
    let r = e.valueCallback ? e.valueCallback(s[0]) : s[0];
    r = f.valueCallback ? f.valueCallback(r) : r;
    const u = A.slice(c.length);
    return { value: r, rest: u };
  };
}
const Ln = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
}, Hn = (e, A, f) => {
  let o;
  const c = Ln[e];
  return typeof c == "string" ? o = c : A === 1 ? o = c.one : o = c.other.replace("{{count}}", A.toString()), f?.addSuffix ? f.comparison && f.comparison > 0 ? "in " + o : o + " ago" : o;
}, jn = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, Kn = (e, A, f, o) => jn[e], zn = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, qn = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, Un = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
}, Qn = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
}, Jn = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
}, Gn = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
}, Xn = (e, A) => {
  const f = Number(e), o = f % 100;
  if (o > 20 || o < 10)
    switch (o % 10) {
      case 1:
        return f + "st";
      case 2:
        return f + "nd";
      case 3:
        return f + "rd";
    }
  return f + "th";
}, Zn = {
  ordinalNumber: Xn,
  era: xt({
    values: zn,
    defaultWidth: "wide"
  }),
  quarter: xt({
    values: qn,
    defaultWidth: "wide",
    argumentCallback: (e) => e - 1
  }),
  month: xt({
    values: Un,
    defaultWidth: "wide"
  }),
  day: xt({
    values: Qn,
    defaultWidth: "wide"
  }),
  dayPeriod: xt({
    values: Jn,
    defaultWidth: "wide",
    formattingValues: Gn,
    defaultFormattingWidth: "wide"
  })
}, er = /^(\d+)(th|st|nd|rd)?/i, tr = /\d+/i, ar = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, nr = {
  any: [/^b/i, /^(a|c)/i]
}, rr = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, lr = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, or = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, sr = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
}, ur = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, ir = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, cr = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, dr = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
}, vr = {
  ordinalNumber: Wn({
    matchPattern: er,
    parsePattern: tr,
    valueCallback: (e) => parseInt(e, 10)
  }),
  era: Ot({
    matchPatterns: ar,
    defaultMatchWidth: "wide",
    parsePatterns: nr,
    defaultParseWidth: "any"
  }),
  quarter: Ot({
    matchPatterns: rr,
    defaultMatchWidth: "wide",
    parsePatterns: lr,
    defaultParseWidth: "any",
    valueCallback: (e) => e + 1
  }),
  month: Ot({
    matchPatterns: or,
    defaultMatchWidth: "wide",
    parsePatterns: sr,
    defaultParseWidth: "any"
  }),
  day: Ot({
    matchPatterns: ur,
    defaultMatchWidth: "wide",
    parsePatterns: ir,
    defaultParseWidth: "any"
  }),
  dayPeriod: Ot({
    matchPatterns: cr,
    defaultMatchWidth: "any",
    parsePatterns: dr,
    defaultParseWidth: "any"
  })
}, fr = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, mr = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, pr = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, hr = {
  date: fa({
    formats: fr,
    defaultWidth: "full"
  }),
  time: fa({
    formats: mr,
    defaultWidth: "full"
  }),
  dateTime: fa({
    formats: pr,
    defaultWidth: "full"
  })
}, gr = {
  code: "en-US",
  formatDistance: Hn,
  formatLong: hr,
  formatRelative: Kn,
  localize: Zn,
  match: vr,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
}, Da = {
  noDisabledRange: false,
  showLastInRange: true,
  minMaxRawRange: false,
  partialRange: true,
  disableTimeRangeValidation: false,
  maxRange: void 0,
  minRange: void 0,
  autoRange: void 0,
  fixedStart: false,
  fixedEnd: false,
  autoSwitchStartEnd: true
}, yr = {
  allowStopPropagation: true,
  closeOnScroll: false,
  modeHeight: 255,
  allowPreventDefault: false,
  closeOnClearValue: true,
  closeOnAutoApply: true,
  noSwipe: false,
  keepActionRow: false,
  onClickOutside: void 0,
  tabOutClosesMenu: true,
  arrowLeft: void 0,
  keepViewOnOffsetClick: false,
  timeArrowHoldThreshold: 0,
  shadowDom: false,
  mobileBreakpoint: 600,
  setDateOnMenuClose: false,
  escClose: true,
  spaceConfirm: true,
  monthChangeOnArrows: true,
  monthChangeOnScroll: true
}, Ma = {
  enterSubmit: true,
  tabSubmit: true,
  openMenu: "open",
  selectOnFocus: false,
  rangeSeparator: " - ",
  escClose: true,
  format: void 0,
  maskFormat: void 0,
  applyOnBlur: false,
  separators: void 0
}, br = {
  dates: [],
  years: [],
  months: [],
  quarters: [],
  weeks: [],
  weekdays: [],
  options: { highlightDisabled: false }
}, kr = {
  showSelect: true,
  showCancel: true,
  showNow: false,
  showPreview: true,
  selectBtnLabel: "Select",
  cancelBtnLabel: "Cancel",
  nowBtnLabel: "Now",
  nowBtnRound: void 0
}, wr = {
  toggleOverlay: "Toggle overlay",
  menu: "Datepicker menu",
  input: "Datepicker input",
  openTimePicker: "Open time picker",
  closeTimePicker: "Close time Picker",
  incrementValue: (e) => `Increment ${e}`,
  decrementValue: (e) => `Decrement ${e}`,
  openTpOverlay: (e) => `Open ${e} overlay`,
  amPmButton: "Switch AM/PM mode",
  openYearsOverlay: "Open years overlay",
  openMonthsOverlay: "Open months overlay",
  nextMonth: "Next month",
  prevMonth: "Previous month",
  nextYear: "Next year",
  prevYear: "Previous year",
  day: void 0,
  weekDay: void 0,
  clearInput: "Clear value",
  calendarIcon: "Calendar icon",
  timePicker: "Time picker",
  monthPicker: (e) => `Month picker${e ? " overlay" : ""}`,
  yearPicker: (e) => `Year picker${e ? " overlay" : ""}`,
  timeOverlay: (e) => `${e} overlay`
}, _a = {
  menuAppearTop: "dp-menu-appear-top",
  menuAppearBottom: "dp-menu-appear-bottom",
  open: "dp-slide-down",
  close: "dp-slide-up",
  next: "calendar-next",
  previous: "calendar-prev",
  vNext: "dp-slide-up",
  vPrevious: "dp-slide-down"
}, Dr = {
  weekDays: [],
  months: [],
  years: [],
  times: { hours: [], minutes: [], seconds: [] }
}, Mr = {
  month: "LLL",
  year: "yyyy",
  weekDay: "EEEEEE",
  quarter: "MMMM",
  day: "d",
  input: void 0,
  preview: void 0
}, _r = {
  enableTimePicker: true,
  ignoreTimeValidation: false,
  enableSeconds: false,
  enableMinutes: true,
  is24: true,
  noHoursOverlay: false,
  noMinutesOverlay: false,
  noSecondsOverlay: false,
  hoursGridIncrement: 1,
  minutesGridIncrement: 5,
  secondsGridIncrement: 5,
  hoursIncrement: 1,
  minutesIncrement: 1,
  secondsIncrement: 1,
  timePickerInline: false,
  startTime: void 0
}, Ar = {
  flowStep: 0,
  menuWrapRef: null,
  collapse: false
}, Pr = {
  weekStart: Ea.Monday,
  yearRange: () => [1900, 2100],
  ui: () => ({}),
  locale: () => gr,
  dark: false,
  transitions: true,
  hideNavigation: () => [],
  vertical: false,
  hideMonthYearSelect: false,
  disableYearSelect: false,
  autoApply: false,
  disabledDates: () => [],
  hideOffsetDates: false,
  noToday: false,
  markers: () => [],
  presetDates: () => [],
  preventMinMaxNavigation: false,
  reverseYears: false,
  weekPicker: false,
  arrowNavigation: false,
  monthPicker: false,
  yearPicker: false,
  quarterPicker: false,
  timePicker: false,
  modelAuto: false,
  multiDates: false,
  range: false,
  inline: false,
  sixWeeks: false,
  focusStartDate: false,
  yearFirst: false,
  loading: false,
  centered: false
}, Aa = {
  name: void 0,
  required: false,
  autocomplete: "off",
  state: void 0,
  clearable: true,
  alwaysClearable: false,
  hideInputIcon: false,
  id: void 0,
  inputmode: "none"
}, qt = {
  type: "local",
  hideOnOffsetDates: false,
  label: "W"
}, Tr = (e) => {
  const { getMapKey: A, getMapKeyType: f, getTimeObjFromCurrent: o } = Ie();
  function c(x, te) {
    let q;
    return e.timezone ? q = new TZDate(x ?? /* @__PURE__ */ new Date(), e.timezone) : q = x ? new Date(x) : /* @__PURE__ */ new Date(), te ? set(q, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }) : q;
  }
  const s = () => {
    const x = L.value.enableSeconds ? ":ss" : "", te = L.value.enableMinutes ? ":mm" : "";
    return L.value.is24 ? `HH${te}${x}` : `hh${te}${x} aa`;
  }, r = () => e.monthPicker ? "MM/yyyy" : e.timePicker ? s() : e.weekPicker ? `${R.value?.type === "iso" ? "II" : "ww"}-RR` : e.yearPicker ? "yyyy" : e.quarterPicker ? "QQQ/yyyy" : L.value.enableTimePicker ? `MM/dd/yyyy, ${s()}` : "MM/dd/yyyy", u = (x) => o(c(), x, L.value.enableSeconds), v = () => p.value.enabled ? L.value.startTime && Array.isArray(L.value.startTime) ? [u(L.value.startTime[0]), u(L.value.startTime[1])] : null : L.value.startTime && !Array.isArray(L.value.startTime) ? u(L.value.startTime) : null, Y = (x) => x ? typeof x == "boolean" ? x ? 2 : 0 : Math.max(+x, 2) : 0, P = (x) => {
    const te = f(e.monthPicker, e.yearPicker);
    return new Map(
      x.map((q) => {
        const oe = c(q, B.value);
        return [A(oe, te), oe];
      })
    );
  }, B = vueExports.computed(() => e.monthPicker || e.yearPicker || e.quarterPicker), O = vueExports.computed(() => {
    const x = typeof e.multiCalendars == "object" && e.multiCalendars, te = {
      static: true,
      solo: false
    };
    if (!e.multiCalendars) return { ...te, count: Y(false) };
    const q = x ? e.multiCalendars : {}, oe = x ? q.count ?? true : e.multiCalendars, K = Y(oe);
    return Object.assign(te, q, { count: K });
  }), l = vueExports.computed(() => v()), w = vueExports.computed(() => ({ ...wr, ...e.ariaLabels })), h = vueExports.computed(() => ({ ...Dr, ...e.filters })), _ = vueExports.computed(() => typeof e.transitions == "boolean" ? e.transitions ? _a : false : { ..._a, ...e.transitions }), b = vueExports.computed(() => ({ ...kr, ...e.actionRow })), E = vueExports.computed(() => typeof e.textInput == "object" ? {
    ...Ma,
    ...e.textInput,
    format: typeof e.textInput.format == "string" ? e.textInput.format : V.value.input,
    pattern: e.textInput.format ?? V.value.input,
    enabled: true
  } : {
    ...Ma,
    format: V.value.input,
    pattern: V.value.input,
    enabled: e.textInput
  }), k = vueExports.computed(() => {
    const x = { input: false };
    return typeof e.inline == "object" ? { ...x, ...e.inline, enabled: true } : {
      enabled: e.inline,
      ...x
    };
  }), g = vueExports.computed(() => ({ ...yr, ...e.config })), M = vueExports.computed(() => typeof e.highlight == "function" ? e.highlight : {
    ...br,
    ...e.highlight
  }), R = vueExports.computed(() => typeof e.weekNumbers == "object" ? {
    type: e.weekNumbers?.type ?? qt.type,
    hideOnOffsetDates: e.weekNumbers?.hideOnOffsetDates ?? qt.hideOnOffsetDates,
    label: e.weekNumbers.label ?? qt.label
  } : e.weekNumbers ? qt : void 0), $ = vueExports.computed(() => typeof e.multiDates == "boolean" ? { enabled: e.multiDates, dragSelect: true, limit: null } : {
    enabled: !!e.multiDates,
    limit: e.multiDates?.limit ? +e.multiDates.limit : null,
    dragSelect: e.multiDates?.dragSelect ?? true
  }), S = vueExports.computed(() => ({
    minDate: e.minDate ? c(e.minDate) : null,
    maxDate: e.maxDate ? c(e.maxDate) : null,
    disabledDates: Array.isArray(e.disabledDates) ? P(e.disabledDates) : e.disabledDates,
    allowedDates: Array.isArray(e.allowedDates) ? P(e.allowedDates) : null,
    highlight: typeof M.value == "object" && Array.isArray(M.value.dates) ? P(M.value.dates) : M.value,
    markers: e.markers?.length ? new Map(
      e.markers.map((x) => {
        const te = c(x.date);
        return [A(te, Mt.DATE), x];
      })
    ) : null
  })), p = vueExports.computed(() => typeof e.range == "object" ? { enabled: true, ...Da, ...e.range } : {
    enabled: e.range,
    ...Da
  }), D = vueExports.computed(() => ({
    ...Object.fromEntries(
      Object.keys(e.ui).map((te) => {
        const q = te, oe = e.ui[q];
        if (q === "dayClass") return [q, e.ui[q]];
        const K = typeof e.ui[q] == "string" ? { [oe]: true } : Object.fromEntries(oe.map((Z) => [Z, true]));
        return [te, K];
      })
    )
  })), V = vueExports.computed(() => ({
    ...Mr,
    ...e.formats,
    input: e.formats?.input ?? r(),
    preview: e.formats?.preview ?? r()
  })), F = vueExports.computed(() => {
    if (e.teleport)
      return typeof e.teleport == "string" ? e.teleport : typeof e.teleport == "boolean" ? "body" : e.teleport;
  }), L = vueExports.computed(() => ({ ..._r, ...e.timeConfig })), ne = vueExports.computed(() => {
    if (e.flow)
      return { steps: [], partial: false, ...e.flow };
  }), re2 = vueExports.computed(() => {
    const x = E.value.enabled ? "text" : "none";
    return e.inputAttrs ? { ...Aa, inputmode: x, ...e.inputAttrs } : { ...Aa, inputmode: x };
  }), X = vueExports.computed(() => ({
    offset: e.floating?.offset ?? 10,
    arrow: e.floating?.arrow ?? true,
    strategy: e.floating?.strategy ?? void 0,
    placement: e.floating?.placement ?? void 0,
    flip: e.floating?.flip ?? true,
    shift: e.floating?.shift ?? true
  }));
  return {
    transitions: _,
    multiCalendars: O,
    startTime: l,
    ariaLabels: w,
    filters: h,
    actionRow: b,
    textInput: E,
    inline: k,
    config: g,
    highlight: M,
    weekNumbers: R,
    range: p,
    safeDates: S,
    multiDates: $,
    ui: D,
    formats: V,
    teleport: F,
    timeConfig: L,
    flow: ne,
    inputAttrs: re2,
    floatingConfig: X,
    getDate: c
  };
}, Ie = () => {
  const e = (g, M) => format(g, M ?? Mt.DATE), A = (g, M) => g ? Mt.MONTH_AND_YEAR : M ? Mt.YEAR : Mt.DATE, f = (g, M, R) => M.get(e(g, R)), o = (g) => g, c = (g) => g === 0 ? g : !g || Number.isNaN(+g) ? null : +g, s = () => [
    "a[href]",
    "area[href]",
    "input:not([disabled]):not([type='hidden'])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "button:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
    "[data-datepicker-instance]"
  ].join(", "), r = (g, M) => {
    let R = [...(void 0).querySelectorAll(s())];
    R = R.filter((S) => !g.contains(S) || "datepicker-instance" in S.dataset);
    const $ = R.indexOf(g);
    if ($ >= 0 && (M ? $ - 1 >= 0 : $ + 1 <= R.length))
      return R[$ + (M ? -1 : 1)];
  }, u = (g) => String(g).padStart(2, "0"), v = (g, M) => g?.querySelector(`[data-dp-element="${M}"]`), Y = (g, M, R = false) => {
    g && M.allowStopPropagation && (R && g.stopImmediatePropagation(), g.stopPropagation());
  }, P = (g, M, R = false, $) => {
    if (g.key === $e.enter || g.key === $e.space)
      return R && g.preventDefault(), M();
    if ($) return $(g);
  }, B = (g, M) => {
    M.allowStopPropagation && g.stopPropagation(), M.allowPreventDefault && g.preventDefault();
  }, O = (g) => {
    if (g)
      return [...g.querySelectorAll("input, button, select, textarea, a[href]")][0];
  }, l = () => "ontouchstart" in globalThis || (void 0).maxTouchPoints > 0, w = (g) => [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11][g], h = (g) => {
    const M = [], R = ($) => $.filter((S) => !!S);
    for (let $ = 0; $ < g.length; $ += 3) {
      const S = [g[$], g[$ + 1], g[$ + 2]];
      M.push(R(S));
    }
    return M;
  }, _ = {
    prop: (g) => `"${g}" prop must be enabled!`,
    dateArr: (g) => `You need to use array as "model-value" binding in order to support "${g}"`
  }, b = (g, M, R, $, S) => {
    const p = {
      hours: getHours,
      minutes: getMinutes,
      seconds: getSeconds
    };
    if (!M) return $ ? [p[g](R), p[g](R)] : p[g](R);
    if (Array.isArray(M) && $) {
      const D = M[0] ?? R, V = M[1];
      return [p[g](D), V ? p[g](V) : S[g][1] ?? p[g](R)];
    }
    return Array.isArray(M) && !$ ? p[g](M[M.length - 1] ?? R) : p[g](M);
  };
  return {
    getMapKey: e,
    getMapKeyType: A,
    getMapDate: f,
    convertType: o,
    getNumVal: c,
    findNextFocusableElement: r,
    padZero: u,
    getElWithin: v,
    checkStopPropagation: Y,
    checkKeyDown: P,
    handleEventPropagation: B,
    findFocusableEl: O,
    isTouchDevice: l,
    hoursToAmPmHours: w,
    getGroupedList: h,
    setTimeModelValue: (g, M, R, $) => {
      g.hours = b("hours", M, R, $, g), g.minutes = b("minutes", M, R, $, g), g.seconds = b("seconds", M, R, $, g);
    },
    getTimeObjFromCurrent: (g, M, R) => {
      const $ = {
        hours: getHours(g),
        minutes: getMinutes(g),
        seconds: R ? getSeconds(g) : 0
      };
      return Object.assign($, M);
    },
    errorMapper: _
  };
}, We = () => {
  const { getDate: e } = Me(), { getMapDate: A, getGroupedList: f } = Ie(), o = (p, D) => {
    if (!p) return e();
    const V = e(p), F = set(V, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    return D ? startOfMonth(F) : F;
  }, c = (p, D) => {
    const V = e(D);
    return set(V, {
      hours: +(p.hours ?? getHours(V)),
      minutes: +(p.minutes ?? getMinutes(V)),
      seconds: +(p.seconds ?? getSeconds(V)),
      milliseconds: 0
    });
  }, s = (p, D) => {
    const V = startOfWeek(p, { weekStartsOn: +D }), F = endOfWeek(p, { weekStartsOn: +D });
    return [V, F];
  }, r = (p, D) => !p || !D ? false : isBefore(o(p), o(D)), u = (p, D) => !p || !D ? false : isEqual(o(p), o(D)), v = (p, D) => !p || !D ? false : isAfter(o(p), o(D)), Y = (p, D, V) => p?.[0] && p?.[1] ? v(V, p[0]) && r(V, p[1]) : p?.[0] && D ? v(V, p[0]) && r(V, D) || r(V, p[0]) && v(V, D) : false, P = (p, D) => {
    const V = v(p, D) ? D : p, F = v(D, p) ? D : p;
    return eachDayOfInterval({ start: V, end: F });
  }, B = (p) => `dp-${format(p, "yyyy-MM-dd")}`, O = (p) => o(set(e(p), { date: 1 })), l = (p, D) => {
    if (D) {
      const V = getYear(e(D));
      if (V > p) return 12;
      if (V === p) return getMonth(e(D));
    }
  }, w = (p, D) => {
    if (D) {
      const V = getYear(e(D));
      return V < p ? -1 : V === p ? getMonth(e(D)) : void 0;
    }
  }, h = (p) => {
    if (p) return getYear(e(p));
  }, _ = (p) => ({
    hours: getHours(p),
    minutes: getMinutes(p),
    seconds: getSeconds(p)
  });
  return {
    resetDateTime: o,
    groupListAndMap: (p, D) => f(p).map((V) => V.map((F) => {
      const { active: L, disabled: ne, isBetween: re2, highlighted: X } = D(F);
      return {
        ...F,
        active: L,
        disabled: ne,
        className: {
          dp__overlay_cell_active: L,
          dp__overlay_cell: !L,
          dp__overlay_cell_disabled: ne,
          dp__overlay_cell_pad: true,
          dp__overlay_cell_active_disabled: ne && L,
          dp__cell_in_between: re2,
          "dp--highlighted": X
        }
      };
    })),
    setTime: c,
    getWeekFromDate: s,
    isDateAfter: v,
    isDateBefore: r,
    isDateBetween: Y,
    isDateEqual: u,
    getDaysInBetween: P,
    getCellId: B,
    resetDate: O,
    getMinMonth: l,
    getMaxMonth: w,
    getYearFromDate: h,
    getTimeObj: _,
    setTimeValue: (p) => set(e(), _(p)),
    sanitizeTime: (p, D, V) => D && (V || V === 0) ? Object.fromEntries(
      ["hours", "minutes", "seconds"].map((F) => F === D ? [F, V] : [F, Number.isNaN(+p[F]) ? void 0 : +p[F]])
    ) : {
      hours: Number.isNaN(+p.hours) ? void 0 : +p.hours,
      minutes: Number.isNaN(+p.minutes) ? void 0 : +p.minutes,
      seconds: Number.isNaN(+(p.seconds ?? "")) ? void 0 : +p.seconds
    },
    getBeforeAndAfterInRange: (p, D) => {
      const V = subDays(o(D), p), F = addDays(o(D), p);
      return { before: V, after: F };
    },
    isModelAuto: (p) => Array.isArray(p) ? !!p[0] && !!p[1] : false,
    matchDate: (p, D) => p ? D ? D instanceof Map ? !!A(p, D) : D(e(p)) : false : true,
    checkHighlightMonth: (p, D, V) => typeof p == "function" ? p({ month: D, year: V }) : p.months.some((F) => F.month === D && F.year === V),
    checkHighlightYear: (p, D) => typeof p == "function" ? p(D) : p.years.includes(D)
  };
}, Zt = () => {
  const {
    defaults: { config: e }
  } = Me(), A = vueExports.ref(0);
  return {
    isMobile: vueExports.computed(() => A.value <= e.value.mobileBreakpoint ? true : void 0)
  };
}, pt = () => {
  const {
    getDate: e,
    state: A,
    modelValue: f,
    rootProps: o,
    defaults: { formats: c, textInput: s }
  } = Me(), r = (_) => format(setYear(e(), _), c.value.year, { locale: o.locale }), u = (_) => format(setMonth(e(), _), c.value.month, { locale: o.locale }), v = (_) => format(_, c.value.weekDay, { locale: o.locale }), Y = (_) => format(_, c.value.quarter, { locale: o.locale }), P = (_, b) => [_, b].map((E) => Y(E)).join("-"), B = (_) => format(_, c.value.day, { locale: o.locale }), O = (_, b, E) => {
    const k = E ? c.value.preview : c.value.input;
    if (!_) return "";
    if (typeof k == "function") return k(_);
    const g = b ?? k, M = { locale: o.locale };
    return Array.isArray(_) ? `${format(_[0], g, M)}${o.modelAuto && !_[1] ? "" : s.value.rangeSeparator}${_[1] ? format(_[1], g, M) : ""}` : format(_, g, M);
  }, l = () => {
    const _ = (b) => format(b, s.value.format);
    return Array.isArray(f.value) ? `${_(f.value[0])} ${s.value.rangeSeparator} ${f.value[1] ? _(f.value[1]) : ""}` : "";
  };
  return {
    formatYear: r,
    formatMonth: u,
    formatWeekDay: v,
    formatQuarter: Y,
    formatSelectedDate: O,
    formatForTextInput: () => A.isInputFocused && f.value ? Array.isArray(f.value) ? l() : format(f.value, s.value.format) : O(f.value),
    formatPreview: (_) => O(_, void 0, true),
    formatQuarterText: P,
    formatDay: B
  };
}, ea = () => {
  const { rootProps: e } = Me(), { formatYear: A, formatMonth: f } = pt();
  return {
    getMonths: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((r) => ({
      text: f(r),
      value: r
    })),
    getYears: () => {
      const r = [];
      for (let u = +e.yearRange[0]; u <= +e.yearRange[1]; u++)
        r.push({ value: +u, text: A(u) });
      return e.reverseYears ? r.reverse() : r;
    },
    isOutOfYearRange: (r) => r < +e.yearRange[0] || r > +e.yearRange[1]
  };
}, $r = (e) => ({
  openMenu: () => e.value?.openMenu(),
  closeMenu: () => e.value?.closeMenu(),
  selectDate: () => e.value?.selectDate(),
  clearValue: () => e.value?.clearValue(),
  formatInputValue: () => e.value?.formatInputValue(),
  updateInternalModelValue: (h) => e.value?.updateInternalModelValue(h),
  setMonthYear: (h, _) => e.value?.setMonthYear(h, _),
  parseModel: () => e.value?.parseModel(),
  switchView: (h, _) => e.value?.switchView(h, _),
  handleFlow: () => e.value?.handleFlow(),
  toggleMenu: () => e.value?.toggleMenu(),
  dpMenuRef: () => e.value?.dpMenuRef(),
  dpWrapMenuRef: () => e.value?.dpWrapMenuRef(),
  inputRef: () => e.value?.inputRef()
}), Pt = () => ({
  boolHtmlAttribute: (A) => A ? true : void 0
}), Sr = () => {
  const {
    getDate: e,
    rootProps: A,
    defaults: { textInput: f, startTime: o, timeConfig: c }
  } = Me(), { getTimeObjFromCurrent: s } = Ie(), r = vueExports.ref(false), u = vueExports.computed(
    () => Array.isArray(o.value) ? o.value[0] : o.value ?? s(e(), {}, c.value.enableSeconds)
  ), v = (l, w) => {
    const h = /[^a-zA-Z]+/g, _ = /\D+/g, b = w.split(_), E = l.split(h), k = l.match(h) || [], g = w.match(_) || [];
    let M = "";
    for (let R = 0; R < b.length && R < E.length; R++) {
      R > 0 && g[R - 1] && (M += k[R - 1] || g[R - 1]);
      const $ = b[R]?.length;
      M += E[R]?.slice(0, $);
    }
    return M;
  }, Y = (l, w, h) => {
    const _ = parse(l, v(w, l), e(), {
      locale: A.locale
    });
    return isValid(_) && isDate(_) ? h || r.value ? _ : set(_, {
      hours: +u.value.hours,
      minutes: +u.value.minutes,
      seconds: +(u.value.seconds ?? 0),
      milliseconds: 0
    }) : null;
  };
  return {
    textPasted: r,
    parseFreeInput: (l, w) => {
      if (typeof f.value.pattern == "string")
        return Y(l, f.value.pattern, w);
      if (Array.isArray(f.value.pattern)) {
        let h = null;
        for (const _ of f.value.pattern)
          if (h = Y(l, _, w), h)
            break;
        return h;
      }
      return typeof f.value.pattern == "function" ? f.value.pattern(l) : null;
    },
    applyMaxValues: (l, w) => {
      const h = {
        MM: 12,
        DD: 31,
        hh: 23,
        mm: 59,
        ss: 59
      };
      let _ = "", b = 0;
      for (let E = 0; E < w.length; E++) {
        const k = w[E], g = k.length, M = l.slice(b, b + g);
        if (!M) break;
        if (M.length < g)
          _ += M;
        else {
          let R = Number.parseInt(M, 10);
          h[k] && R > h[k] && (R = h[k]), _ += R.toString().padStart(g, "0").slice(0, g);
        }
        b += g;
      }
      return _;
    },
    createMaskedValue: (l, w) => {
      const h = /(YYYY|MM|DD|hh|mm|ss)/g, _ = [...w.matchAll(h)].map((M) => M[0]), b = w.replace(h, "|").split("|").filter(Boolean), E = _.map((M) => M.length);
      let k = "", g = 0;
      for (let M = 0; M < _.length; M++) {
        const R = E[M], $ = l.slice(g, g + R);
        if (!$) break;
        k += $, $.length === R && b[M] && (k += b[M]), g += R;
      }
      return k;
    }
  };
};
var at = /* @__PURE__ */ ((e) => (e.Input = "input", e.DatePicker = "date-picker", e.Calendar = "calendar", e.DatePickerHeader = "date-picker-header", e.Menu = "menu", e.ActionRow = "action-row", e.TimePicker = "time-picker", e.TimeInput = "time-input", e.PassTrough = "pass-trough", e.MonthPicker = "month-picker", e.YearMode = "year-mode", e.QuarterPicker = "quarter-picker", e.YearPicker = "year-picker", e))(at || {});
const wt = [
  "time-input",
  "time-picker",
  "pass-trough"
  /* PassTrough */
], Va = [
  { name: "trigger", use: [
    "input"
    /* Input */
  ] },
  { name: "input-icon", use: [
    "input"
    /* Input */
  ] },
  { name: "clear-icon", use: [
    "input"
    /* Input */
  ] },
  { name: "dp-input", use: [
    "input"
    /* Input */
  ] },
  { name: "clock-icon", use: [
    "time-picker",
    "time-input",
    "pass-trough"
    /* PassTrough */
  ] },
  { name: "arrow-left", use: [
    "date-picker-header",
    "pass-trough",
    "year-mode"
    /* YearMode */
  ] },
  { name: "arrow-right", use: [
    "date-picker-header",
    "pass-trough",
    "year-mode"
    /* YearMode */
  ] },
  {
    name: "arrow-up",
    use: [
      "time-picker",
      "time-input",
      "date-picker-header",
      "pass-trough"
      /* PassTrough */
    ]
  },
  {
    name: "arrow-down",
    use: [
      "time-picker",
      "time-input",
      "date-picker-header",
      "pass-trough"
      /* PassTrough */
    ]
  },
  {
    name: "calendar-icon",
    use: [
      "date-picker-header",
      "time-picker",
      "pass-trough",
      "year-mode"
      /* YearMode */
    ]
  },
  { name: "day", use: [
    "calendar",
    "pass-trough"
    /* PassTrough */
  ] },
  {
    name: "month-overlay-value",
    use: [
      "date-picker-header",
      "pass-trough",
      "month-picker"
      /* MonthPicker */
    ]
  },
  {
    name: "year-overlay-value",
    use: [
      "date-picker-header",
      "pass-trough",
      "year-mode",
      "year-picker"
      /* YearPicker */
    ]
  },
  { name: "year-overlay", use: [
    "date-picker-header",
    "pass-trough"
    /* PassTrough */
  ] },
  { name: "month-overlay", use: [
    "date-picker-header",
    "pass-trough"
    /* PassTrough */
  ] },
  { name: "month-overlay-header", use: [
    "date-picker-header",
    "pass-trough"
    /* PassTrough */
  ] },
  { name: "year-overlay-header", use: [
    "date-picker-header",
    "pass-trough"
    /* PassTrough */
  ] },
  {
    name: "hours-overlay-value",
    use: wt
  },
  {
    name: "hours-overlay-header",
    use: wt
  },
  {
    name: "minutes-overlay-value",
    use: wt
  },
  {
    name: "minutes-overlay-header",
    use: wt
  },
  {
    name: "seconds-overlay-value",
    use: wt
  },
  {
    name: "seconds-overlay-header",
    use: wt
  },
  { name: "hours", use: [
    "time-input",
    "time-picker",
    "pass-trough"
    /* PassTrough */
  ] },
  { name: "minutes", use: [
    "time-input",
    "time-picker",
    "pass-trough"
    /* PassTrough */
  ] },
  { name: "seconds", use: [
    "time-input",
    "time-picker",
    "pass-trough"
    /* PassTrough */
  ] },
  { name: "month", use: [
    "date-picker-header",
    "time-picker",
    "pass-trough"
    /* PassTrough */
  ] },
  { name: "year", use: [
    "date-picker-header",
    "time-picker",
    "pass-trough",
    "year-mode"
    /* YearMode */
  ] },
  { name: "action-buttons", use: [
    "action-row"
    /* ActionRow */
  ] },
  { name: "action-preview", use: [
    "action-row"
    /* ActionRow */
  ] },
  { name: "calendar-header", use: [
    "calendar",
    "pass-trough"
    /* PassTrough */
  ] },
  { name: "marker-tooltip", use: [
    "calendar",
    "pass-trough"
    /* PassTrough */
  ] },
  { name: "action-extra", use: [
    "menu"
    /* Menu */
  ] },
  { name: "time-picker-overlay", use: [
    "time-picker",
    "time-picker",
    "pass-trough"
    /* PassTrough */
  ] },
  { name: "am-pm-button", use: [
    "time-picker",
    "time-input",
    "pass-trough"
    /* PassTrough */
  ] },
  { name: "left-sidebar", use: [
    "menu"
    /* Menu */
  ] },
  { name: "right-sidebar", use: [
    "menu"
    /* Menu */
  ] },
  {
    name: "month-year",
    use: [
      "date-picker-header",
      "pass-trough",
      "month-picker",
      "year-picker"
      /* YearPicker */
    ]
  },
  { name: "time-picker", use: [
    "date-picker",
    "pass-trough"
    /* PassTrough */
  ] },
  { name: "action-row", use: [
    "action-row"
    /* ActionRow */
  ] },
  { name: "marker", use: [
    "calendar",
    "pass-trough"
    /* PassTrough */
  ] },
  { name: "quarter", use: [
    "quarter-picker",
    "pass-trough"
    /* PassTrough */
  ] },
  {
    name: "top-extra",
    use: [
      "date-picker-header",
      "pass-trough",
      "month-picker",
      "quarter-picker",
      "year-picker"
      /* YearPicker */
    ]
  },
  {
    name: "tp-inline-arrow-up",
    use: [
      "date-picker",
      "time-input",
      "time-picker",
      "pass-trough"
      /* PassTrough */
    ]
  },
  {
    name: "tp-inline-arrow-down",
    use: [
      "date-picker",
      "time-input",
      "time-picker",
      "pass-trough"
      /* PassTrough */
    ]
  },
  { name: "arrow", use: [
    "menu"
    /* Menu */
  ] },
  { name: "menu-header", use: [
    "menu"
    /* Menu */
  ] }
], lt = (e, A) => Va.filter((f) => e[f.name] && f.use.includes(A)).map((f) => f.name), Fa = (e, A) => Va.map((f) => f.name).concat(A?.filter((f) => f.slot).map((f) => f.slot) ?? []).filter((f) => !!e[f]), Rr = {
  key: 1,
  class: "dp__input_wrap"
}, Cr = ["id", "name", "inputmode", "placeholder", "disabled", "readonly", "required", "value", "autocomplete", "aria-label", "aria-disabled", "aria-invalid"], xr = {
  key: 1,
  class: "dp--clear-btn"
}, Or = ["aria-label"], Yr = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DatepickerInput",
  props: {
    isMenuOpen: { type: Boolean, default: false }
  },
  emits: ["clear", "open", "set-input-date", "close", "select-date", "set-empty-date", "toggle", "focus", "blur", "real-blur"],
  setup(e, { expose: A, emit: f }) {
    const o = f, c = e, {
      rootEmit: s,
      inputValue: r,
      rootProps: u,
      defaults: { textInput: v, ariaLabels: Y, inline: P, config: B, range: O, multiDates: l, ui: w, inputAttrs: h }
    } = Me(), { checkMinMaxRange: _, isValidDate: b } = Ue(), { parseFreeInput: E, textPasted: k, createMaskedValue: g, applyMaxValues: M } = Sr(), { checkKeyDown: R, checkStopPropagation: $ } = Ie(), { boolHtmlAttribute: S } = Pt(), p = vueExports.useTemplateRef("dp-input"), D = vueExports.ref(null), V = vueExports.ref(false), F = vueExports.computed(
      () => ({
        dp__pointer: !u.disabled && !u.readonly && !v.value.enabled,
        dp__disabled: u.disabled,
        dp__input_readonly: !v.value.enabled,
        dp__input: true,
        dp__input_not_clearable: !h.value.clearable,
        dp__input_icon_pad: !h.value.hideInputIcon,
        dp__input_valid: typeof h.value.state == "boolean" ? h.value.state : false,
        dp__input_invalid: typeof h.value.state == "boolean" ? !h.value.state : false,
        dp__input_focus: V.value || c.isMenuOpen,
        dp__input_reg: !v.value.enabled,
        ...w.value.input
      })
    ), L = () => {
      o("set-input-date", null), h && u.autoApply && (o("set-empty-date"), D.value = null);
    }, ne = (Q) => {
      if (v.value.separators?.length) {
        const I = new RegExp(
          v.value.separators.map((y) => y.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")
        );
        return Q.split(I);
      }
      return Q.split(v.value.rangeSeparator);
    }, re2 = (Q) => {
      const [I, y] = ne(Q);
      if (I) {
        const H = E(I.trim(), r.value), fe = y ? E(y.trim(), r.value) : void 0;
        if (isAfter(H, fe)) return;
        const Pe = H && fe ? [H, fe] : [H];
        _(fe, Pe, 0) && (D.value = H ? Pe : null);
      }
    }, X = () => {
      k.value = true;
    }, x = (Q) => {
      if (O.value.enabled)
        re2(Q);
      else if (l.value.enabled) {
        const I = Q.split(";");
        D.value = I.map((y) => E(y.trim())).filter((y) => !!y);
      } else
        D.value = E(Q, r.value);
    }, te = (Q) => {
      const I = typeof Q == "string" ? Q : Q.target?.value, y = v?.value?.maskFormat;
      let H = I;
      if (typeof y == "string") {
        const fe = /(YYYY|MM|DD|hh|mm|ss)/g, Ce = [...y.matchAll(fe)].map((a) => a[0]), i = I.replace(/\D/g, ""), d = M(i, Ce);
        H = g(d, y);
      }
      H === "" ? L() : (v.value.openMenu && !c.isMenuOpen && o("open"), x(H), o("set-input-date", D.value)), k.value = false, r.value = H, s("text-input", Q, D.value);
    }, q = (Q) => {
      v.value.enabled ? (x(Q.target.value), v.value.enterSubmit && b(D.value) && r.value !== "" ? (o("set-input-date", D.value, true), D.value = null) : v.value.enterSubmit && r.value === "" && (D.value = null, o("clear"))) : Z(Q);
    }, oe = (Q, I) => {
      v.value.enabled && v.value.tabSubmit && !I && x(Q.target.value), v.value.tabSubmit && b(D.value) && r.value !== "" ? (o("set-input-date", D.value, true, true), D.value = null) : v.value.tabSubmit && r.value === "" && (D.value = null, o("clear"));
    }, K = () => {
      V.value = true, o("focus"), vueExports.nextTick().then(() => {
        v.value.enabled && v.value.selectOnFocus && p.value?.select();
      });
    }, Z = (Q) => {
      if ($(Q, B.value, true), v.value.enabled && v.value.openMenu && !P.value.input) {
        if (v.value.openMenu === "open" && !c.isMenuOpen) return o("open");
        if (v.value.openMenu === "toggle") return o("toggle");
      } else v.value.enabled || o("toggle");
    }, de = () => {
      o("real-blur"), V.value = false, (!c.isMenuOpen || P.value.enabled && P.value.input) && o("blur"), (u.autoApply && v.value.enabled && D.value && !c.isMenuOpen || v.value.applyOnBlur) && (o("set-input-date", D.value), o("select-date"), D.value = null);
    }, G = (Q) => {
      $(Q, B.value, true), o("clear");
    }, ce = () => {
      o("close");
    }, le = (Q) => {
      if (Q.key === "Tab" && oe(Q), Q.key === "Enter" && q(Q), Q.key === "Escape" && v.value.escClose && ce(), !v.value.enabled) {
        if (Q.code === "Tab") return;
        Q.preventDefault();
      }
    }, we = () => {
      p.value?.focus({ preventScroll: true });
    }, ve = (Q) => {
      D.value = Q;
    }, Ae = (Q) => {
      Q.key === $e.tab && oe(Q, true);
    };
    return A({
      focusInput: we,
      setParsedDate: ve
    }), (Q, I) => (vueExports.openBlock(), vueExports.createElementBlock("div", { onClick: Z }, [
      !Q.$slots["dp-input"] && !vueExports.unref(P).enabled ? vueExports.renderSlot(Q.$slots, "trigger", { key: 0 }) : vueExports.createCommentVNode("", true),
      !Q.$slots.trigger && (!vueExports.unref(P).enabled || vueExports.unref(P).input) ? (vueExports.openBlock(), vueExports.createElementBlock("div", Rr, [
        !Q.$slots.trigger && (!vueExports.unref(P).enabled || vueExports.unref(P).enabled && vueExports.unref(P).input) ? vueExports.renderSlot(Q.$slots, "dp-input", {
          key: 0,
          value: vueExports.unref(r),
          isMenuOpen: e.isMenuOpen,
          onInput: te,
          onEnter: q,
          onTab: oe,
          onClear: G,
          onBlur: de,
          onKeypress: le,
          onPaste: X,
          onFocus: K,
          openMenu: () => Q.$emit("open"),
          closeMenu: () => Q.$emit("close"),
          toggleMenu: () => Q.$emit("toggle")
        }, () => [
          vueExports.createElementVNode("input", {
            id: vueExports.unref(h).id,
            ref: "dp-input",
            "data-test-id": "dp-input",
            name: vueExports.unref(h).name,
            class: vueExports.normalizeClass(F.value),
            inputmode: vueExports.unref(h).inputmode,
            placeholder: vueExports.unref(u).placeholder,
            disabled: vueExports.unref(S)(vueExports.unref(u).disabled),
            readonly: vueExports.unref(S)(vueExports.unref(u).readonly),
            required: vueExports.unref(S)(vueExports.unref(h).required),
            value: vueExports.unref(r),
            autocomplete: vueExports.unref(h).autocomplete,
            "aria-label": vueExports.unref(Y).input,
            "aria-disabled": vueExports.unref(u).disabled || void 0,
            "aria-invalid": vueExports.unref(h).state === false ? true : void 0,
            onInput: te,
            onBlur: de,
            onFocus: K,
            onKeypress: le,
            onKeydown: I[0] || (I[0] = (y) => le(y)),
            onPaste: X,
            onInvalid: I[1] || (I[1] = (y) => vueExports.unref(s)("invalid", y))
          }, null, 42, Cr)
        ]) : vueExports.createCommentVNode("", true),
        vueExports.createElementVNode("div", {
          onClick: I[4] || (I[4] = (y) => o("toggle"))
        }, [
          Q.$slots["input-icon"] && !vueExports.unref(h).hideInputIcon ? (vueExports.openBlock(), vueExports.createElementBlock("span", {
            key: 0,
            class: "dp__input_icon",
            onClick: I[2] || (I[2] = (y) => o("toggle"))
          }, [
            vueExports.renderSlot(Q.$slots, "input-icon")
          ])) : vueExports.createCommentVNode("", true),
          !Q.$slots["input-icon"] && !vueExports.unref(h).hideInputIcon && !Q.$slots["dp-input"] ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Et), {
            key: 1,
            "aria-label": vueExports.unref(Y)?.calendarIcon,
            class: "dp__input_icon dp__input_icons",
            onClick: I[3] || (I[3] = (y) => o("toggle"))
          }, null, 8, ["aria-label"])) : vueExports.createCommentVNode("", true)
        ]),
        Q.$slots["clear-icon"] && (vueExports.unref(h).alwaysClearable || vueExports.unref(r) && vueExports.unref(h).clearable && !vueExports.unref(u).disabled && !vueExports.unref(u).readonly) ? (vueExports.openBlock(), vueExports.createElementBlock("span", xr, [
          vueExports.renderSlot(Q.$slots, "clear-icon", { clear: G })
        ])) : vueExports.createCommentVNode("", true),
        !Q.$slots["clear-icon"] && (vueExports.unref(h).alwaysClearable || vueExports.unref(h).clearable && vueExports.unref(r) && !vueExports.unref(u).disabled && !vueExports.unref(u).readonly) ? (vueExports.openBlock(), vueExports.createElementBlock("button", {
          key: 2,
          "aria-label": vueExports.unref(Y)?.clearInput,
          class: "dp--clear-btn",
          type: "button",
          "data-test-id": "clear-input-value-btn",
          onKeydown: I[5] || (I[5] = (y) => vueExports.unref(R)(y, () => G(y), true, Ae)),
          onClick: I[6] || (I[6] = vueExports.withModifiers((y) => G(y), ["prevent"]))
        }, [
          vueExports.createVNode(vueExports.unref(On), { class: "dp__input_icons" })
        ], 40, Or)) : vueExports.createCommentVNode("", true)
      ])) : vueExports.createCommentVNode("", true)
    ]));
  }
}), Br = {
  ref: "action-row",
  class: "dp__action_row"
}, Ir = ["title"], Er = {
  ref: "action-buttons-container",
  class: "dp__action_buttons",
  "data-dp-element": "action-row"
}, Vr = ["disabled"], Fr = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ActionRow",
  props: {
    menuMount: { type: Boolean, default: false },
    calendarWidth: { default: 0 }
  },
  emits: ["close-picker", "select-date", "select-now"],
  setup(e, { emit: A }) {
    const f = A, o = e, {
      rootEmit: c,
      rootProps: s,
      modelValue: r,
      defaults: { actionRow: u, multiCalendars: v, inline: Y, range: P, multiDates: B, formats: O }
    } = Me(), { isTimeValid: l, isMonthValid: w } = Ue(), { formatPreview: h } = pt(), { checkKeyDown: _, convertType: b } = Ie(), { boolHtmlAttribute: E } = Pt();
    vueExports.useTemplateRef("action-buttons-container");
    vueExports.useTemplateRef("action-row");
    const M = vueExports.ref(false), R = vueExports.ref({});
    const S = vueExports.computed(() => P.value.enabled && !P.value.partialRange && r.value ? r.value.length === 2 : true), p = vueExports.computed(
      () => !l.value(r.value) || !w.value(r.value) || !S.value
    ), D = () => {
      const X = O.value.preview;
      return s.timePicker || s.monthPicker, X(b(r.value));
    }, V = () => {
      const X = r.value;
      return v.value.count > 0 ? `${h(X[0])} - ${h(X[1])}` : [h(X[0]), h(X[1])];
    }, F = vueExports.computed(() => !r.value || !o.menuMount ? "" : typeof O.value.preview == "string" ? Array.isArray(r.value) ? r.value.length === 2 && r.value[1] ? V() : B.value.enabled ? r.value.map((X) => `${h(X)}`) : s.modelAuto ? `${h(r.value[0])}` : `${h(r.value[0])} -` : h(r.value) : D()), L = () => B.value.enabled ? "; " : " - ", ne = vueExports.computed(
      () => Array.isArray(F.value) ? F.value.join(L()) : F.value
    ), re2 = () => {
      l.value(r.value) && w.value(r.value) && S.value ? f("select-date") : c("invalid-select");
    };
    return (X, x) => (vueExports.openBlock(), vueExports.createElementBlock("div", Br, [
      X.$slots["action-row"] ? vueExports.renderSlot(X.$slots, "action-row", vueExports.normalizeProps(vueExports.mergeProps({ key: 0 }, {
        modelValue: vueExports.unref(r),
        disabled: p.value,
        selectDate: () => X.$emit("select-date"),
        closePicker: () => X.$emit("close-picker")
      }))) : (vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, { key: 1 }, [
        vueExports.unref(u).showPreview ? (vueExports.openBlock(), vueExports.createElementBlock("div", {
          key: 0,
          class: "dp__selection_preview",
          title: ne.value || void 0,
          style: vueExports.normalizeStyle(R.value)
        }, [
          X.$slots["action-preview"] && M.value ? vueExports.renderSlot(X.$slots, "action-preview", {
            key: 0,
            value: vueExports.unref(r),
            formatValue: ne.value
          }) : vueExports.createCommentVNode("", true),
          !X.$slots["action-preview"] && M.value ? (vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, { key: 1 }, [
            vueExports.createTextVNode(vueExports.toDisplayString(ne.value), 1)
          ], 64)) : vueExports.createCommentVNode("", true)
        ], 12, Ir)) : vueExports.createCommentVNode("", true),
        vueExports.createElementVNode("div", Er, [
          X.$slots["action-buttons"] ? vueExports.renderSlot(X.$slots, "action-buttons", {
            key: 0,
            value: vueExports.unref(r),
            selectDate: re2,
            selectionDisabled: p.value
          }) : vueExports.createCommentVNode("", true),
          X.$slots["action-buttons"] ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, { key: 1 }, [
            !vueExports.unref(Y).enabled && vueExports.unref(u).showCancel ? (vueExports.openBlock(), vueExports.createElementBlock("button", {
              key: 0,
              ref: "cancel-btn",
              type: "button",
              "data-dp-action-element": "0",
              class: "dp__action_button dp__action_cancel",
              onClick: x[0] || (x[0] = (te) => X.$emit("close-picker")),
              onKeydown: x[1] || (x[1] = (te) => vueExports.unref(_)(te, () => X.$emit("close-picker")))
            }, vueExports.toDisplayString(vueExports.unref(u).cancelBtnLabel), 545)) : vueExports.createCommentVNode("", true),
            vueExports.unref(u).showNow ? (vueExports.openBlock(), vueExports.createElementBlock("button", {
              key: 1,
              type: "button",
              "data-dp-action-element": "0",
              class: "dp__action_button dp__action_cancel",
              onClick: x[2] || (x[2] = (te) => X.$emit("select-now")),
              onKeydown: x[3] || (x[3] = (te) => vueExports.unref(_)(te, () => X.$emit("select-now")))
            }, vueExports.toDisplayString(vueExports.unref(u).nowBtnLabel), 33)) : vueExports.createCommentVNode("", true),
            vueExports.unref(u).showSelect ? (vueExports.openBlock(), vueExports.createElementBlock("button", {
              key: 2,
              ref: "select-btn",
              type: "button",
              "data-dp-action-element": "0",
              class: "dp__action_button dp__action_select",
              disabled: vueExports.unref(E)(p.value),
              "data-test-id": "select-button",
              onKeydown: x[4] || (x[4] = (te) => vueExports.unref(_)(te, () => re2())),
              onClick: re2
            }, vueExports.toDisplayString(vueExports.unref(u).selectBtnLabel), 41, Vr)) : vueExports.createCommentVNode("", true)
          ], 64))
        ], 512)
      ], 64))
    ], 512));
  }
}), ta = () => {
  const {
    rootProps: e,
    defaults: { multiCalendars: A }
  } = Me(), f = vueExports.computed(() => (s) => e.hideNavigation?.includes(s)), o = vueExports.computed(() => (s) => A.value.count ? A.value.solo ? true : s === 0 : true), c = vueExports.computed(() => (s) => A.value.count ? A.value.solo ? true : s === A.value.count - 1 : true);
  return { hideNavigationButtons: f, showLeftIcon: o, showRightIcon: c };
}, Nr = ["role", "aria-label", "tabindex"], Wr = { class: "dp__selection_grid_header" }, Lr = ["aria-selected", "aria-disabled", "data-dp-action-element", "data-dp-element-active", "data-test-id", "onClick", "onKeydown", "onMouseover"], Hr = ["aria-label", "data-dp-action-element"], Nt = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SelectionOverlay",
  props: {
    items: {},
    type: {},
    useRelative: { type: Boolean },
    height: {},
    overlayLabel: {},
    isLast: { type: Boolean },
    level: {}
  },
  emits: ["selected", "toggle", "reset-flow", "hover-value"],
  setup(e, { emit: A }) {
    const f = A, o = e, {
      setState: c,
      defaults: { ariaLabels: s, config: r }
    } = Me(), { hideNavigationButtons: u } = ta(), { handleEventPropagation: v, checkKeyDown: Y } = Ie(), P = vueExports.useTemplateRef("toggle-button"), B = vueExports.useTemplateRef("overlay-container"), O = vueExports.useTemplateRef("grid-wrap"), l = vueExports.ref(false);
    vueExports.ref(null);
    const h = vueExports.ref(), _ = vueExports.ref(0);
    const b = vueExports.computed(
      () => ({
        dp__overlay: true,
        "dp--overlay-absolute": !o.useRelative,
        "dp--overlay-relative": o.useRelative
      })
    ), E = vueExports.computed(
      () => o.useRelative ? { height: `${o.height}px`, width: "var(--dp-menu-min-width)" } : void 0
    ), k = vueExports.computed(() => ({
      dp__overlay_col: true
    })), g = vueExports.computed(
      () => ({
        dp__btn: true,
        dp__button: true,
        dp__overlay_action: true,
        dp__over_action_scroll: l.value,
        dp__button_bottom: o.isLast
      })
    ), M = vueExports.computed(() => ({
      dp__overlay_container: true,
      dp__container_flex: o.items?.length <= 6,
      dp__container_block: o.items?.length > 6
    }));
    vueExports.watch(
      () => o.items,
      () => R(false),
      { deep: true }
    );
    const R = (L = true) => {
      vueExports.nextTick().then(() => {
        const ne = (void 0).querySelector(`[data-dp-element-active="${o.level ?? 1}"]`), re2 = unrefElement(O), X = unrefElement(P), x = unrefElement(B), te = X ? X.getBoundingClientRect().height : 0;
        re2 && (re2.getBoundingClientRect().height ? _.value = re2.getBoundingClientRect().height - te : _.value = r.value.modeHeight - te), ne && x && L && (x.scrollTop = ne.offsetTop - x.offsetTop - (_.value / 2 - ne.getBoundingClientRect().height) - te);
      });
    }, $ = (L) => {
      L.disabled || f("selected", L.value);
    }, S = () => {
      f("toggle"), f("reset-flow");
    }, p = (L) => {
      r.value.escClose && (S(), v(L, r.value));
    }, D = (L) => {
      h.value = L, f("hover-value", L);
    }, V = (L) => {
      if (L.key === $e.esc) return p(L);
    }, F = (L) => {
      if (L.key === $e.enter) return S();
    };
    return (L, ne) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
      ref: "grid-wrap",
      class: vueExports.normalizeClass(b.value),
      style: vueExports.normalizeStyle(E.value),
      role: e.useRelative ? void 0 : "dialog",
      "aria-label": e.overlayLabel,
      tabindex: e.useRelative ? void 0 : "0",
      onKeydown: V,
      onClick: ne[0] || (ne[0] = vueExports.withModifiers(() => {
      }, ["prevent"]))
    }, [
      vueExports.createElementVNode("div", {
        ref: "overlay-container",
        class: vueExports.normalizeClass(M.value),
        style: vueExports.normalizeStyle({ "--dp-overlay-height": `${_.value}px` }),
        role: "grid"
      }, [
        vueExports.createElementVNode("div", Wr, [
          vueExports.renderSlot(L.$slots, "header")
        ]),
        vueExports.renderSlot(L.$slots, "overlay", {}, () => [
          (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList(e.items, (re2, X) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
            key: X,
            class: vueExports.normalizeClass(["dp__overlay_row", { dp__flex_row: e.items.length >= 3 }]),
            role: "row"
          }, [
            (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList(re2, (x) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
              key: x.value,
              role: "gridcell",
              class: vueExports.normalizeClass(k.value),
              "aria-selected": x.active || void 0,
              "aria-disabled": x.disabled || void 0,
              "data-dp-action-element": e.level ?? 1,
              "data-dp-element-active": x.active ? e.level ?? 1 : void 0,
              tabindex: "0",
              "data-test-id": x.text,
              onClick: vueExports.withModifiers((te) => $(x), ["prevent"]),
              onKeydown: (te) => vueExports.unref(Y)(te, () => $(x), true),
              onMouseover: (te) => D(x.value)
            }, [
              vueExports.createElementVNode("div", {
                class: vueExports.normalizeClass(x.className)
              }, [
                vueExports.renderSlot(L.$slots, "item", { item: x }, () => [
                  vueExports.createTextVNode(vueExports.toDisplayString(x.text), 1)
                ])
              ], 2)
            ], 42, Lr))), 128))
          ], 2))), 128))
        ])
      ], 6),
      L.$slots["button-icon"] ? vueExports.withDirectives((vueExports.openBlock(), vueExports.createElementBlock("button", {
        key: 0,
        ref: "toggle-button",
        type: "button",
        "aria-label": vueExports.unref(s)?.toggleOverlay,
        class: vueExports.normalizeClass(g.value),
        tabindex: "0",
        "data-dp-action-element": e.level ?? 1,
        onClick: S,
        onKeydown: F
      }, [
        vueExports.renderSlot(L.$slots, "button-icon")
      ], 42, Hr)), [
        [vueExports.vShow, !vueExports.unref(u)(e.type)]
      ]) : vueExports.createCommentVNode("", true)
    ], 46, Nr));
  }
}), jr = ["data-dp-mobile"], aa = /* @__PURE__ */ vueExports.defineComponent({
  __name: "InstanceWrap",
  props: {
    stretch: { type: Boolean },
    collapse: { type: Boolean }
  },
  setup(e) {
    const {
      defaults: { multiCalendars: A }
    } = Me(), { isMobile: f } = Zt(), o = vueExports.computed(
      () => A.value.count > 0 ? [...new Array(A.value.count).keys()] : [0]
    );
    return (c, s) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
      class: vueExports.normalizeClass({
        dp__menu_inner: !e.stretch,
        "dp--menu--inner-stretched": e.stretch,
        dp__flex_display: vueExports.unref(A).count > 0,
        "dp--flex-display-collapsed": e.collapse
      }),
      "data-dp-mobile": vueExports.unref(f)
    }, [
      vueExports.renderSlot(c.$slots, "default", {
        instances: o.value,
        wrapClass: { dp__instance_calendar: vueExports.unref(A).count > 0 }
      })
    ], 10, jr));
  }
}), Kr = ["data-dp-element", "aria-label", "aria-disabled"], Bt = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ArrowBtn",
  props: {
    ariaLabel: {},
    elName: {},
    disabled: { type: Boolean }
  },
  emits: ["activate", "set-ref"],
  setup(e, { emit: A }) {
    const { checkKeyDown: f } = Ie(), o = A;
    return (c, s) => (vueExports.openBlock(), vueExports.createElementBlock("button", {
      ref: "arrow-btn",
      type: "button",
      "data-dp-element": e.elName,
      "data-dp-action-element": "0",
      class: "dp__btn dp--arrow-btn-nav",
      tabindex: "0",
      "aria-label": e.ariaLabel,
      "aria-disabled": e.disabled || void 0,
      onClick: s[0] || (s[0] = (r) => o("activate")),
      onKeydown: s[1] || (s[1] = (r) => vueExports.unref(f)(r, () => o("activate"), true))
    }, [
      vueExports.createElementVNode("span", {
        class: vueExports.normalizeClass(["dp__inner_nav", { dp__inner_nav_disabled: e.disabled }])
      }, [
        vueExports.renderSlot(c.$slots, "default")
      ], 2)
    ], 40, Kr));
  }
}), zr = ["aria-label", "data-test-id"], Na = /* @__PURE__ */ vueExports.defineComponent({
  __name: "YearModePicker",
  props: {
    items: {},
    instance: {},
    year: {},
    showYearPicker: { type: Boolean, default: false },
    isDisabled: {}
  },
  emits: ["handle-year", "year-select", "toggle-year-picker"],
  setup(e, { emit: A }) {
    const f = A, o = e, { showRightIcon: c, showLeftIcon: s } = ta(), {
      rootProps: r,
      defaults: { config: u, ariaLabels: v, ui: Y }
    } = Me(), { showTransition: P, transitionName: B } = Vt(), { formatYear: O } = pt(), { boolHtmlAttribute: l } = Pt(), w = vueExports.ref(false), h = vueExports.computed(() => O(o.year)), _ = (k = false, g) => {
      w.value = !w.value, f("toggle-year-picker", { flow: k, show: g });
    }, b = (k) => {
      w.value = false, f("year-select", k);
    }, E = (k = false) => {
      f("handle-year", k);
    };
    return (k, g) => (vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, null, [
      vueExports.createElementVNode("div", {
        class: vueExports.normalizeClass(["dp--year-mode-picker", { "dp--hidden-el": w.value }])
      }, [
        vueExports.unref(s)(e.instance) ? (vueExports.openBlock(), vueExports.createBlock(Bt, {
          key: 0,
          ref: "mpPrevIconRef",
          "aria-label": vueExports.unref(v)?.prevYear,
          disabled: vueExports.unref(l)(e.isDisabled(false)),
          class: vueExports.normalizeClass(vueExports.unref(Y)?.navBtnPrev),
          onActivate: g[0] || (g[0] = (M) => E(false))
        }, {
          default: vueExports.withCtx(() => [
            k.$slots["arrow-left"] ? vueExports.renderSlot(k.$slots, "arrow-left", { key: 0 }) : vueExports.createCommentVNode("", true),
            k.$slots["arrow-left"] ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Ca), { key: 1 }))
          ]),
          _: 3
        }, 8, ["aria-label", "disabled", "class"])) : vueExports.createCommentVNode("", true),
        vueExports.createElementVNode("button", {
          ref: "mpYearButtonRef",
          class: "dp__btn dp--year-select",
          type: "button",
          "aria-label": `${e.year}-${vueExports.unref(v)?.openYearsOverlay}`,
          "data-test-id": `year-mode-btn-${e.instance}`,
          "data-dp-action-element": "0",
          onClick: g[1] || (g[1] = () => _(false)),
          onKeydown: g[2] || (g[2] = vueExports.withKeys(vueExports.withModifiers(() => _(false), ["prevent"]), ["enter"]))
        }, [
          k.$slots.year ? vueExports.renderSlot(k.$slots, "year", {
            key: 0,
            text: h.value,
            value: e.year
          }) : vueExports.createCommentVNode("", true),
          k.$slots.year ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, { key: 1 }, [
            vueExports.createTextVNode(vueExports.toDisplayString(e.year), 1)
          ], 64))
        ], 40, zr),
        vueExports.unref(c)(e.instance) ? (vueExports.openBlock(), vueExports.createBlock(Bt, {
          key: 1,
          ref: "mpNextIconRef",
          "aria-label": vueExports.unref(v)?.nextYear,
          disabled: vueExports.unref(l)(e.isDisabled(true)),
          class: vueExports.normalizeClass(vueExports.unref(Y)?.navBtnNext),
          onActivate: g[3] || (g[3] = (M) => E(true))
        }, {
          default: vueExports.withCtx(() => [
            k.$slots["arrow-right"] ? vueExports.renderSlot(k.$slots, "arrow-right", { key: 0 }) : vueExports.createCommentVNode("", true),
            k.$slots["arrow-right"] ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(xa), { key: 1 }))
          ]),
          _: 3
        }, 8, ["aria-label", "disabled", "class"])) : vueExports.createCommentVNode("", true)
      ], 2),
      vueExports.createVNode(vueExports.Transition, {
        name: vueExports.unref(B)(e.showYearPicker),
        css: vueExports.unref(P)
      }, {
        default: vueExports.withCtx(() => [
          e.showYearPicker ? (vueExports.openBlock(), vueExports.createBlock(Nt, {
            key: 0,
            items: e.items,
            config: vueExports.unref(u),
            "is-last": vueExports.unref(r).autoApply && !vueExports.unref(u).keepActionRow,
            "overlay-label": vueExports.unref(v)?.yearPicker?.(true),
            type: "year",
            onToggle: _,
            onSelected: g[4] || (g[4] = (M) => b(M))
          }, vueExports.createSlots({
            "button-icon": vueExports.withCtx(() => [
              k.$slots["calendar-icon"] ? vueExports.renderSlot(k.$slots, "calendar-icon", { key: 0 }) : vueExports.createCommentVNode("", true),
              k.$slots["calendar-icon"] ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Et), { key: 1 }))
            ]),
            _: 2
          }, [
            k.$slots["year-overlay-value"] ? {
              name: "item",
              fn: vueExports.withCtx(({ item: M }) => [
                vueExports.renderSlot(k.$slots, "year-overlay-value", {
                  text: M.text,
                  value: M.value
                })
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["items", "config", "is-last", "overlay-label"])) : vueExports.createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["name", "css"])
    ], 64));
  }
}), Wa = (e) => {
  const {
    getDate: A,
    rootEmit: f,
    state: o,
    month: c,
    year: s,
    modelValue: r,
    calendars: u,
    rootProps: v,
    defaults: { multiCalendars: Y, range: P, safeDates: B, filters: O, highlight: l }
  } = Me(), { resetDate: w, getYearFromDate: h, checkHighlightYear: _, groupListAndMap: b } = We(), { getYears: E } = ea(), { validateMonthYear: k, checkMinMaxValue: g } = Ue(), M = vueExports.ref([false]), R = vueExports.computed(() => E()), $ = vueExports.computed(() => (K, Z) => {
    const de = set(w(A()), {
      month: c.value(K),
      year: s.value(K)
    }), G = Z ? endOfYear(de) : startOfYear(de);
    return k(G, v.preventMinMaxNavigation, Z);
  }), S = () => Array.isArray(r.value) && Y.value.solo && r.value[1], p = () => {
    for (let K = 0; K < Y.value.count; K++)
      if (K === 0)
        u.value[K] = u.value[0];
      else if (K === Y.value.count - 1 && S())
        u.value[K] = {
          month: getMonth(r.value[1]),
          year: getYear(r.value[1])
        };
      else {
        const Z = set(A(), u.value[K - 1]);
        u.value[K] = { month: getMonth(Z), year: getYear(addYears(Z, 1)) };
      }
  }, D = (K) => {
    if (!K) return p();
    const Z = set(A(), u.value[K]);
    return u.value[0].year = getYear(subYears(Z, Y.value.count - 1)), p();
  }, V = (K, Z) => {
    const de = differenceInYears(Z, K);
    return P.value.showLastInRange && de > 1 ? Z : K;
  }, F = (K) => v.focusStartDate || Y.value.solo ? K[0] : K[1] ? V(K[0], K[1]) : K[0], L = () => {
    if (r.value) {
      const K = Array.isArray(r.value) ? F(r.value) : r.value;
      u.value[0] = { month: getMonth(K), year: getYear(K) };
    }
  }, ne = () => {
    L(), Y.value.count && p();
  };
  vueExports.watch(r, (K, Z) => {
    o.isTextInputDate && JSON.stringify(K ?? {}) !== JSON.stringify(Z ?? {}) && ne();
  });
  const re2 = (K, Z) => {
    u.value[Z].year = K, f("update-month-year", { instance: Z, year: K, month: u.value[Z].month }), Y.value.count && !Y.value.solo && D(Z);
  }, X = vueExports.computed(() => (K) => b(R.value, (Z) => {
    const de = s.value(K) === Z.value, G = g(
      Z.value,
      h(B.value.minDate),
      h(B.value.maxDate)
    ) || O.value.years?.includes(s.value(K)), ce = _(l.value, Z.value);
    return { active: de, disabled: G, highlighted: ce };
  })), x = (K, Z) => {
    re2(K, Z), q(Z);
  }, te = (K, Z = false) => {
    if (!$.value(K, Z)) {
      const de = Z ? s.value(K) + 1 : s.value(K) - 1;
      re2(de, K);
    }
  }, q = (K, Z = false, de) => {
    Z || e("reset-flow"), de === void 0 ? M.value[K] = !M.value[K] : M.value[K] = de, M.value[K] ? f("overlay-toggle", { open: true, overlay: He.year }) : f("overlay-toggle", { open: false, overlay: He.year });
  };
  return {
    isDisabled: $,
    groupedYears: X,
    showYearPicker: M,
    selectYear: re2,
    setStartDate: () => {
      v.startDate && (r.value && v.focusStartDate || !r.value) && re2(getYear(A(v.startDate)), 0);
    },
    toggleYearPicker: q,
    handleYearSelect: x,
    handleYear: te
  };
}, na = () => {
  const { isDateAfter: e, isDateBefore: A, isDateEqual: f } = We(), {
    getDate: o,
    rootEmit: c,
    rootProps: s,
    modelValue: r,
    defaults: { range: u }
  } = Me();
  return {
    getRangeWithFixedDate: (l) => Array.isArray(r.value) && (r.value.length === 2 || r.value.length === 1 && u.value.partialRange) ? u.value.fixedStart && (e(l, r.value[0]) || f(l, r.value[0])) ? [r.value[0], l] : u.value.fixedEnd && (A(l, r.value[1]) || f(l, r.value[1])) ? [l, r.value[1]] : (c("invalid-fixed-range", l), r.value) : [],
    setPresetDate: (l) => {
      Array.isArray(l.value) && l.value.length <= 2 && u.value.enabled ? r.value = l.value.map((w) => o(w)) : Array.isArray(l.value) || (r.value = o(l.value));
    },
    checkRangeAutoApply: (l, w, h) => {
      u && (l[0] && l[1] && s.autoApply && w("auto-apply", h), l[0] && !l[1] && (s.modelAuto || u.value.partialRange) && s.autoApply && w("auto-apply", h));
    },
    setMonthOrYearRange: (l) => {
      let w = r.value ? r.value.slice() : [];
      return w.length === 2 && w[1] !== null && (w = []), w.length ? (A(l, w[0]) ? w.unshift(l) : w[1] = l, c("range-end", l)) : (w = [l], c("range-start", l)), w;
    },
    handleMultiDatesSelect: (l, w) => {
      if (r.value && Array.isArray(r.value))
        if (r.value.some((h) => f(l, h))) {
          const h = r.value.filter((_) => !f(_, l));
          r.value = h.length ? h : null;
        } else (w && +w > r.value.length || !w) && r.value.push(l);
      else
        r.value = [l];
    }
  };
}, qr = (e, A) => {
  const {
    getDate: f,
    rootEmit: o,
    state: c,
    calendars: s,
    year: r,
    modelValue: u,
    rootProps: v,
    defaults: { range: Y, highlight: P, safeDates: B, filters: O, multiDates: l }
  } = Me();
  Ft(() => {
    c.isTextInputDate && x(getYear(f(v.startDate)), 0);
  });
  const { checkMinMaxRange: w, checkMinMaxValue: h } = Ue(), { isDateBetween: _, resetDateTime: b, resetDate: E, getMinMonth: k, getMaxMonth: g, checkHighlightMonth: M, groupListAndMap: R } = We(), { checkRangeAutoApply: $, getRangeWithFixedDate: S, handleMultiDatesSelect: p, setMonthOrYearRange: D, setPresetDate: V } = na(), { padZero: F } = Ie(), { getMonths: L, isOutOfYearRange: ne } = ea(), re2 = vueExports.computed(() => L()), X = vueExports.ref(null), {
    selectYear: x,
    groupedYears: te,
    showYearPicker: q,
    toggleYearPicker: oe,
    handleYearSelect: K,
    handleYear: Z,
    isDisabled: de
  } = Wa(A);
  const ce = (m) => m ? { month: getMonth(m), year: getYear(m) } : { month: null, year: null }, le = () => u.value ? Array.isArray(u.value) ? u.value.map((m) => ce(m)) : ce(u.value) : ce(), we = (m, N) => {
    const U = s.value[m], pe = le();
    return Array.isArray(pe) ? pe.some((ge) => ge.year === U?.year && ge.month === N) : U?.year === pe.year && N === pe.month;
  }, ve = (m, N, U) => {
    const pe = le();
    return Array.isArray(pe) ? r.value(N) === pe[U]?.year && m === pe[U]?.month : false;
  }, Ae = (m, N) => {
    if (Y.value.enabled) {
      const U = le();
      if (Array.isArray(u.value) && Array.isArray(U)) {
        const pe = ve(m, N, 0) || ve(m, N, 1), ge = set(E(f()), { month: m, year: r.value(N) });
        return _(u.value, X.value, ge) && !pe;
      }
      return false;
    }
    return false;
  }, Q = vueExports.computed(() => (m) => R(re2.value, (N) => {
    const U = we(m, N.value), pe = h(
      N.value,
      k(r.value(m), B.value.minDate),
      g(r.value(m), B.value.maxDate)
    ) || n(B.value.disabledDates, r.value(m), N.value) || O.value.months?.includes(N.value) || !C(B.value.allowedDates, r.value(m), N.value) || ne(r.value(m)), ge = Ae(N.value, m), Qe = M(P.value, N.value, r.value(m));
    return { active: U, disabled: pe, isBetween: ge, highlighted: Qe };
  })), I = (m, N) => set(E(f()), { month: m, year: r.value(N) }), y = (m, N) => {
    const U = u.value ? u.value : E(f());
    u.value = set(U, { month: m, year: r.value(N) }), A("auto-apply"), A("update-flow-step");
  }, H = (m, N) => {
    const U = I(m, N);
    Y.value.fixedEnd || Y.value.fixedStart ? u.value = S(U) : u.value ? w(U, u.value) && (u.value = D(I(m, N))) : u.value = [I(m, N)], vueExports.nextTick().then(() => {
      $(u.value, A, u.value.length < 2);
    });
  }, fe = (m, N) => {
    p(I(m, N), l.value.limit), A("auto-apply", true);
  }, Pe = (m, N) => (s.value[N].month = m, i(N, s.value[N].year, m), l.value.enabled ? fe(m, N) : Y.value.enabled ? H(m, N) : y(m, N)), Ce = (m, N) => {
    x(m, N), i(N, m, null);
  }, i = (m, N, U) => {
    let pe = U;
    if (!pe && pe !== 0) {
      const ge = le();
      pe = Array.isArray(ge) ? ge[m].month : ge.month;
    }
    o("update-month-year", { instance: m, year: N, month: pe });
  }, d = (m, N) => {
    X.value = I(m, N);
  }, a = (m) => {
    V({
      value: m
    }), A("auto-apply");
  }, n = (m, N, U) => {
    if (m instanceof Map) {
      const pe = `${F(U + 1)}-${N}`;
      return m.size ? m.has(pe) : false;
    }
    return typeof m == "function" ? m(b(set(f(), { month: U, year: N }), true)) : false;
  }, C = (m, N, U) => {
    if (m instanceof Map) {
      const pe = `${F(U + 1)}-${N}`;
      return m.size ? m.has(pe) : true;
    }
    return true;
  };
  return {
    groupedMonths: Q,
    groupedYears: te,
    year: r,
    isDisabled: de,
    showYearPicker: q,
    modelValue: u,
    toggleYearPicker: oe,
    handleYearSelect: K,
    handleYear: Z,
    presetDate: a,
    setHoverDate: d,
    selectMonth: Pe,
    selectYear: Ce,
    getModelMonthYear: le
  };
}, Ur = /* @__PURE__ */ vueExports.defineComponent({
  __name: "MonthPicker",
  props: {
    flowStep: {},
    collapse: { type: Boolean },
    menuWrapRef: {},
    noOverlayFocus: { type: Boolean }
  },
  emits: ["reset-flow", "auto-apply", "update-flow-step", "mount"],
  setup(e, { expose: A, emit: f }) {
    const o = f, c = e, s = vueExports.useSlots(), {
      rootProps: r,
      defaults: { config: u }
    } = Me(), v = lt(s, at.YearMode);
    const {
      groupedMonths: Y,
      groupedYears: P,
      year: B,
      isDisabled: O,
      showYearPicker: l,
      modelValue: w,
      presetDate: h,
      setHoverDate: _,
      selectMonth: b,
      selectYear: E,
      toggleYearPicker: k,
      handleYearSelect: g,
      handleYear: M,
      getModelMonthYear: R
    } = qr(c, o);
    return A({ getSidebarProps: () => ({
      modelValue: w,
      year: B,
      getModelMonthYear: R,
      selectMonth: b,
      selectYear: E,
      handleYear: M
    }), presetDate: h, toggleYearPicker: (S) => k(0, S) }), (S, p) => (vueExports.openBlock(), vueExports.createBlock(aa, {
      collapse: e.collapse,
      stretch: ""
    }, {
      default: vueExports.withCtx(({ instances: D, wrapClass: V }) => [
        (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList(D, (F) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
          key: F,
          class: vueExports.normalizeClass(V)
        }, [
          S.$slots["top-extra"] ? vueExports.renderSlot(S.$slots, "top-extra", {
            key: 0,
            value: vueExports.unref(w)
          }) : vueExports.createCommentVNode("", true),
          vueExports.renderSlot(S.$slots, "month-year", vueExports.mergeProps({ ref_for: true }, {
            year: vueExports.unref(B),
            months: vueExports.unref(Y)(F),
            years: vueExports.unref(P)(F),
            selectMonth: vueExports.unref(b),
            selectYear: vueExports.unref(E),
            instance: F
          }), () => [
            vueExports.createVNode(Nt, {
              items: vueExports.unref(Y)(F),
              "is-last": vueExports.unref(r).autoApply && !vueExports.unref(u).keepActionRow,
              height: vueExports.unref(u).modeHeight,
              "no-overlay-focus": !!(e.noOverlayFocus || vueExports.unref(r).textInput),
              "use-relative": "",
              level: 0,
              type: "month",
              onSelected: (L) => vueExports.unref(b)(L, F),
              onHoverValue: (L) => vueExports.unref(_)(L, F)
            }, vueExports.createSlots({
              header: vueExports.withCtx(() => [
                vueExports.createVNode(Na, {
                  items: vueExports.unref(P)(F),
                  instance: F,
                  "show-year-picker": vueExports.unref(l)[F],
                  year: vueExports.unref(B)(F),
                  "is-disabled": (L) => vueExports.unref(O)(F, L),
                  onHandleYear: (L) => vueExports.unref(M)(F, L),
                  onYearSelect: (L) => vueExports.unref(g)(L, F),
                  onToggleYearPicker: (L) => vueExports.unref(k)(F, L?.flow, L?.show)
                }, vueExports.createSlots({ _: 2 }, [
                  vueExports.renderList(vueExports.unref(v), (L, ne) => ({
                    name: L,
                    fn: vueExports.withCtx((re2) => [
                      vueExports.renderSlot(S.$slots, L, vueExports.mergeProps({ ref_for: true }, re2))
                    ])
                  }))
                ]), 1032, ["items", "instance", "show-year-picker", "year", "is-disabled", "onHandleYear", "onYearSelect", "onToggleYearPicker"])
              ]),
              _: 2
            }, [
              S.$slots["month-overlay-value"] ? {
                name: "item",
                fn: vueExports.withCtx(({ item: L }) => [
                  vueExports.renderSlot(S.$slots, "month-overlay-value", {
                    text: L.text,
                    value: L.value
                  })
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["items", "is-last", "height", "no-overlay-focus", "onSelected", "onHoverValue"])
          ])
        ], 2))), 128))
      ]),
      _: 3
    }, 8, ["collapse"]));
  }
}), Qr = (e, A) => {
  const {
    rootEmit: f,
    getDate: o,
    state: c,
    modelValue: s,
    rootProps: r,
    defaults: { highlight: u, multiDates: v, filters: Y, range: P, safeDates: B }
  } = Me(), { getYears: O } = ea(), { isDateBetween: l, resetDate: w, resetDateTime: h, getYearFromDate: _, checkHighlightYear: b, groupListAndMap: E } = We(), { checkRangeAutoApply: k, setMonthOrYearRange: g } = na(), { checkMinMaxValue: M, checkMinMaxRange: R } = Ue();
  Ft(() => {
    c.isTextInputDate && (S.value = getYear(o(r.startDate)));
  });
  const $ = vueExports.ref(null), S = vueExports.ref();
  const p = (x) => Array.isArray(s.value) ? s.value.some((te) => getYear(te) === x) : s.value ? getYear(s.value) === x : false, D = (x) => P.value.enabled && Array.isArray(s.value) ? l(s.value, $.value, ne(x)) : false, V = (x) => B.value.allowedDates?.size ? B.value.allowedDates.has(`${x}`) : true, F = (x) => B.value.disabledDates instanceof Map ? B.value.disabledDates.size ? B.value.disabledDates.has(`${x}`) : false : typeof B.value.disabledDates == "function" ? B.value.disabledDates(setYear(h(startOfYear(o())), x)) : true, L = vueExports.computed(() => E(O(), (x) => {
    const te = p(x.value), q = M(
      x.value,
      _(B.value.minDate),
      _(B.value.maxDate)
    ) || Y.value.years.includes(x.value) || !V(x.value) || F(x.value), oe = D(x.value) && !te, K = b(u.value, x.value);
    return { active: te, disabled: q, isBetween: oe, highlighted: K };
  })), ne = (x) => setYear(w(startOfYear(o())), x);
  return {
    groupedYears: L,
    focusYear: S,
    setHoverValue: (x) => {
      $.value = setYear(w(o()), x);
    },
    selectYear: (x) => {
      if (f("update-month-year", { instance: 0, year: x, month: Number.NaN }), v.value.enabled)
        return s.value ? Array.isArray(s.value) && ((s.value?.map((q) => getYear(q))).includes(x) ? s.value = s.value.filter((q) => getYear(q) !== x) : s.value.push(setYear(h(o()), x))) : s.value = [setYear(h(startOfYear(o())), x)], A("auto-apply", true);
      P.value.enabled ? R(ne(x), s.value) && (s.value = g(ne(x)), vueExports.nextTick().then(() => {
        k(s.value, A, s.value.length < 2);
      })) : (s.value = ne(x), A("auto-apply"));
    }
  };
}, Jr = /* @__PURE__ */ vueExports.defineComponent({
  __name: "YearPicker",
  props: {
    flowStep: {},
    collapse: { type: Boolean },
    menuWrapRef: {},
    noOverlayFocus: { type: Boolean }
  },
  emits: ["reset-flow", "auto-apply"],
  setup(e, { expose: A, emit: f }) {
    const o = f, c = e, {
      modelValue: s,
      defaults: { config: r },
      rootProps: u
    } = Me(), { groupedYears: v, focusYear: Y, selectYear: P, setHoverValue: B } = Qr(c, o);
    return A({ getSidebarProps: () => ({
      modelValue: s,
      selectYear: P
    }) }), (l, w) => (vueExports.openBlock(), vueExports.createElementBlock("div", null, [
      l.$slots["top-extra"] ? vueExports.renderSlot(l.$slots, "top-extra", {
        key: 0,
        value: vueExports.unref(s)
      }) : vueExports.createCommentVNode("", true),
      l.$slots["month-year"] ? vueExports.renderSlot(l.$slots, "month-year", vueExports.normalizeProps(vueExports.mergeProps({ key: 1 }, {
        years: vueExports.unref(v),
        selectYear: vueExports.unref(P)
      }))) : (vueExports.openBlock(), vueExports.createBlock(Nt, {
        key: 2,
        items: vueExports.unref(v),
        "is-last": vueExports.unref(u).autoApply && !vueExports.unref(r).keepActionRow,
        height: vueExports.unref(r).modeHeight,
        "no-overlay-focus": !!(e.noOverlayFocus || vueExports.unref(u).textInput),
        "focus-value": vueExports.unref(Y),
        type: "year",
        "use-relative": "",
        onSelected: vueExports.unref(P),
        onHoverValue: vueExports.unref(B)
      }, vueExports.createSlots({ _: 2 }, [
        l.$slots["year-overlay-value"] ? {
          name: "item",
          fn: vueExports.withCtx(({ item: h }) => [
            vueExports.renderSlot(l.$slots, "year-overlay-value", {
              text: h.text,
              value: h.value
            })
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["items", "is-last", "height", "no-overlay-focus", "focus-value", "onSelected", "onHoverValue"]))
    ]));
  }
}), Gr = {
  key: 0,
  class: "dp__time_input"
}, Xr = ["data-compact", "data-collapsed"], Zr = ["data-test-id", "aria-label", "data-dp-action-element", "onKeydown", "onClick", "onMousedown"], el = ["aria-label", "disabled", "data-dp-action-element", "data-test-id", "onKeydown", "onClick"], tl = ["data-test-id", "aria-label", "data-dp-action-element", "onKeydown", "onClick", "onMousedown"], al = { key: 0 }, nl = ["aria-label", "data-dp-action-element", "data-compact"], rl = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TimeInput",
  props: {
    hours: {},
    minutes: {},
    seconds: {},
    order: {},
    closeTimePickerBtn: {},
    disabledTimesConfig: {},
    validateTime: {}
  },
  emits: ["update:hours", "update:minutes", "update:seconds", "overlay-opened", "overlay-closed", "set-hours", "set-minutes", "reset-flow", "mounted"],
  setup(e, { expose: A, emit: f }) {
    const o = f, c = e, {
      getDate: s,
      rootEmit: r,
      rootProps: u,
      defaults: { ariaLabels: v, filters: Y, config: P, range: B, multiCalendars: O, timeConfig: l }
    } = Me(), { checkKeyDown: w, hoursToAmPmHours: h } = Ie(), { boolHtmlAttribute: _ } = Pt(), { sanitizeTime: b, groupListAndMap: E } = We(), { transitionName: k, showTransition: g } = Vt(), M = vueExports.reactive({
      hours: false,
      minutes: false,
      seconds: false
    }), R = vueExports.ref("AM"), $ = vueExports.ref(null), S = vueExports.ref(), p = vueExports.ref(false);
    const D = (n) => set(s(), {
      hours: n.hours,
      minutes: n.minutes,
      seconds: l.value.enableSeconds ? n.seconds : 0,
      milliseconds: 0
    }), V = vueExports.computed(() => u.timePicker || l.value.timePickerInline ? 0 : 1), F = vueExports.computed(
      () => (n) => ce(n, c[n]) || ne(n, c[n])
    ), L = vueExports.computed(() => ({ hours: c.hours, minutes: c.minutes, seconds: c.seconds })), ne = (n, C) => B.value.enabled && !B.value.disableTimeRangeValidation ? !c.validateTime(n, C) : false, re2 = (n, C) => {
      if (B.value.enabled && !B.value.disableTimeRangeValidation) {
        const m = C ? +l.value[`${n}Increment`] : -+l.value[`${n}Increment`], N = c[n] + m;
        return !c.validateTime(n, N);
      }
      return false;
    }, X = vueExports.computed(() => (n) => !Q(+c[n] + +l.value[`${n}Increment`], n) || re2(n, true)), x = vueExports.computed(() => (n) => !Q(+c[n] - +l.value[`${n}Increment`], n) || re2(n, false)), te = (n, C) => add(set(s(), n), C), q = (n, C) => sub(set(s(), n), C), oe = vueExports.computed(
      () => ({
        dp__time_col: true,
        dp__time_col_block: !l.value.timePickerInline,
        dp__time_col_reg_block: !l.value.enableSeconds && l.value.is24 && !l.value.timePickerInline,
        dp__time_col_reg_inline: !l.value.enableSeconds && l.value.is24 && l.value.timePickerInline,
        dp__time_col_reg_with_button: !l.value.enableSeconds && !l.value.is24,
        dp__time_col_sec: l.value.enableSeconds && l.value.is24,
        dp__time_col_sec_with_button: l.value.enableSeconds && !l.value.is24
      })
    ), K = vueExports.computed(
      () => l.value.timePickerInline && B.value.enabled && !O.value.count
    ), Z = vueExports.computed(() => {
      const n = [{ type: "hours" }];
      return l.value.enableMinutes && n.push({ type: "", separator: true }, {
        type: "minutes"
      }), l.value.enableSeconds && n.push({ type: "", separator: true }, {
        type: "seconds"
      }), n;
    }), de = vueExports.computed(() => Z.value.filter((n) => !n.separator)), G = vueExports.computed(() => (n) => {
      if (n === "hours") {
        const C = Ce(+c.hours);
        return { text: C < 10 ? `0${C}` : `${C}`, value: C };
      }
      return { text: c[n] < 10 ? `0${c[n]}` : `${c[n]}`, value: c[n] };
    }), ce = (n, C) => {
      if (!c.disabledTimesConfig) return false;
      const m = c.disabledTimesConfig(c.order, n === "hours" ? C : void 0);
      return m[n] ? !!m[n]?.includes(C) : true;
    }, le = (n, C) => C !== "hours" || R.value === "AM" ? n : n + 12, we = (n) => {
      const C = l.value.is24 ? 24 : 12, m = n === "hours" ? C : 60, N = +l.value[`${n}GridIncrement`], U = n === "hours" && !l.value.is24 ? N : 0, pe = [];
      for (let ge = U; ge < m; ge += N)
        pe.push({
          value: l.value.is24 ? ge : le(ge, n),
          text: ge < 10 ? `0${ge}` : `${ge}`
        });
      return n === "hours" && !l.value.is24 && pe.unshift({ value: R.value === "PM" ? 12 : 0, text: "12" }), E(pe, (ge) => ({ active: false, disabled: Y.value.times[n].includes(ge.value) || !Q(ge.value, n) || ce(n, ge.value) || ne(n, ge.value) }));
    }, ve = (n) => n >= 0 ? n : 59, Ae = (n) => n >= 0 ? n : 23, Q = (n, C) => {
      const m = u.minTime ? D(b(u.minTime)) : null, N = u.maxTime ? D(b(u.maxTime)) : null, U = D(
        b(
          L.value,
          C,
          C === "minutes" || C === "seconds" ? ve(n) : Ae(n)
        )
      );
      return m && N ? (isBefore(U, N) || isEqual(U, N)) && (isAfter(U, m) || isEqual(U, m)) : m ? isAfter(U, m) || isEqual(U, m) : N ? isBefore(U, N) || isEqual(U, N) : true;
    }, I = (n) => l.value[`no${n[0].toUpperCase() + n.slice(1)}Overlay`], y = (n) => {
      I(n) || (M[n] = !M[n], M[n] ? (p.value = true, o("overlay-opened", n)) : (p.value = false, o("overlay-closed", n)));
    }, H = (n) => n === "hours" ? getHours : n === "minutes" ? getMinutes : getSeconds, fe = () => {
      S.value && clearTimeout(S.value);
    }, Pe = (n, C = true, m) => {
      const N = C ? te : q, U = C ? +l.value[`${n}Increment`] : -+l.value[`${n}Increment`];
      Q(+c[n] + U, n) && o(
        `update:${n}`,
        H(n)(
          N({ [n]: +c[n] }, { [n]: +l.value[`${n}Increment`] })
        )
      ), !m?.keyboard && P.value.timeArrowHoldThreshold && (S.value = setTimeout(() => {
        Pe(n, C);
      }, P.value.timeArrowHoldThreshold));
    }, Ce = (n) => l.value.is24 ? n : (n >= 12 ? R.value = "PM" : R.value = "AM", h(n)), i = () => {
      R.value === "PM" ? (R.value = "AM", o("update:hours", c.hours - 12)) : (R.value = "PM", o("update:hours", c.hours + 12)), r("am-pm-change", R.value);
    }, d = (n) => {
      M[n] = true;
    }, a = (n, C) => (y(n), o(`update:${n}`, C));
    return A({ openChildCmp: d }), (n, C) => vueExports.unref(u).disabled ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createElementBlock("div", Gr, [
      (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList(Z.value, (m, N) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
        key: N,
        class: vueExports.normalizeClass(oe.value),
        "data-compact": K.value && !vueExports.unref(l).enableSeconds,
        "data-collapsed": K.value && vueExports.unref(l).enableSeconds
      }, [
        m.separator ? (vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, { key: 0 }, [
          p.value ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, { key: 0 }, [
            vueExports.createTextVNode(":")
          ], 64))
        ], 64)) : (vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, { key: 1 }, [
          vueExports.createElementVNode("button", {
            type: "button",
            class: vueExports.normalizeClass({
              dp__btn: true,
              dp__inc_dec_button: !vueExports.unref(l).timePickerInline,
              dp__inc_dec_button_inline: vueExports.unref(l).timePickerInline,
              dp__tp_inline_btn_top: vueExports.unref(l).timePickerInline,
              dp__inc_dec_button_disabled: X.value(m.type),
              "dp--hidden-el": p.value
            }),
            "data-test-id": `${m.type}-time-inc-btn-${c.order}`,
            "aria-label": vueExports.unref(v)?.incrementValue(m.type),
            tabindex: "0",
            "data-dp-action-element": V.value,
            onKeydown: (U) => vueExports.unref(w)(U, () => Pe(m.type, true, { keyboard: true }), true),
            onClick: (U) => vueExports.unref(P).timeArrowHoldThreshold ? void 0 : Pe(m.type, true),
            onMousedown: (U) => vueExports.unref(P).timeArrowHoldThreshold ? Pe(m.type, true) : void 0,
            onMouseup: fe
          }, [
            vueExports.unref(l).timePickerInline ? vueExports.renderSlot(n.$slots, "tp-inline-arrow-up", { key: 1 }, () => [
              C[2] || (C[2] = vueExports.createElementVNode("span", { class: "dp__tp_inline_btn_bar dp__tp_btn_in_l" }, null, -1)),
              C[3] || (C[3] = vueExports.createElementVNode("span", { class: "dp__tp_inline_btn_bar dp__tp_btn_in_r" }, null, -1))
            ]) : vueExports.renderSlot(n.$slots, "arrow-up", { key: 0 }, () => [
              vueExports.createVNode(vueExports.unref(Ya))
            ])
          ], 42, Zr),
          vueExports.createElementVNode("button", {
            type: "button",
            "aria-label": `${G.value(m.type).text}-${vueExports.unref(v)?.openTpOverlay(m.type)}`,
            class: vueExports.normalizeClass({
              dp__time_display: true,
              dp__time_display_block: !vueExports.unref(l).timePickerInline,
              dp__time_display_inline: vueExports.unref(l).timePickerInline,
              "dp--time-invalid": F.value(m.type),
              "dp--time-overlay-btn": !F.value(m.type),
              "dp--hidden-el": p.value
            }),
            disabled: vueExports.unref(_)(I(m.type)),
            tabindex: "0",
            "data-dp-action-element": V.value,
            "data-test-id": `${m.type}-toggle-overlay-btn-${c.order}`,
            onKeydown: (U) => vueExports.unref(w)(U, () => y(m.type), true),
            onClick: (U) => y(m.type)
          }, [
            vueExports.renderSlot(n.$slots, m.type, {
              text: G.value(m.type).text,
              value: G.value(m.type).value
            }, () => [
              vueExports.createTextVNode(vueExports.toDisplayString(G.value(m.type).text), 1)
            ])
          ], 42, el),
          vueExports.createElementVNode("button", {
            type: "button",
            class: vueExports.normalizeClass({
              dp__btn: true,
              dp__inc_dec_button: !vueExports.unref(l).timePickerInline,
              dp__inc_dec_button_inline: vueExports.unref(l).timePickerInline,
              dp__tp_inline_btn_bottom: vueExports.unref(l).timePickerInline,
              dp__inc_dec_button_disabled: x.value(m.type),
              "dp--hidden-el": p.value
            }),
            "data-test-id": `${m.type}-time-dec-btn-${c.order}`,
            "aria-label": vueExports.unref(v)?.decrementValue(m.type),
            tabindex: "0",
            "data-dp-action-element": V.value,
            onKeydown: (U) => vueExports.unref(w)(U, () => Pe(m.type, false, { keyboard: true }), true),
            onClick: (U) => vueExports.unref(P).timeArrowHoldThreshold ? void 0 : Pe(m.type, false),
            onMousedown: (U) => vueExports.unref(P).timeArrowHoldThreshold ? Pe(m.type, false) : void 0,
            onMouseup: fe
          }, [
            vueExports.unref(l).timePickerInline ? vueExports.renderSlot(n.$slots, "tp-inline-arrow-down", { key: 1 }, () => [
              C[4] || (C[4] = vueExports.createElementVNode("span", { class: "dp__tp_inline_btn_bar dp__tp_btn_in_l" }, null, -1)),
              C[5] || (C[5] = vueExports.createElementVNode("span", { class: "dp__tp_inline_btn_bar dp__tp_btn_in_r" }, null, -1))
            ]) : vueExports.renderSlot(n.$slots, "arrow-down", { key: 0 }, () => [
              vueExports.createVNode(vueExports.unref(Ba))
            ])
          ], 42, tl)
        ], 64))
      ], 10, Xr))), 128)),
      vueExports.unref(l).is24 ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createElementBlock("div", al, [
        vueExports.renderSlot(n.$slots, "am-pm-button", {
          toggle: i,
          value: R.value
        }, () => [
          vueExports.createElementVNode("button", {
            ref_key: "amPmButton",
            ref: $,
            type: "button",
            class: "dp__pm_am_button",
            role: "button",
            "aria-label": vueExports.unref(v)?.amPmButton,
            tabindex: "0",
            "data-dp-action-element": V.value,
            "data-compact": K.value,
            onClick: i,
            onKeydown: C[0] || (C[0] = (m) => vueExports.unref(w)(m, () => i(), true))
          }, vueExports.toDisplayString(R.value), 41, nl)
        ])
      ])),
      (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList(de.value, (m, N) => (vueExports.openBlock(), vueExports.createBlock(vueExports.Transition, {
        key: N,
        name: vueExports.unref(k)(M[m.type]),
        css: vueExports.unref(g)
      }, {
        default: vueExports.withCtx(() => [
          M[m.type] ? (vueExports.openBlock(), vueExports.createBlock(Nt, {
            key: 0,
            items: we(m.type),
            "is-last": vueExports.unref(u).autoApply && !vueExports.unref(P).keepActionRow,
            type: m.type,
            "aria-labels": vueExports.unref(v),
            level: vueExports.unref(l).timePickerInline || vueExports.unref(u).timePicker ? 1 : 2,
            "overlay-label": vueExports.unref(v).timeOverlay?.(m.type),
            onSelected: (U) => a(m.type, U),
            onToggle: (U) => y(m.type),
            onResetFlow: C[1] || (C[1] = (U) => n.$emit("reset-flow"))
          }, vueExports.createSlots({
            "button-icon": vueExports.withCtx(() => [
              vueExports.renderSlot(n.$slots, "clock-icon", {}, () => [
                n.$slots["clock-icon"] ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createBlock(vueExports.resolveDynamicComponent(vueExports.unref(l).timePickerInline ? vueExports.unref(Et) : vueExports.unref(Oa)), { key: 0 }))
              ])
            ]),
            _: 2
          }, [
            n.$slots[`${m.type}-overlay-value`] ? {
              name: "item",
              fn: vueExports.withCtx(({ item: U }) => [
                vueExports.renderSlot(n.$slots, `${m.type}-overlay-value`, {
                  text: U.text,
                  value: U.value
                })
              ]),
              key: "0"
            } : void 0,
            n.$slots[`${m.type}-overlay-header`] ? {
              name: "header",
              fn: vueExports.withCtx(() => [
                vueExports.renderSlot(n.$slots, `${m.type}-overlay-header`, {
                  toggle: () => y(m.type)
                })
              ]),
              key: "1"
            } : void 0
          ]), 1032, ["items", "is-last", "type", "aria-labels", "level", "overlay-label", "onSelected", "onToggle"])) : vueExports.createCommentVNode("", true)
        ]),
        _: 2
      }, 1032, ["name", "css"]))), 128))
    ]));
  }
}), ll = ["data-dp-mobile"], ol = ["aria-label", "tabindex"], sl = ["role", "aria-label", "tabindex"], ul = ["aria-label"], La = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TimePicker",
  props: {
    hours: {},
    minutes: {},
    seconds: {},
    disabledTimesConfig: { type: [Function, null] },
    noOverlayFocus: { type: Boolean },
    validateTime: { type: Function }
  },
  emits: ["update:hours", "update:minutes", "update:seconds", "mount", "reset-flow"],
  setup(e, { expose: A, emit: f }) {
    const o = f, c = e, {
      rootEmit: s,
      setState: r,
      modelValue: u,
      rootProps: v,
      defaults: { ariaLabels: Y, textInput: P, config: B, range: O, timeConfig: l }
    } = Me(), { isModelAuto: w } = We(), { checkKeyDown: h, findFocusableEl: _ } = Ie(), { transitionName: b, showTransition: E } = Vt(), { hideNavigationButtons: k } = ta(), { isMobile: g } = Zt(), M = vueExports.useSlots(), R = vueExports.useTemplateRef("overlay"), $ = vueExports.useTemplateRef("close-tp-btn"), S = vueExports.useTemplateRef("tp-input"), p = vueExports.ref(false);
    const D = vueExports.computed(() => O.value.enabled && v.modelAuto ? w(u.value) : true), V = vueExports.ref(false), F = (G) => ({
      hours: Array.isArray(c.hours) ? c.hours[G] : c.hours,
      minutes: Array.isArray(c.minutes) ? c.minutes[G] : c.minutes,
      seconds: Array.isArray(c.seconds) ? c.seconds[G] : c.seconds
    }), L = vueExports.computed(() => {
      const G = [];
      if (O.value.enabled)
        for (let ce = 0; ce < 2; ce++)
          G.push(F(ce));
      else
        G.push(F(0));
      return G;
    }), ne = (G, ce = false, le = "") => {
      ce || o("reset-flow"), V.value = G, r("arrowNavigationLevel", G ? 1 : 0), s("overlay-toggle", { open: G, overlay: He.time }), vueExports.nextTick(() => {
        le !== "" && S.value?.[0] && S.value[0].openChildCmp(le);
      });
    }, re2 = vueExports.computed(() => ({
      dp__btn: true,
      dp__button: true,
      dp__button_bottom: v.autoApply && !B.value.keepActionRow
    })), X = lt(M, at.TimeInput), x = (G, ce, le) => O.value.enabled ? ce === 0 ? [G, L.value[1][le]] : [L.value[0][le], G] : G, te = (G) => {
      o("update:hours", G);
    }, q = (G) => {
      o("update:minutes", G);
    }, oe = (G) => {
      o("update:seconds", G);
    }, K = () => {
      if (R.value && !P.value.enabled && !c.noOverlayFocus) {
        const G = _(R.value);
        G && G.focus({ preventScroll: true });
      }
    }, Z = (G) => {
      p.value = false, s("overlay-toggle", { open: false, overlay: G });
    }, de = (G) => {
      p.value = true, s("overlay-toggle", { open: true, overlay: G });
    };
    return A({ toggleTimePicker: ne }), (G, ce) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
      class: "dp--tp-wrap",
      "data-dp-mobile": vueExports.unref(g)
    }, [
      !vueExports.unref(v).timePicker && !vueExports.unref(l).timePickerInline ? vueExports.withDirectives((vueExports.openBlock(), vueExports.createElementBlock("button", {
        key: 0,
        ref: "open-tp-btn",
        type: "button",
        "data-dp-action-element": "0",
        class: vueExports.normalizeClass({ ...re2.value, "dp--hidden-el": V.value }),
        "aria-label": vueExports.unref(Y)?.openTimePicker,
        tabindex: e.noOverlayFocus ? void 0 : 0,
        "data-test-id": "open-time-picker-btn",
        onKeydown: ce[0] || (ce[0] = (le) => vueExports.unref(h)(le, () => ne(true))),
        onClick: ce[1] || (ce[1] = (le) => ne(true))
      }, [
        vueExports.renderSlot(G.$slots, "clock-icon", {}, () => [
          vueExports.createVNode(vueExports.unref(Oa))
        ])
      ], 42, ol)), [
        [vueExports.vShow, !vueExports.unref(k)("time")]
      ]) : vueExports.createCommentVNode("", true),
      vueExports.createVNode(vueExports.Transition, {
        name: vueExports.unref(b)(V.value),
        css: vueExports.unref(E) && !vueExports.unref(l).timePickerInline
      }, {
        default: vueExports.withCtx(() => [
          V.value || vueExports.unref(v).timePicker || vueExports.unref(l).timePickerInline ? (vueExports.openBlock(), vueExports.createElementBlock("div", {
            key: 0,
            ref: "overlay",
            role: vueExports.unref(l).timePickerInline ? void 0 : "dialog",
            class: vueExports.normalizeClass({
              dp__overlay: !vueExports.unref(l).timePickerInline,
              "dp--overlay-absolute": !vueExports.unref(v).timePicker && !vueExports.unref(l).timePickerInline,
              "dp--overlay-relative": vueExports.unref(v).timePicker
            }),
            style: vueExports.normalizeStyle(vueExports.unref(v).timePicker ? { height: `${vueExports.unref(B).modeHeight}px` } : void 0),
            "aria-label": vueExports.unref(Y)?.timePicker,
            tabindex: vueExports.unref(l).timePickerInline ? void 0 : 0
          }, [
            vueExports.createElementVNode("div", {
              class: vueExports.normalizeClass(
                vueExports.unref(l).timePickerInline ? "dp__time_picker_inline_container" : "dp__overlay_container dp__container_flex dp__time_picker_overlay_container"
              ),
              style: { display: "flex" }
            }, [
              vueExports.renderSlot(G.$slots, "time-picker-overlay", {
                hours: e.hours,
                minutes: e.minutes,
                seconds: e.seconds,
                setHours: te,
                setMinutes: q,
                setSeconds: oe
              }, () => [
                vueExports.createElementVNode("div", {
                  class: vueExports.normalizeClass(vueExports.unref(l).timePickerInline ? "dp__flex" : "dp__overlay_row dp__flex_row")
                }, [
                  (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList(L.value, (le, we) => vueExports.withDirectives((vueExports.openBlock(), vueExports.createBlock(rl, vueExports.mergeProps({ key: we }, { ref_for: true }, {
                    order: we,
                    hours: le.hours,
                    minutes: le.minutes,
                    seconds: le.seconds,
                    closeTimePickerBtn: $.value,
                    disabledTimesConfig: e.disabledTimesConfig,
                    disabled: we === 0 ? vueExports.unref(O).fixedStart : vueExports.unref(O).fixedEnd
                  }, {
                    ref_for: true,
                    ref: "tp-input",
                    "validate-time": (ve, Ae) => e.validateTime(ve, x(Ae, we, ve)),
                    "onUpdate:hours": (ve) => te(x(ve, we, "hours")),
                    "onUpdate:minutes": (ve) => q(x(ve, we, "minutes")),
                    "onUpdate:seconds": (ve) => oe(x(ve, we, "seconds")),
                    onMounted: K,
                    onOverlayClosed: Z,
                    onOverlayOpened: de
                  }), vueExports.createSlots({ _: 2 }, [
                    vueExports.renderList(vueExports.unref(X), (ve, Ae) => ({
                      name: ve,
                      fn: vueExports.withCtx((Q) => [
                        vueExports.renderSlot(G.$slots, ve, vueExports.mergeProps({ ref_for: true }, Q))
                      ])
                    }))
                  ]), 1040, ["validate-time", "onUpdate:hours", "onUpdate:minutes", "onUpdate:seconds"])), [
                    [vueExports.vShow, we === 0 ? true : D.value]
                  ])), 128))
                ], 2)
              ]),
              !vueExports.unref(v).timePicker && !vueExports.unref(l).timePickerInline ? vueExports.withDirectives((vueExports.openBlock(), vueExports.createElementBlock("button", {
                key: 0,
                ref: "close-tp-btn",
                "data-dp-action-element": "1",
                type: "button",
                class: vueExports.normalizeClass({ ...re2.value, "dp--hidden-el": p.value }),
                "aria-label": vueExports.unref(Y)?.closeTimePicker,
                tabindex: "0",
                onKeydown: ce[2] || (ce[2] = (le) => vueExports.unref(h)(le, () => ne(false))),
                onClick: ce[3] || (ce[3] = (le) => ne(false))
              }, [
                vueExports.renderSlot(G.$slots, "calendar-icon", {}, () => [
                  vueExports.createVNode(vueExports.unref(Et))
                ])
              ], 42, ul)), [
                [vueExports.vShow, !vueExports.unref(k)("time")]
              ]) : vueExports.createCommentVNode("", true)
            ], 2)
          ], 14, sl)) : vueExports.createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["name", "css"])
    ], 8, ll));
  }
}), Ha = (e) => {
  const {
    getDate: A,
    modelValue: f,
    time: o,
    rootProps: c,
    defaults: { range: s, timeConfig: r }
  } = Me(), { isDateEqual: u, setTime: v } = We(), Y = ($, S) => Array.isArray(o[$]) ? o[$][S] : o[$], P = ($) => r.value.enableSeconds ? Array.isArray(o.seconds) ? o.seconds[$] : o.seconds : 0, B = ($, S) => $ ? v(
    S !== void 0 ? { hours: Y("hours", S), minutes: Y("minutes", S), seconds: P(S) } : { hours: o.hours, minutes: o.minutes, seconds: P() },
    $
  ) : setSeconds(A(), P(S)), O = ($, S) => {
    o[$] = S;
  }, l = vueExports.computed(() => c.modelAuto && s.value.enabled ? Array.isArray(f.value) ? f.value.length > 1 : false : s.value.enabled), w = ($, S) => {
    const p = Object.fromEntries(
      Object.keys(o).map((D) => D === $ ? [D, S] : [D, o[D]].slice())
    );
    if (l.value && !s.value.disableTimeRangeValidation) {
      const D = (F) => f.value ? v(
        {
          hours: p.hours[F],
          minutes: p.minutes[F],
          seconds: p.seconds[F]
        },
        f.value[F]
      ) : null, V = (F) => setMilliseconds(f.value[F], 0);
      return !(u(D(0), D(1)) && (isAfter(D(0), V(1)) || isBefore(D(1), V(0))));
    }
    return true;
  }, h = ($, S) => {
    w($, S) && (O($, S), e && e());
  }, _ = ($) => {
    h("hours", $);
  }, b = ($) => {
    h("minutes", $);
  }, E = ($) => {
    h("seconds", $);
  }, k = ($, S) => {
    _($.hours), b($.minutes), E($.seconds), f.value && S(f.value);
  }, g = ($) => {
    if ($) {
      const S = Array.isArray($), p = S ? [+$[0].hours, +$[1].hours] : +$.hours, D = S ? [+$[0].minutes, +$[1].minutes] : +$.minutes, V = S ? [+($[0].seconds ?? 0), +($[1].seconds ?? 0)] : +($.seconds ?? 0);
      O("hours", p), O("minutes", D), r.value.enableSeconds && O("seconds", V);
    }
  }, M = ($, S) => {
    const p = {
      hours: Array.isArray(o.hours) ? o.hours[$] : o.hours,
      disabledArr: []
    };
    return (S || S === 0) && (p.hours = S), Array.isArray(c.disabledTimes) && (p.disabledArr = s.value.enabled && Array.isArray(c.disabledTimes[$]) ? c.disabledTimes[$] : c.disabledTimes), p;
  }, R = vueExports.computed(() => ($, S) => {
    if (Array.isArray(c.disabledTimes)) {
      const { disabledArr: p, hours: D } = M($, S), V = p.filter((F) => +F.hours === D);
      return V[0]?.minutes === "*" ? { hours: [D], minutes: void 0, seconds: void 0 } : {
        hours: [],
        minutes: V?.map((F) => +F.minutes) ?? [],
        seconds: V?.map((F) => F.seconds ? +F.seconds : void 0) ?? []
      };
    }
    return { hours: [], minutes: [], seconds: [] };
  });
  return {
    assignTime: O,
    updateHours: _,
    updateMinutes: b,
    updateSeconds: E,
    getSetDateTime: B,
    updateTimeValues: k,
    getSecondsValue: P,
    assignStartTime: g,
    validateTime: w,
    disabledTimesConfig: R
  };
}, il = (e) => {
  const {
    getDate: A,
    time: f,
    modelValue: o,
    state: c,
    defaults: { startTime: s, range: r, timeConfig: u }
  } = Me(), { getTimeObj: v } = We();
  Ft(() => {
    c.isTextInputDate && M();
  });
  const { updateTimeValues: Y, getSetDateTime: P, assignTime: B, disabledTimesConfig: l, validateTime: w } = Ha(h);
  function h() {
    e("update-flow-step");
  }
  const k = (S) => Array.isArray(S) ? [v(A(S[0])), v(A(S[1]))] : [v(S ?? A())], g = (S, p, D) => {
    B("hours", S), B("minutes", p), B("seconds", u.value.enableSeconds ? D : 0);
  }, M = () => {
    const [S, p] = k(o.value);
    return r.value.enabled ? g(
      [S.hours, p.hours],
      [S.minutes, p.minutes],
      [S.seconds, p.seconds]
    ) : g(S.hours, S.minutes, S.seconds);
  };
  const R = () => {
    Array.isArray(o.value) ? o.value = o.value.map((S, p) => S && P(S, p)) : o.value = P(o.value), e("time-update");
  };
  return {
    modelValue: o,
    time: f,
    disabledTimesConfig: l,
    validateTime: w,
    updateTime: (S) => {
      Y(S, R);
    }
  };
}, cl = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TimePickerSolo",
  props: {
    flowStep: {},
    collapse: { type: Boolean },
    menuWrapRef: {},
    noOverlayFocus: { type: Boolean }
  },
  emits: ["time-update", "mount", "reset-flow", "update-flow-step"],
  setup(e, { expose: A, emit: f }) {
    const o = f, c = vueExports.useSlots(), s = lt(c, at.TimePicker), r = vueExports.useTemplateRef("time-input"), { time: u, modelValue: v, disabledTimesConfig: Y, updateTime: P, validateTime: B } = il(o);
    return A({ getSidebarProps: () => ({
      modelValue: v,
      time: u,
      updateTime: P
    }), toggleTimePicker: (w, h = false, _ = "") => {
      r.value?.toggleTimePicker(w, h, _);
    } }), (w, h) => (vueExports.openBlock(), vueExports.createBlock(aa, {
      "multi-calendars": 0,
      stretch: ""
    }, {
      default: vueExports.withCtx(({ wrapClass: _ }) => [
        vueExports.createElementVNode("div", {
          class: vueExports.normalizeClass(_)
        }, [
          vueExports.createVNode(La, vueExports.mergeProps({ ref: "time-input" }, w.$props, {
            hours: vueExports.unref(u).hours,
            minutes: vueExports.unref(u).minutes,
            seconds: vueExports.unref(u).seconds,
            "disabled-times-config": vueExports.unref(Y),
            "validate-time": vueExports.unref(B),
            "onUpdate:hours": h[0] || (h[0] = (b) => vueExports.unref(P)({ hours: b, minutes: vueExports.unref(u).minutes, seconds: vueExports.unref(u).seconds })),
            "onUpdate:minutes": h[1] || (h[1] = (b) => vueExports.unref(P)({ hours: vueExports.unref(u).hours, minutes: b, seconds: vueExports.unref(u).seconds })),
            "onUpdate:seconds": h[2] || (h[2] = (b) => vueExports.unref(P)({ hours: vueExports.unref(u).hours, minutes: vueExports.unref(u).minutes, seconds: b })),
            onResetFlow: h[3] || (h[3] = (b) => w.$emit("reset-flow"))
          }), vueExports.createSlots({ _: 2 }, [
            vueExports.renderList(vueExports.unref(s), (b, E) => ({
              name: b,
              fn: vueExports.withCtx((k) => [
                vueExports.renderSlot(w.$slots, b, vueExports.normalizeProps(vueExports.guardReactiveProps(k)))
              ])
            }))
          ]), 1040, ["hours", "minutes", "seconds", "disabled-times-config", "validate-time"])
        ], 2)
      ]),
      _: 3
    }));
  }
}), dl = (e, A) => {
  const {
    getDate: f,
    rootProps: o,
    defaults: { filters: c }
  } = Me(), { validateMonthYearInRange: s, validateMonthYear: r } = Ue(), u = (O, l) => {
    let w = O;
    return c.value.months.includes(getMonth(w)) ? (w = l ? addMonths(O, 1) : subMonths(O, 1), u(w, l)) : w;
  }, v = (O, l) => {
    let w = O;
    return c.value.years.includes(getYear(w)) ? (w = l ? addYears(O, 1) : subYears(O, 1), v(w, l)) : w;
  }, Y = (O, l = false) => {
    const w = set(f(), { month: e.month, year: e.year });
    let h = O ? addMonths(w, 1) : subMonths(w, 1);
    o.disableYearSelect && (h = setYear(h, e.year));
    let _ = getMonth(h), b = getYear(h);
    c.value.months.includes(_) && (h = u(h, O), _ = getMonth(h), b = getYear(h)), c.value.years.includes(b) && (h = v(h, O), b = getYear(h)), s(_, b, O, o.preventMinMaxNavigation) && P(_, b, l);
  }, P = (O, l, w = false) => {
    A("update-month-year", { month: O, year: l, fromNav: w });
  }, B = vueExports.computed(() => (O) => r(
    set(f(), { month: e.month, year: e.year }),
    o.preventMinMaxNavigation,
    O
  ));
  return { handleMonthYearChange: Y, isDisabled: B, updateMonthYear: P };
}, vl = { class: "dp--header-wrap" }, fl = {
  key: 0,
  class: "dp__month_year_wrap"
}, ml = { key: 0 }, pl = { class: "dp__month_year_wrap" }, hl = ["data-dp-element", "aria-label", "data-test-id", "onClick", "onKeydown"], gl = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DpHeader",
  props: {
    month: {},
    year: {},
    instance: {},
    years: {},
    months: {},
    menuWrapRef: {}
  },
  emits: ["mount", "reset-flow", "update-month-year"],
  setup(e, { expose: A, emit: f }) {
    const o = f, c = e, {
      rootEmit: s,
      rootProps: r,
      modelValue: u,
      defaults: { ariaLabels: v, filters: Y, config: P, highlight: B, safeDates: O, ui: l }
    } = Me(), { transitionName: w, showTransition: h } = Vt(), { showLeftIcon: _, showRightIcon: b } = ta(), { handleMonthYearChange: E, isDisabled: k, updateMonthYear: g } = dl(c, o), { getMaxMonth: M, getMinMonth: R, getYearFromDate: $, groupListAndMap: S, checkHighlightYear: p, checkHighlightMonth: D } = We(), { checkKeyDown: V } = Ie(), { formatYear: F } = pt(), { checkMinMaxValue: L } = Ue(), { boolHtmlAttribute: ne } = Pt(), re2 = vueExports.ref(false), X = vueExports.ref(false), x = vueExports.ref(false);
    const te = (I) => ({
      get: () => c[I],
      set: (y) => {
        const H = I === Ge.month ? Ge.year : Ge.month;
        o("update-month-year", { [I]: y, [H]: c[H] }), I === Ge.month ? le(true) : we(true);
      }
    }), q = vueExports.computed(te(Ge.month)), oe = vueExports.computed(te(Ge.year)), K = vueExports.computed(() => (I) => ({
      month: c.month,
      year: c.year,
      items: I === Ge.month ? c.months : c.years,
      instance: c.instance,
      updateMonthYear: g,
      toggle: I === Ge.month ? le : we
    })), Z = vueExports.computed(() => {
      const I = c.months.find((y) => y.value === c.month);
      return I || { text: "", value: 0 };
    }), de = vueExports.computed(() => S(c.months, (I) => {
      const y = c.month === I.value, H = L(
        I.value,
        R(c.year, O.value.minDate),
        M(c.year, O.value.maxDate)
      ) || Y.value.months.includes(I.value), fe = D(B.value, I.value, c.year);
      return { active: y, disabled: H, highlighted: fe };
    })), G = vueExports.computed(() => S(c.years, (I) => {
      const y = c.year === I.value, H = L(
        I.value,
        $(O.value.minDate),
        $(O.value.maxDate)
      ) || Y.value.years.includes(I.value), fe = p(B.value, I.value);
      return { active: y, disabled: H, highlighted: fe };
    })), ce = (I, y, H) => {
      H === void 0 ? I.value = !I.value : I.value = H, I.value ? (x.value = true, s("overlay-toggle", { open: true, overlay: y })) : (x.value = false, s("overlay-toggle", { open: false, overlay: y }));
    }, le = (I = false, y) => {
      ve(I), ce(re2, He.month, y);
    }, we = (I = false, y) => {
      ve(I), ce(X, He.year, y);
    }, ve = (I) => {
      I || o("reset-flow");
    }, Ae = vueExports.computed(() => [
      {
        type: Ge.month,
        index: 1,
        toggle: le,
        modelValue: q.value,
        updateModelValue: (I) => q.value = I,
        text: Z.value.text,
        showSelectionGrid: re2.value,
        items: de.value,
        ariaLabel: v.value?.openMonthsOverlay,
        overlayLabel: v.value.monthPicker?.(true) ?? void 0
      },
      {
        type: Ge.year,
        index: 2,
        toggle: we,
        modelValue: oe.value,
        updateModelValue: (I) => oe.value = I,
        text: F(c.year),
        showSelectionGrid: X.value,
        items: G.value,
        ariaLabel: v.value?.openYearsOverlay,
        overlayLabel: v.value.yearPicker?.(true) ?? void 0
      }
    ]), Q = vueExports.computed(() => r.disableYearSelect ? [Ae.value[0]] : r.yearFirst ? [...Ae.value].reverse() : Ae.value);
    return A({
      toggleMonthPicker: le,
      toggleYearPicker: we,
      handleMonthYearChange: E
    }), (I, y) => (vueExports.openBlock(), vueExports.createElementBlock("div", vl, [
      I.$slots["month-year"] ? (vueExports.openBlock(), vueExports.createElementBlock("div", fl, [
        vueExports.renderSlot(I.$slots, "month-year", vueExports.normalizeProps(vueExports.guardReactiveProps({
          month: e.month,
          year: e.year,
          months: e.months,
          years: e.years,
          updateMonthYear: vueExports.unref(g),
          handleMonthYearChange: vueExports.unref(E),
          instance: e.instance,
          isDisabled: vueExports.unref(k)
        })))
      ])) : (vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, { key: 1 }, [
        I.$slots["top-extra"] ? (vueExports.openBlock(), vueExports.createElementBlock("div", ml, [
          vueExports.renderSlot(I.$slots, "top-extra", { value: vueExports.unref(u) })
        ])) : vueExports.createCommentVNode("", true),
        vueExports.createElementVNode("div", pl, [
          vueExports.unref(_)(e.instance) && !vueExports.unref(r).vertical ? (vueExports.openBlock(), vueExports.createBlock(Bt, {
            key: 0,
            "aria-label": vueExports.unref(v)?.prevMonth,
            disabled: vueExports.unref(ne)(vueExports.unref(k)(false)),
            class: vueExports.normalizeClass(vueExports.unref(l)?.navBtnPrev),
            "el-name": "action-prev",
            onActivate: y[0] || (y[0] = (H) => vueExports.unref(E)(false, true))
          }, {
            default: vueExports.withCtx(() => [
              I.$slots["arrow-left"] ? vueExports.renderSlot(I.$slots, "arrow-left", { key: 0 }) : vueExports.createCommentVNode("", true),
              I.$slots["arrow-left"] ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Ca), { key: 1 }))
            ]),
            _: 3
          }, 8, ["aria-label", "disabled", "class"])) : vueExports.createCommentVNode("", true),
          vueExports.createElementVNode("div", {
            class: vueExports.normalizeClass(["dp__month_year_wrap", {
              dp__year_disable_select: vueExports.unref(r).disableYearSelect
            }])
          }, [
            (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList(Q.value, (H) => (vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, {
              key: H.type
            }, [
              vueExports.createElementVNode("button", {
                type: "button",
                "data-dp-element": `overlay-${H.type}`,
                class: vueExports.normalizeClass(["dp__btn dp__month_year_select", { "dp--hidden-el": x.value }]),
                "aria-label": `${H.text}-${H.ariaLabel}`,
                "data-test-id": `${H.type}-toggle-overlay-${e.instance}`,
                tabindex: "0",
                "data-dp-action-element": "0",
                onClick: (fe) => H.toggle(false),
                onKeydown: (fe) => vueExports.unref(V)(fe, () => H.toggle(), true)
              }, [
                I.$slots[H.type] ? vueExports.renderSlot(I.$slots, H.type, {
                  key: 0,
                  text: H.text,
                  value: c[H.type]
                }) : vueExports.createCommentVNode("", true),
                I.$slots[H.type] ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createTextVNode(vueExports.toDisplayString(H.text), 1)
                ], 64))
              ], 42, hl),
              vueExports.createVNode(vueExports.Transition, {
                name: vueExports.unref(w)(H.showSelectionGrid),
                css: vueExports.unref(h)
              }, {
                default: vueExports.withCtx(() => [
                  H.showSelectionGrid ? (vueExports.openBlock(), vueExports.createBlock(Nt, {
                    key: 0,
                    items: H.items,
                    "is-last": vueExports.unref(r).autoApply && !vueExports.unref(P).keepActionRow,
                    "skip-button-ref": false,
                    type: H.type,
                    "header-refs": [],
                    "menu-wrap-ref": e.menuWrapRef,
                    "overlay-label": H.overlayLabel,
                    onSelected: H.updateModelValue,
                    onToggle: H.toggle
                  }, vueExports.createSlots({
                    "button-icon": vueExports.withCtx(() => [
                      I.$slots["calendar-icon"] ? vueExports.renderSlot(I.$slots, "calendar-icon", { key: 0 }) : vueExports.createCommentVNode("", true),
                      I.$slots["calendar-icon"] ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Et), { key: 1 }))
                    ]),
                    _: 2
                  }, [
                    I.$slots[`${H.type}-overlay-value`] ? {
                      name: "item",
                      fn: vueExports.withCtx(({ item: fe }) => [
                        vueExports.renderSlot(I.$slots, `${H.type}-overlay-value`, {
                          text: fe.text,
                          value: fe.value
                        })
                      ]),
                      key: "0"
                    } : void 0,
                    I.$slots[`${H.type}-overlay`] ? {
                      name: "overlay",
                      fn: vueExports.withCtx(() => [
                        vueExports.renderSlot(I.$slots, `${H.type}-overlay`, vueExports.mergeProps({ ref_for: true }, K.value(H.type)))
                      ]),
                      key: "1"
                    } : void 0,
                    I.$slots[`${H.type}-overlay-header`] ? {
                      name: "header",
                      fn: vueExports.withCtx(() => [
                        vueExports.renderSlot(I.$slots, `${H.type}-overlay-header`, {
                          toggle: H.toggle
                        })
                      ]),
                      key: "2"
                    } : void 0
                  ]), 1032, ["items", "is-last", "type", "menu-wrap-ref", "overlay-label", "onSelected", "onToggle"])) : vueExports.createCommentVNode("", true)
                ]),
                _: 2
              }, 1032, ["name", "css"])
            ], 64))), 128))
          ], 2),
          vueExports.unref(_)(e.instance) && vueExports.unref(r).vertical ? (vueExports.openBlock(), vueExports.createBlock(Bt, {
            key: 1,
            "aria-label": vueExports.unref(v)?.prevMonth,
            "el-name": "action-prev",
            disabled: vueExports.unref(ne)(vueExports.unref(k)(false)),
            class: vueExports.normalizeClass(vueExports.unref(l)?.navBtnPrev),
            onActivate: y[1] || (y[1] = (H) => vueExports.unref(E)(false, true))
          }, {
            default: vueExports.withCtx(() => [
              I.$slots["arrow-up"] ? vueExports.renderSlot(I.$slots, "arrow-up", { key: 0 }) : vueExports.createCommentVNode("", true),
              I.$slots["arrow-up"] ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Ya), { key: 1 }))
            ]),
            _: 3
          }, 8, ["aria-label", "disabled", "class"])) : vueExports.createCommentVNode("", true),
          vueExports.unref(b)(e.instance) ? (vueExports.openBlock(), vueExports.createBlock(Bt, {
            key: 2,
            ref: "rightIcon",
            "el-name": "action-next",
            disabled: vueExports.unref(ne)(vueExports.unref(k)(true)),
            "aria-label": vueExports.unref(v)?.nextMonth,
            class: vueExports.normalizeClass(vueExports.unref(l)?.navBtnNext),
            onActivate: y[2] || (y[2] = (H) => vueExports.unref(E)(true, true))
          }, {
            default: vueExports.withCtx(() => [
              I.$slots[vueExports.unref(r).vertical ? "arrow-down" : "arrow-right"] ? vueExports.renderSlot(I.$slots, vueExports.unref(r).vertical ? "arrow-down" : "arrow-right", { key: 0 }) : vueExports.createCommentVNode("", true),
              I.$slots[vueExports.unref(r).vertical ? "arrow-down" : "arrow-right"] ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createBlock(vueExports.resolveDynamicComponent(vueExports.unref(r).vertical ? vueExports.unref(Ba) : vueExports.unref(xa)), { key: 1 }))
            ]),
            _: 3
          }, 8, ["disabled", "aria-label", "class"])) : vueExports.createCommentVNode("", true)
        ])
      ], 64))
    ]));
  }
}), yl = {
  class: "dp__calendar_header",
  role: "row"
}, bl = {
  key: 0,
  class: "dp__calendar_header_item",
  role: "gridcell"
}, kl = ["aria-label"], wl = {
  key: 0,
  class: "dp__calendar_item dp__week_num",
  role: "gridcell"
}, Dl = { class: "dp__cell_inner" }, Ml = ["id", "aria-selected", "aria-disabled", "aria-label", "tabindex", "data-test-id", "data-dp-element-active", "onClick", "onTouchend", "onKeydown", "onMouseenter", "onMouseleave", "onMousedown"], _l = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DpCalendar",
  props: {
    instance: {},
    mappedDates: {},
    month: {},
    year: {}
  },
  emits: ["mount", "select-date", "set-hover-date", "handle-scroll", "handle-swipe"],
  setup(e, { expose: A, emit: f }) {
    const o = f, c = e, {
      getDate: s,
      rootEmit: r,
      rootProps: u,
      defaults: { transitions: v, config: Y, ariaLabels: P, multiCalendars: B, weekNumbers: O, multiDates: l, ui: w }
    } = Me(), { isDateAfter: h, isDateEqual: _, resetDateTime: b, getCellId: E } = We(), { checkKeyDown: k, checkStopPropagation: g, isTouchDevice: M } = Ie(), { formatWeekDay: R } = pt(), $ = vueExports.useTemplateRef("calendar-wrap"), S = vueExports.useTemplateRef("active-tooltip"), p = vueExports.ref([]), D = vueExports.ref(null), V = vueExports.ref(true), F = vueExports.ref(false), L = vueExports.ref(""), ne = vueExports.ref({
      bottom: "",
      left: "",
      transform: ""
    }), re2 = vueExports.ref({ left: "50%" });
    useSwipe($, {
      onSwipeEnd: (d, a) => {
        Y.value.noSwipe || (u.vertical ? (a === "up" || a === "down") && o("handle-swipe", a === "up" ? "left" : "right") : (a === "left" || a === "right") && o("handle-swipe", a === "right" ? "left" : "right"));
      }
    });
    const X = vueExports.computed(() => u.calendar ? u.calendar(c.mappedDates) : c.mappedDates), x = vueExports.computed(() => u.dayNames ? Array.isArray(u.dayNames) ? u.dayNames : u.dayNames() : i());
    const te = (d) => d ? u.vertical ? "vNext" : "next" : u.vertical ? "vPrevious" : "previous", q = (d, a) => {
      if (u.transitions) {
        const n = b(set(s(), { month: c.month, year: c.year }));
        L.value = h(b(set(s(), { month: d, year: a })), n) ? v.value[te(true)] : v.value[te(false)], V.value = false, vueExports.nextTick(() => {
          V.value = true;
        });
      }
    }, oe = vueExports.computed(
      () => ({
        ...w.value.calendar
      })
    ), K = (d) => ({ type: "dot", ...d }), Z = vueExports.computed(() => (d) => {
      const a = K(d);
      return {
        dp__marker_dot: a.type === "dot",
        dp__marker_line: a.type === "line"
      };
    }), de = vueExports.computed(() => (d) => _(d, D.value)), G = vueExports.computed(() => ({
      dp__calendar: true,
      dp__calendar_next: B.value.count > 0 && c.instance !== 0
    })), ce = vueExports.computed(() => (d) => u.hideOffsetDates ? d.current : true), le = async (d, a) => {
      const { width: n, height: C } = d.getBoundingClientRect();
      D.value = a.value;
      let m = { left: `${n / 2}px` }, N = -50;
      if (await vueExports.nextTick(), S.value?.[0]) {
        const { left: U, width: pe } = S.value[0].getBoundingClientRect();
        U < 0 && (m = { left: "0" }, N = 0, re2.value.left = `${n / 2}px`), globalThis.innerWidth < U + pe && (m = { right: "0" }, N = 0, re2.value.left = `${pe - n / 2}px`);
      }
      ne.value = {
        bottom: `${C}px`,
        ...m,
        transform: `translateX(${N}%)`
      };
    }, we = async (d, a, n) => {
      const C = unrefElement(p.value?.[a]?.[n]);
      C && (d.marker?.customPosition && d.marker?.tooltip?.length ? ne.value = d.marker.customPosition(C) : await le(C, d), r("tooltip-open", d.marker));
    }, ve = async (d, a, n) => {
      if (F.value && l.value.enabled && l.value.dragSelect)
        return o("select-date", d);
      if (o("set-hover-date", d), d.marker?.tooltip?.length) {
        if (u.hideOffsetDates && !d.current) return;
        await we(d, a, n);
      }
    }, Ae = (d) => {
      D.value && (D.value = null, ne.value = structuredClone({ bottom: "", left: "", transform: "" }), r("tooltip-close", d.marker));
    }, Q = (d, a, n) => {
      d && (Array.isArray(p.value[a]) ? p.value[a][n] = d : p.value[a] = [d]);
    }, y = (d) => O.value ? O.value.type === "local" ? getWeek(d.value, {
      weekStartsOn: +u.weekStart,
      locale: u.locale
    }) : O.value.type === "iso" ? getISOWeek(d.value) : typeof O.value.type == "function" ? O.value.type(d.value) : "" : "", H = (d) => {
      const a = d[0];
      return O.value?.hideOnOffsetDates ? d.some((n) => n.current) ? y(a) : "" : y(a);
    }, fe = (d, a, n = true) => {
      !n && M() || (!l.value.enabled || Y.value.allowPreventDefault) && (g(d, Y.value), o("select-date", a));
    }, Pe = (d) => {
      g(d, Y.value);
    }, Ce = (d) => {
      l.value.enabled && l.value.dragSelect ? (F.value = true, o("select-date", d)) : l.value.enabled && o("select-date", d);
    }, i = () => {
      const d = s(), a = startOfWeek(d, { locale: u.locale, weekStartsOn: +u.weekStart }), n = endOfWeek(d, { locale: u.locale, weekStartsOn: +u.weekStart });
      return eachDayOfInterval({ start: a, end: n }).map((m) => R(m));
    };
    return A({ triggerTransition: q }), (d, a) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
      class: vueExports.normalizeClass(G.value)
    }, [
      vueExports.createElementVNode("div", {
        ref: "calendar-wrap",
        class: vueExports.normalizeClass(oe.value),
        role: "grid"
      }, [
        vueExports.createElementVNode("div", yl, [
          vueExports.unref(O) ? (vueExports.openBlock(), vueExports.createElementBlock("div", bl, vueExports.toDisplayString(vueExports.unref(O).label), 1)) : vueExports.createCommentVNode("", true),
          (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList(x.value, (n, C) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
            key: C,
            class: "dp__calendar_header_item",
            role: "gridcell",
            "data-test-id": "calendar-header",
            "aria-label": vueExports.unref(P)?.weekDay?.(C)
          }, [
            vueExports.renderSlot(d.$slots, "calendar-header", {
              day: n,
              index: C
            }, () => [
              vueExports.createTextVNode(vueExports.toDisplayString(n), 1)
            ])
          ], 8, kl))), 128))
        ]),
        a[2] || (a[2] = vueExports.createElementVNode("div", { class: "dp__calendar_header_separator" }, null, -1)),
        vueExports.createVNode(vueExports.Transition, {
          name: L.value,
          css: !!vueExports.unref(v)
        }, {
          default: vueExports.withCtx(() => [
            V.value ? (vueExports.openBlock(), vueExports.createElementBlock("div", {
              key: 0,
              class: "dp__calendar",
              role: "rowgroup",
              onMouseleave: a[1] || (a[1] = (n) => F.value = false)
            }, [
              (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList(X.value, (n, C) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
                key: C,
                class: "dp__calendar_row",
                role: "row"
              }, [
                vueExports.unref(O) ? (vueExports.openBlock(), vueExports.createElementBlock("div", wl, [
                  vueExports.createElementVNode("div", Dl, vueExports.toDisplayString(H(n.days)), 1)
                ])) : vueExports.createCommentVNode("", true),
                (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList(n.days, (m, N) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
                  id: vueExports.unref(E)(m.value),
                  ref_for: true,
                  ref: (U) => Q(U, C, N),
                  key: N + C,
                  role: "gridcell",
                  class: "dp__calendar_item",
                  "aria-selected": (m.classData.dp__active_date || m.classData.dp__range_start || m.classData.dp__range_end) ?? void 0,
                  "aria-disabled": m.classData.dp__cell_disabled || void 0,
                  "aria-label": vueExports.unref(P)?.day?.(m),
                  tabindex: !m.current && vueExports.unref(u).hideOffsetDates ? void 0 : 0,
                  "data-test-id": vueExports.unref(E)(m.value),
                  "data-dp-element-active": m.classData.dp__active_date ? 0 : void 0,
                  "data-dp-action-element": "0",
                  onClick: vueExports.withModifiers((U) => fe(U, m), ["prevent"]),
                  onTouchend: (U) => fe(U, m, false),
                  onKeydown: (U) => vueExports.unref(k)(U, () => d.$emit("select-date", m)),
                  onMouseenter: (U) => ve(m, C, N),
                  onMouseleave: (U) => Ae(m),
                  onMousedown: (U) => Ce(m),
                  onMouseup: a[0] || (a[0] = (U) => F.value = false)
                }, [
                  vueExports.createElementVNode("div", {
                    class: vueExports.normalizeClass(["dp__cell_inner", m.classData])
                  }, [
                    d.$slots.day && ce.value(m) ? vueExports.renderSlot(d.$slots, "day", {
                      key: 0,
                      day: +m.text,
                      date: m.value
                    }) : vueExports.createCommentVNode("", true),
                    d.$slots.day ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, { key: 1 }, [
                      vueExports.createTextVNode(vueExports.toDisplayString(m.text), 1)
                    ], 64)),
                    m.marker && ce.value(m) ? vueExports.renderSlot(d.$slots, "marker", {
                      key: 2,
                      marker: m.marker,
                      day: +m.text,
                      date: m.value
                    }, () => [
                      vueExports.createElementVNode("div", {
                        class: vueExports.normalizeClass(Z.value(m.marker)),
                        style: vueExports.normalizeStyle(m.marker.color ? { backgroundColor: m.marker.color } : {})
                      }, null, 6)
                    ]) : vueExports.createCommentVNode("", true),
                    de.value(m.value) ? (vueExports.openBlock(), vueExports.createElementBlock("div", {
                      key: 3,
                      ref_for: true,
                      ref: "active-tooltip",
                      class: "dp__marker_tooltip",
                      style: vueExports.normalizeStyle(ne.value)
                    }, [
                      m.marker?.tooltip ? (vueExports.openBlock(), vueExports.createElementBlock("div", {
                        key: 0,
                        class: "dp__tooltip_content",
                        onClick: Pe
                      }, [
                        (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList(m.marker.tooltip, (U, pe) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
                          key: pe,
                          class: "dp__tooltip_text"
                        }, [
                          vueExports.renderSlot(d.$slots, "marker-tooltip", {
                            tooltip: U,
                            day: m.value
                          }, () => [
                            vueExports.createElementVNode("div", {
                              class: "dp__tooltip_mark",
                              style: vueExports.normalizeStyle(U.color ? { backgroundColor: U.color } : {})
                            }, null, 4),
                            vueExports.createElementVNode("div", null, vueExports.toDisplayString(U.text), 1)
                          ])
                        ]))), 128)),
                        vueExports.createElementVNode("div", {
                          class: "dp__arrow_bottom_tp",
                          style: vueExports.normalizeStyle(re2.value)
                        }, null, 4)
                      ])) : vueExports.createCommentVNode("", true)
                    ], 4)) : vueExports.createCommentVNode("", true)
                  ], 2)
                ], 40, Ml))), 128))
              ]))), 128))
            ], 32)) : vueExports.createCommentVNode("", true)
          ]),
          _: 3
        }, 8, ["name", "css"])
      ], 2)
    ], 2));
  }
}), Al = (e, A, f, o) => {
  const c = vueExports.ref([]), s = vueExports.ref(/* @__PURE__ */ new Date()), r = vueExports.ref(), {
    getDate: u,
    rootEmit: v,
    calendars: Y,
    month: P,
    year: B,
    time: O,
    modelValue: l,
    rootProps: w,
    today: h,
    state: _,
    defaults: { multiCalendars: b, startTime: E, range: k, config: g, safeDates: M, multiDates: R, timeConfig: $, flow: S }
  } = Me(), { validateMonthYearInRange: p, isDisabled: D, isDateRangeAllowed: V, checkMinMaxRange: F } = Ue(), { updateTimeValues: L, getSetDateTime: ne, assignTime: re2, assignStartTime: X, validateTime: x, disabledTimesConfig: te } = Ha(o), { formatDay: q } = pt(), { resetDateTime: oe, setTime: K, isDateBefore: Z, isDateEqual: de, getDaysInBetween: G } = We(), { checkRangeAutoApply: ce, getRangeWithFixedDate: le, handleMultiDatesSelect: we, setPresetDate: ve } = na(), { getMapDate: Ae } = Ie();
  Ft(() => Ce(_.isTextInputDate));
  const Q = (T) => !g.value.keepViewOnOffsetClick || T ? true : !r.value, I = (T, z, ue, ke = false) => {
    Q(ke) && (Y.value[T] ??= Y.value[T] = { month: 0, year: 0 }, Y.value[T].month = z ?? Y.value[T]?.month, Y.value[T].year = ue ?? Y.value[T]?.year);
  }, y = () => {
    w.autoApply && A("select-date");
  }, H = () => {
    E.value && X(E.value);
  };
  const fe = vueExports.computed(() => S.value?.steps?.length && !S.value?.partial ? e.flowStep === S.value.steps.length : true), Pe = () => {
    w.autoApply && fe.value && A("auto-apply", S.value?.partial ? e.flowStep !== S.value?.steps?.length : false);
  }, Ce = (T = false) => {
    if (l.value)
      return Array.isArray(l.value) ? (c.value = l.value, U(T)) : n(l.value, T);
    if (b.value.count && T && !w.startDate)
      return a(u(), T);
  }, i = () => Array.isArray(l.value) && k.value.enabled ? getMonth(l.value[0]) === getMonth(l.value[1] ?? l.value[0]) : false, d = (T) => {
    const z = addMonths(T, 1);
    return { month: getMonth(z), year: getYear(z) };
  }, a = (T = u(), z = false) => {
    if ((!b.value.count || !b.value.static || z) && I(0, getMonth(T), getYear(T)), b.value.count && (!l.value || i() || !b.value.solo) && (!b.value.solo || z))
      for (let ue = 1; ue < b.value.count; ue++) {
        const ke = set(u(), { month: P.value(ue - 1), year: B.value(ue - 1) }), Oe = add(ke, { months: 1 });
        Y.value[ue] = { month: getMonth(Oe), year: getYear(Oe) };
      }
  }, n = (T, z) => {
    a(T), re2("hours", getHours(T)), re2("minutes", getMinutes(T)), re2("seconds", getSeconds(T)), b.value.count && z && Qe();
  }, C = (T) => {
    if (b.value.count) {
      if (b.value.solo) return 0;
      const z = getMonth(T[0]), ue = getMonth(T[1]);
      return Math.abs(ue - z) < b.value.count ? 0 : 1;
    }
    return 1;
  }, m = (T, z) => {
    T[1] && k.value.showLastInRange ? a(T[C(T)], z) : a(T[0], z);
    const ue = (ke, Oe) => [
      ke(T[0]),
      T?.[1] ? ke(T[1]) : O[Oe][1]
    ];
    re2("hours", ue(getHours, "hours")), re2("minutes", ue(getMinutes, "minutes")), re2("seconds", ue(getSeconds, "seconds"));
  }, N = (T, z) => {
    if ((k.value.enabled || w.weekPicker) && !R.value.enabled)
      return m(T, z);
    if (R.value.enabled && z) {
      const ue = T[T.length - 1];
      return n(ue, z);
    }
  }, U = (T) => {
    const z = l.value;
    N(z, T), b.value.count && b.value.solo && Qe();
  }, pe = (T, z) => {
    const ue = set(u(), { month: P.value(z), year: B.value(z) }), ke = T < 0 ? addMonths(ue, 1) : subMonths(ue, 1);
    p(getMonth(ke), getYear(ke), T < 0, w.preventMinMaxNavigation) && (I(z, getMonth(ke), getYear(ke)), v("update-month-year", { instance: z, month: getMonth(ke), year: getYear(ke) }), b.value.count && !b.value.solo && ge(z), f());
  }, ge = (T) => {
    for (let z = T - 1; z >= 0; z--) {
      const ue = subMonths(set(u(), { month: P.value(z + 1), year: B.value(z + 1) }), 1);
      I(z, getMonth(ue), getYear(ue));
    }
    for (let z = T + 1; z <= b.value.count - 1; z++) {
      const ue = addMonths(set(u(), { month: P.value(z - 1), year: B.value(z - 1) }), 1);
      I(z, getMonth(ue), getYear(ue));
    }
  }, Qe = () => {
    if (Array.isArray(l.value) && l.value.length === 2) {
      const T = u(u(l.value[1] ?? addMonths(l.value[0], 1))), [z, ue] = [getMonth(l.value[0]), getYear(l.value[0])], [ke, Oe] = [getMonth(l.value[1]), getYear(l.value[1])];
      (z !== ke || z === ke && ue !== Oe) && b.value.solo && I(1, getMonth(T), getYear(T));
    } else l.value && !Array.isArray(l.value) && (I(0, getMonth(l.value), getYear(l.value)), a(u()));
  }, Wt = (T, z) => {
    if (g.value.monthChangeOnScroll) {
      const ue = Date.now() - s.value.getTime(), ke = Math.abs(T.deltaY);
      let Oe = 500;
      ke > 1 && (Oe = 100), ke > 100 && (Oe = 0), ue > Oe && (s.value = /* @__PURE__ */ new Date(), pe(
        g.value.monthChangeOnScroll === "inverse" ? T.deltaY : -T.deltaY,
        z
      ));
    }
  }, ra = (T, z, ue = false) => {
    g.value.monthChangeOnArrows && w.vertical === ue && Lt(T, z);
  }, Lt = (T, z) => {
    pe(T === "right" ? -1 : 1, z);
  }, la = (T) => {
    if (M.value.markers)
      return Ae(T.value, M.value.markers);
  }, oa = (T, z) => {
    switch (w.sixWeeks === true ? "append" : w.sixWeeks) {
      case "prepend":
        return [true, false];
      case "center":
        return [T == 0, true];
      case "fair":
        return [T == 0 || z > T, true];
      case "append":
        return [false, false];
      default:
        return [false, false];
    }
  }, sa = (T, z, ue, ke) => {
    if (w.sixWeeks && T.length < 6) {
      const Oe = 6 - T.length, ct = (z.getDay() + 7 - ke) % 7, Kt = 6 - (ue.getDay() + 7 - ke) % 7, [Ct, da] = oa(ct, Kt);
      for (let gt = 1; gt <= Oe; gt++)
        if (da ? !!(gt % 2) == Ct : Ct) {
          const zt = T[0].days[0], va = $t(addDays(zt.value, -7), getMonth(z));
          T.unshift({ days: va });
        } else {
          const zt = T[T.length - 1], va = zt.days[zt.days.length - 1], en = $t(addDays(va.value, 1), getMonth(z));
          T.push({ days: en });
        }
    }
    return T;
  }, $t = (T, z) => {
    const ue = u(T), ke = [];
    for (let Oe = 0; Oe < 7; Oe++) {
      const ct = addDays(ue, Oe), Rt = getMonth(ct) !== z;
      ke.push({
        text: w.hideOffsetDates && Rt ? "" : q(ct),
        value: ct,
        current: !Rt,
        classData: {}
      });
    }
    return ke;
  }, ua = (T, z) => {
    const ue = [], ke = u(new Date(z, T)), Oe = u(new Date(z, T + 1, 0)), ct = w.weekStart, Rt = startOfWeek(ke, { weekStartsOn: ct }), Kt = (Ct) => {
      const da = $t(Ct, T);
      if (ue.push({ days: da }), !ue[ue.length - 1].days.some((gt) => de(u(gt.value), oe(Oe)))) {
        const gt = addDays(Ct, 7);
        Kt(gt);
      }
    };
    return Kt(Rt), sa(ue, ke, Oe, ct);
  }, ia = (T) => {
    const z = K(
      { hours: O.hours, minutes: O.minutes, seconds: jt() },
      u(T.value)
    );
    v("date-click", z), R.value.enabled ? we(z, R.value.limit) : l.value = z, o(), vueExports.nextTick().then(() => {
      Pe();
    });
  }, Ht = (T) => k.value.noDisabledRange ? G(c.value[0], T).some((ue) => D(ue)) : false, se = () => {
    c.value = l.value ? l.value.slice().filter((T) => !!T) : [], c.value.length === 2 && !(k.value.fixedStart || k.value.fixedEnd) && (c.value = []);
  }, Le = (T, z) => {
    const ue = [u(T.value), addDays(u(T.value), +k.value.autoRange)];
    V(ue) ? (z && Je(T.value), c.value = ue) : v("invalid-date", T.value);
  }, Je = (T) => {
    const z = getMonth(u(T)), ue = getYear(u(T));
    if (I(0, z, ue), b.value.count > 0)
      for (let ke = 1; ke < b.value.count; ke++) {
        const Oe = d(
          set(u(T), { year: B.value(ke - 1), month: P.value(ke - 1) })
        );
        I(ke, Oe.month, Oe.year);
      }
  }, St = (T) => {
    if (Ht(T.value) || !F(T.value, l.value, k.value.fixedStart ? 0 : 1))
      return v("invalid-date", T.value);
    c.value = le(u(T.value));
  }, ht = (T, z) => {
    if (se(), k.value.autoRange) return Le(T, z);
    if (k.value.fixedStart || k.value.fixedEnd) return St(T);
    c.value[0] ? F(u(T.value), l.value) && !Ht(T.value) ? Z(u(T.value), u(c.value[0])) ? k.value.autoSwitchStartEnd ? (c.value.unshift(u(T.value)), v("range-end", c.value[0])) : (c.value[0] = u(T.value), v("range-start", c.value[0])) : (c.value[1] = u(T.value), v("range-end", c.value[1])) : v("invalid-date", T.value) : (c.value[0] = u(T.value), v("range-start", c.value[0]));
  }, jt = (T = true) => $.value.enableSeconds ? Array.isArray(O.seconds) ? T ? O.seconds[0] : O.seconds[1] : O.seconds : 0, ca = (T) => {
    c.value[T] = K(
      {
        hours: O.hours[T],
        minutes: O.minutes[T],
        seconds: jt(T !== 1)
      },
      c.value[T]
    );
  }, ja = () => {
    c.value[0] && c.value[1] && +c.value?.[0] > +c.value?.[1] && (c.value.reverse(), v("range-start", c.value[0]), v("range-end", c.value[1]));
  }, Ka = () => {
    c.value.length && (c.value[0] && !c.value[1] ? ca(0) : (ca(0), ca(1), o()), ja(), l.value = c.value.slice(), ce(
      c.value,
      A,
      c.value.length < 2 || S.value?.steps.length ? e.flowStep !== S.value?.steps?.length : false
    ));
  }, za = (T, z = false) => {
    if (D(T.value) || !T.current && w.hideOffsetDates)
      return v("invalid-date", T.value);
    if (r.value = structuredClone(T), !k.value.enabled) return ia(T);
    Array.isArray(O.hours) && Array.isArray(O.minutes) && !R.value.enabled && (ht(T, z), Ka());
  }, qa = (T, z) => {
    I(T, z.month, z.year, true), b.value.count && !b.value.solo && ge(T), v("update-month-year", { instance: T, month: z.month, year: z.year }), f(b.value.solo ? T : void 0);
    const ue = S.value?.steps?.length ? S.value.steps[e.flowStep] : void 0;
    !z.fromNav && (ue === He.month || ue === He.year) && o();
  }, Ua = (T) => {
    ve({
      value: T
    }), y(), w.multiCalendars && vueExports.nextTick().then(() => Ce(true));
  }, Qa = () => {
    let T = u();
    return w.actionRow?.nowBtnRound && (T = roundToNearestMinutes(T, {
      roundingMethod: w.actionRow.nowBtnRound.rounding ?? "ceil",
      nearestTo: w.actionRow.nowBtnRound.roundTo ?? 15
    })), T;
  }, Ja = () => {
    const T = Qa();
    !k.value.enabled && !R.value.enabled ? l.value = T : l.value && Array.isArray(l.value) && l.value[0] ? R.value.enabled ? l.value = [...l.value, T] : l.value = Z(T, l.value[0]) ? [T, l.value[0]] : [l.value[0], T] : l.value = [T], y();
  }, Ga = () => {
    if (Array.isArray(l.value))
      if (R.value.enabled) {
        const T = Xa();
        l.value[l.value.length - 1] = ne(T);
      } else
        l.value = l.value.map((T, z) => T && ne(T, z));
    else
      l.value = ne(l.value);
    A("time-update");
  }, Xa = () => Array.isArray(l.value) && l.value.length ? l.value[l.value.length - 1] : null, Za = (T) => {
    let z = "";
    if (k.value.enabled && Array.isArray(l.value))
      for (const ue of Object.keys(T)) {
        const ke = T[ue];
        Array.isArray(ke) && (O[ue][0] !== ke[0] && (z = "range-start"), O[ue][1] !== ke[1] && (z = "range-start"));
      }
    return z;
  };
  return {
    calendars: Y,
    modelValue: l,
    month: P,
    year: B,
    time: O,
    disabledTimesConfig: te,
    today: h,
    validateTime: x,
    getCalendarDays: ua,
    getMarker: la,
    handleScroll: Wt,
    handleSwipe: Lt,
    handleArrow: ra,
    selectDate: za,
    updateMonthYear: qa,
    presetDate: Ua,
    selectCurrentDate: Ja,
    updateTime: (T) => {
      const z = Za(T);
      L(T, Ga), z && v(z, l.value[z === "range-start" ? 0 : 1]);
    },
    assignMonthAndYear: a,
    setStartTime: H
  };
}, Pl = () => {
  const {
    isModelAuto: e,
    matchDate: A,
    isDateAfter: f,
    isDateBefore: o,
    isDateBetween: c,
    isDateEqual: s,
    getWeekFromDate: r,
    getBeforeAndAfterInRange: u
  } = We(), {
    getDate: v,
    today: Y,
    rootProps: P,
    defaults: { multiCalendars: B, multiDates: O, ui: l, highlight: w, safeDates: h, range: _ },
    modelValue: b
  } = Me(), { isDisabled: E } = Ue(), k = vueExports.ref(null), g = (a) => {
    !a.current && P.hideOffsetDates || (k.value = a.value);
  }, M = () => {
    k.value = null;
  }, R = (a) => Array.isArray(b.value) && _.value.enabled && b.value[0] && k.value ? a ? f(k.value, b.value[0]) : o(k.value, b.value[0]) : true, $ = (a, n) => {
    const C = () => b.value ? n ? b.value[0] || null : b.value[1] : null, m = b.value && Array.isArray(b.value) ? C() : null;
    return s(v(a.value), m);
  }, S = (a) => {
    const n = Array.isArray(b.value) ? b.value[0] : null;
    return a ? !o(k.value, n) : true;
  }, p = (a, n = true) => (_.value.enabled || P.weekPicker) && Array.isArray(b.value) && b.value.length === 2 ? P.hideOffsetDates && !a.current ? false : s(v(a.value), b.value[n ? 0 : 1]) : _.value.enabled ? $(a, n) && S(n) || s(a.value, Array.isArray(b.value) ? b.value[0] : null) && R(n) : false, D = (a, n) => {
    if (Array.isArray(b.value) && b.value[0] && b.value.length === 1) {
      const C = s(a.value, k.value);
      return n ? f(b.value[0], a.value) && C : o(b.value[0], a.value) && C;
    }
    return false;
  }, V = (a) => !b.value || P.hideOffsetDates && !a.current ? false : _.value.enabled ? P.modelAuto && Array.isArray(b.value) ? s(a.value, b.value[0] ?? Y) : false : O.value.enabled && Array.isArray(b.value) ? b.value.some((n) => s(n, a.value)) : s(a.value, b.value ? b.value : Y), F = (a) => {
    if (_.value.autoRange || P.weekPicker) {
      if (k.value) {
        if (P.hideOffsetDates && !a.current) return false;
        const n = addDays(k.value, +_.value.autoRange), C = r(v(k.value), P.weekStart);
        return P.weekPicker ? s(C[1], v(a.value)) : s(n, v(a.value));
      }
      return false;
    }
    return false;
  }, L = (a) => {
    if (_.value.autoRange || P.weekPicker) {
      if (k.value) {
        const n = addDays(k.value, +_.value.autoRange);
        if (P.hideOffsetDates && !a.current) return false;
        const C = r(v(k.value), P.weekStart);
        return P.weekPicker ? f(a.value, C[0]) && o(a.value, C[1]) : f(a.value, k.value) && o(a.value, n);
      }
      return false;
    }
    return false;
  }, ne = (a) => {
    if (_.value.autoRange || P.weekPicker) {
      if (k.value) {
        if (P.hideOffsetDates && !a.current) return false;
        const n = r(v(k.value), P.weekStart);
        return P.weekPicker ? s(n[0], a.value) : s(k.value, a.value);
      }
      return false;
    }
    return false;
  }, re2 = (a) => c(b.value, k.value, a.value), X = () => P.modelAuto && Array.isArray(b.value) ? !!b.value[0] : false, x = () => P.modelAuto ? e(b.value) : true, te = (a) => {
    if (P.weekPicker) return false;
    const n = _.value.enabled ? !p(a) && !p(a, false) : true;
    return !E(a.value) && !V(a) && !(!a.current && P.hideOffsetDates) && n;
  }, q = (a) => _.value.enabled ? P.modelAuto ? X() && V(a) : false : V(a), oe = (a) => w.value ? A(a.value, h.value.highlight) : false, K = (a) => {
    const n = E(a.value);
    return n && (typeof w.value == "function" ? !w.value(a.value, n) : !w.value.options.highlightDisabled);
  }, Z = (a) => typeof w.value == "function" ? w.value(a.value) : w.value.weekdays?.includes(a.value.getDay()), de = (a) => (_.value.enabled || P.weekPicker) && (!(B.value.count > 0) || a.current) && x() && !(!a.current && P.hideOffsetDates) && !V(a) ? re2(a) : false, G = (a) => {
    if (Array.isArray(b.value) && b.value.length === 1) {
      const { before: n, after: C } = u(+_.value.maxRange, b.value[0]);
      return isBefore(a.value, n) || isAfter(a.value, C);
    }
    return false;
  }, ce = (a) => {
    if (Array.isArray(b.value) && b.value.length === 1) {
      const { before: n, after: C } = u(+_.value.minRange, b.value[0]);
      return c([n, C], b.value[0], a.value);
    }
    return false;
  }, le = (a) => _.value.enabled && (_.value.maxRange || _.value.minRange) ? _.value.maxRange && _.value.minRange ? G(a) || ce(a) : _.value.maxRange ? G(a) : ce(a) : false, we = (a) => {
    const { isRangeStart: n, isRangeEnd: C } = I(a), m = _.value.enabled ? n || C : false;
    return {
      dp__cell_offset: !a.current,
      dp__pointer: !P.disabled && !(!a.current && P.hideOffsetDates) && !E(a.value) && !le(a),
      dp__cell_disabled: E(a.value) || le(a),
      dp__cell_highlight: !K(a) && (oe(a) || Z(a)) && !q(a) && !m && !ne(a) && !(de(a) && P.weekPicker) && !C,
      dp__cell_highlight_active: !K(a) && (oe(a) || Z(a)) && q(a),
      dp__today: !P.noToday && s(a.value, Y) && a.current,
      "dp--past": o(a.value, Y),
      "dp--future": f(a.value, Y)
    };
  }, ve = (a) => ({
    dp__active_date: q(a),
    dp__date_hover: te(a)
  }), Ae = (a) => {
    if (b.value && !Array.isArray(b.value)) {
      const n = r(b.value, P.weekStart);
      return {
        ...Ce(a),
        dp__range_start: s(n[0], a.value),
        dp__range_end: s(n[1], a.value),
        dp__range_between_week: f(a.value, n[0]) && o(a.value, n[1])
      };
    }
    return {
      ...Ce(a)
    };
  }, Q = (a) => {
    if (b.value && Array.isArray(b.value)) {
      const n = r(b.value[0], P.weekStart), C = b.value[1] ? r(b.value[1], P.weekStart) : [];
      return {
        ...Ce(a),
        dp__range_start: s(n[0], a.value) || s(C[0], a.value),
        dp__range_end: s(n[1], a.value) || s(C[1], a.value),
        dp__range_between_week: f(a.value, n[0]) && o(a.value, n[1]) || f(a.value, C[0]) && o(a.value, C[1]),
        dp__range_between: f(a.value, n[1]) && o(a.value, C[0])
      };
    }
    return {
      ...Ce(a)
    };
  }, I = (a) => {
    const n = B.value.count > 0 ? a.current && p(a) && x() : p(a) && x(), C = B.value.count > 0 ? a.current && p(a, false) && x() : p(a, false) && x();
    return { isRangeStart: n, isRangeEnd: C };
  }, y = (a) => _.value.enabled && (_.value.fixedStart || _.value.fixedEnd) && Array.isArray(b.value) && b.value.length === 2, H = (a, n, C, m) => !y(b.value) || !k.value ? false : n ? _.value.fixedEnd && s(a.value, k.value) && isBefore(a.value, b.value[0]) && !C : _.value.fixedStart && s(a.value, k.value) && isAfter(a.value, b.value[1]) && !m, fe = (a, n) => !y(b.value) || !k.value ? false : n ? _.value.fixedEnd && isAfter(a.value, k.value) && isBefore(a.value, b.value[0]) : _.value.fixedStart && isBefore(a.value, k.value) && isAfter(a.value, b.value[1]), Pe = (a) => {
    const { isRangeStart: n, isRangeEnd: C } = I(a);
    return {
      dp__range_start: n,
      dp__range_end: C,
      dp__range_between: de(a),
      dp__date_hover: s(a.value, k.value) && !n && !C && !P.weekPicker,
      dp__date_hover_start: D(a, true) || H(a, true, n, C),
      dp__date_hover_end: D(a, false) || H(a, false, n, C),
      "dp--extended-fixed-start": fe(a, true),
      "dp--extended-fixed-end": fe(a, false)
    };
  }, Ce = (a) => ({
    ...Pe(a),
    dp__cell_auto_range: L(a),
    dp__cell_auto_range_start: ne(a),
    dp__cell_auto_range_end: F(a)
  }), i = (a) => _.value.enabled ? _.value.autoRange ? Ce(a) : P.modelAuto ? { ...ve(a), ...Pe(a) } : P.weekPicker ? Q(a) : Pe(a) : P.weekPicker ? Ae(a) : ve(a);
  return {
    setHoverDate: g,
    clearHoverDate: M,
    getDayClassData: (a) => P.hideOffsetDates && !a.current ? {} : {
      ...we(a),
      ...i(a),
      [l.value.dayClass ? l.value.dayClass(a.value, b.value) : ""]: true,
      ...l.value.calendarCell
    }
  };
}, Tl = { key: 0 }, $l = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DatePicker",
  props: /* @__PURE__ */ vueExports.mergeDefaults({
    flowStep: {},
    collapse: { type: Boolean },
    menuWrapRef: {},
    noOverlayFocus: { type: Boolean }
  }, Ar),
  emits: ["mount", "update-flow-step", "reset-flow", "focus-menu", "select-date", "time-update", "auto-apply"],
  setup(e, { expose: A, emit: f }) {
    const o = f, c = e, {
      month: s,
      year: r,
      modelValue: u,
      time: v,
      disabledTimesConfig: Y,
      today: P,
      validateTime: B,
      getCalendarDays: O,
      getMarker: l,
      handleArrow: w,
      handleScroll: h,
      handleSwipe: _,
      selectDate: b,
      updateMonthYear: E,
      presetDate: k,
      selectCurrentDate: g,
      updateTime: M,
      assignMonthAndYear: R,
      setStartTime: $
    } = Al(c, o, ve, Ae), S = vueExports.useSlots(), { setHoverDate: p, getDayClassData: D, clearHoverDate: V } = Pl(), {
      getDate: F,
      rootEmit: L,
      rootProps: ne,
      defaults: { multiCalendars: re2, timeConfig: X }
    } = Me(), { getYears: x, getMonths: te } = ea(), { getCellId: q } = We(), oe = vueExports.useTemplateRef("calendar-header"), K = vueExports.useTemplateRef("calendar"), Z = vueExports.useTemplateRef("time-picker"), de = lt(S, at.Calendar), G = lt(S, at.DatePickerHeader), ce = lt(S, at.TimePicker), le = (d) => {
      o("mount", d);
    };
    vueExports.watch(
      re2,
      (d, a) => {
        d.count - a.count > 0 && R();
      },
      { deep: true }
    );
    const we = vueExports.computed(() => (d) => O(s.value(d), r.value(d)).map((a) => ({
      ...a,
      days: a.days.map((n) => (n.marker = l(n), n.classData = D(n), n))
    })));
    function ve(d) {
      d || d === 0 ? K.value?.[d]?.triggerTransition(s.value(d), r.value(d)) : K.value?.forEach((a, n) => a?.triggerTransition(s.value(n), r.value(n)));
    }
    function Ae() {
      o("update-flow-step");
    }
    const Q = (d, a, n = 0) => {
      oe.value?.[n]?.toggleMonthPicker(d, a);
    }, I = (d, a, n = 0) => {
      oe.value?.[n]?.toggleYearPicker(d, a);
    }, y = (d, a, n) => {
      Z.value?.toggleTimePicker(d, a, n);
    }, H = (d, a) => {
      if (!ne.range) {
        const n = u.value ? u.value : P, C = a ? F(a) : n, m = d ? startOfWeek(C, { weekStartsOn: 1 }) : endOfWeek(C, { weekStartsOn: 1 });
        b({
          value: m,
          current: getMonth(C) === s.value(0),
          text: "",
          classData: {}
        }), (void 0).getElementById(q(m))?.focus();
      }
    }, fe = (d) => {
      oe.value?.[0]?.handleMonthYearChange(d, true);
    }, Pe = (d) => {
      E(0, { month: s.value(0), year: r.value(0) + (d ? 1 : -1), fromNav: true });
    }, Ce = (d) => {
      L("overlay-toggle", { open: false, overlay: d }), o("focus-menu");
    };
    return A({
      clearHoverDate: V,
      presetDate: k,
      selectCurrentDate: g,
      handleArrow: w,
      updateMonthYear: E,
      setStartTime: $,
      toggleMonthPicker: Q,
      toggleYearPicker: I,
      toggleTimePicker: y,
      getSidebarProps: () => ({
        modelValue: u,
        month: s,
        year: r,
        time: v,
        updateTime: M,
        updateMonthYear: E,
        selectDate: b,
        presetDate: k
      }),
      changeMonth: fe,
      changeYear: Pe,
      selectWeekDate: H
    }), (d, a) => (vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, null, [
      vueExports.createVNode(aa, { collapse: e.collapse }, {
        default: vueExports.withCtx(({ instances: n, wrapClass: C }) => [
          (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList(n, (m) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
            key: m,
            class: vueExports.normalizeClass(C)
          }, [
            vueExports.unref(ne).hideMonthYearSelect ? vueExports.createCommentVNode("", true) : (vueExports.openBlock(), vueExports.createBlock(gl, {
              key: 0,
              ref_for: true,
              ref: "calendar-header",
              months: vueExports.unref(te)(),
              years: vueExports.unref(x)(),
              month: vueExports.unref(s)(m),
              year: vueExports.unref(r)(m),
              instance: m,
              "menu-wrap-ref": e.menuWrapRef,
              onMount: a[0] || (a[0] = (N) => le(vueExports.unref(bt).header)),
              onResetFlow: a[1] || (a[1] = (N) => d.$emit("reset-flow")),
              onUpdateMonthYear: (N) => vueExports.unref(E)(m, N),
              onOverlayClosed: Ce
            }, vueExports.createSlots({ _: 2 }, [
              vueExports.renderList(vueExports.unref(G), (N, U) => ({
                name: N,
                fn: vueExports.withCtx((pe) => [
                  vueExports.renderSlot(d.$slots, N, vueExports.mergeProps({ ref_for: true }, pe))
                ])
              }))
            ]), 1032, ["months", "years", "month", "year", "instance", "menu-wrap-ref", "onUpdateMonthYear"])),
            vueExports.createVNode(_l, {
              ref_for: true,
              ref: "calendar",
              "mapped-dates": we.value(m),
              instance: m,
              month: vueExports.unref(s)(m),
              year: vueExports.unref(r)(m),
              onSelectDate: (N) => vueExports.unref(b)(N, m !== 1),
              onSetHoverDate: a[2] || (a[2] = (N) => vueExports.unref(p)(N)),
              onHandleScroll: (N) => vueExports.unref(h)(N, m),
              onHandleSwipe: (N) => vueExports.unref(_)(N, m),
              onMount: a[3] || (a[3] = (N) => le(vueExports.unref(bt).calendar))
            }, vueExports.createSlots({ _: 2 }, [
              vueExports.renderList(vueExports.unref(de), (N, U) => ({
                name: N,
                fn: vueExports.withCtx((pe) => [
                  vueExports.renderSlot(d.$slots, N, vueExports.mergeProps({ ref_for: true }, pe))
                ])
              }))
            ]), 1032, ["mapped-dates", "instance", "month", "year", "onSelectDate", "onHandleScroll", "onHandleSwipe"])
          ], 2))), 128))
        ]),
        _: 3
      }, 8, ["collapse"]),
      vueExports.unref(X).enableTimePicker ? (vueExports.openBlock(), vueExports.createElementBlock("div", Tl, [
        vueExports.renderSlot(d.$slots, "time-picker", vueExports.normalizeProps(vueExports.guardReactiveProps({ time: vueExports.unref(v), updateTime: vueExports.unref(M) })), () => [
          vueExports.createVNode(La, {
            ref: "time-picker",
            hours: vueExports.unref(v).hours,
            minutes: vueExports.unref(v).minutes,
            seconds: vueExports.unref(v).seconds,
            "disabled-times-config": vueExports.unref(Y),
            "validate-time": vueExports.unref(B),
            "no-overlay-focus": e.noOverlayFocus,
            onMount: a[4] || (a[4] = (n) => le(vueExports.unref(bt).timePicker)),
            "onUpdate:hours": a[5] || (a[5] = (n) => vueExports.unref(M)({ hours: n, minutes: vueExports.unref(v).minutes, seconds: vueExports.unref(v).seconds })),
            "onUpdate:minutes": a[6] || (a[6] = (n) => vueExports.unref(M)({ hours: vueExports.unref(v).hours, minutes: n, seconds: vueExports.unref(v).seconds })),
            "onUpdate:seconds": a[7] || (a[7] = (n) => vueExports.unref(M)({ hours: vueExports.unref(v).hours, minutes: vueExports.unref(v).minutes, seconds: n })),
            onResetFlow: a[8] || (a[8] = (n) => d.$emit("reset-flow"))
          }, vueExports.createSlots({ _: 2 }, [
            vueExports.renderList(vueExports.unref(ce), (n, C) => ({
              name: n,
              fn: vueExports.withCtx((m) => [
                vueExports.renderSlot(d.$slots, n, vueExports.normalizeProps(vueExports.guardReactiveProps(m)))
              ])
            }))
          ]), 1032, ["hours", "minutes", "seconds", "disabled-times-config", "validate-time", "no-overlay-focus"])
        ])
      ])) : vueExports.createCommentVNode("", true)
    ], 64));
  }
}), Sl = (e, A) => {
  const {
    getDate: f,
    modelValue: o,
    year: c,
    calendars: s,
    defaults: { highlight: r, range: u, multiDates: v }
  } = Me(), { isDateBetween: Y, isDateEqual: P } = We(), { checkRangeAutoApply: B, handleMultiDatesSelect: O, setMonthOrYearRange: l } = na();
  Ft();
  const { isDisabled: w } = Ue(), { formatQuarterText: h } = pt(), {
    selectYear: _,
    groupedYears: b,
    showYearPicker: E,
    isDisabled: k,
    toggleYearPicker: g,
    handleYearSelect: M,
    handleYear: R
  } = Wa(A), S = vueExports.ref();
  const p = vueExports.computed(() => (q) => o.value ? Array.isArray(o.value) ? o.value.some((oe) => isSameQuarter(q, oe)) : isSameQuarter(o.value, q) : false), D = (q) => {
    if (u.value.enabled) {
      if (Array.isArray(o.value)) {
        const oe = P(q, o.value[0]) || P(q, o.value[1]);
        return Y(o.value, S.value, q) && !oe;
      }
      return false;
    }
    return false;
  }, V = (q, oe) => q.quarter === getQuarter(oe) && q.year === getYear(oe), F = (q) => typeof r.value == "function" ? r.value({ quarter: getQuarter(q), year: getYear(q) }) : r.value.quarters.some((oe) => V(oe, q)), L = vueExports.computed(() => (q) => {
    const oe = set(f(), { year: c.value(q) });
    return eachQuarterOfInterval({
      start: startOfYear(oe),
      end: endOfYear(oe)
    }).map((K) => {
      const Z = startOfQuarter(K), de = endOfQuarter(K), G = w(K), ce = D(Z), le = F(Z);
      return {
        text: h(Z, de),
        value: Z,
        active: p.value(Z),
        highlighted: le,
        disabled: G,
        isBetween: ce
      };
    });
  }), ne = (q) => {
    O(q, v.value.limit), A("auto-apply", true);
  }, re2 = (q) => {
    o.value = l(q), B(o.value, A, o.value.length < 2);
  }, X = (q) => {
    o.value = q, A("auto-apply");
  };
  return {
    groupedYears: b,
    year: c,
    isDisabled: k,
    quarters: L,
    showYearPicker: E,
    modelValue: o,
    selectYear: _,
    toggleYearPicker: g,
    handleYearSelect: M,
    handleYear: R,
    setHoverDate: (q) => {
      S.value = q;
    },
    selectQuarter: (q, oe, K) => {
      if (!K)
        return s.value[oe].month = getMonth(endOfQuarter(q)), v.value.enabled ? ne(q) : u.value.enabled ? re2(q) : X(q);
    }
  };
}, Rl = { class: "dp--quarter-items" }, Cl = ["data-test-id", "disabled", "onClick", "onMouseover"], xl = /* @__PURE__ */ vueExports.defineComponent({
  __name: "QuarterPicker",
  props: {
    flowStep: {},
    collapse: { type: Boolean },
    menuWrapRef: {},
    noOverlayFocus: { type: Boolean }
  },
  emits: ["reset-flow", "auto-apply"],
  setup(e, { expose: A, emit: f }) {
    const o = f, c = e, {
      defaults: { config: s }
    } = Me(), r = vueExports.useSlots(), { boolHtmlAttribute: u } = Pt(), v = lt(r, at.YearMode), {
      groupedYears: Y,
      year: P,
      isDisabled: B,
      quarters: O,
      modelValue: l,
      showYearPicker: w,
      setHoverDate: h,
      selectQuarter: _,
      toggleYearPicker: b,
      handleYearSelect: E,
      handleYear: k
    } = Sl(c, o);
    return A({ getSidebarProps: () => ({
      modelValue: l,
      year: P,
      selectQuarter: _,
      handleYearSelect: E,
      handleYear: k
    }) }), (M, R) => (vueExports.openBlock(), vueExports.createBlock(aa, {
      collapse: e.collapse,
      stretch: ""
    }, {
      default: vueExports.withCtx(({ instances: $, wrapClass: S }) => [
        (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList($, (p) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
          key: p,
          class: vueExports.normalizeClass(S)
        }, [
          vueExports.createElementVNode("div", {
            class: "dp-quarter-picker-wrap",
            style: vueExports.normalizeStyle({ minHeight: `${vueExports.unref(s).modeHeight}px` })
          }, [
            M.$slots["top-extra"] ? vueExports.renderSlot(M.$slots, "top-extra", {
              key: 0,
              value: vueExports.unref(l)
            }) : vueExports.createCommentVNode("", true),
            vueExports.createElementVNode("div", null, [
              vueExports.createVNode(Na, {
                items: vueExports.unref(Y)(p),
                instance: p,
                "show-year-picker": vueExports.unref(w)[p],
                year: vueExports.unref(P)(p),
                "is-disabled": (D) => vueExports.unref(B)(p, D),
                onHandleYear: (D) => vueExports.unref(k)(p, D),
                onYearSelect: (D) => vueExports.unref(E)(D, p),
                onToggleYearPicker: (D) => vueExports.unref(b)(p, D?.flow, D?.show)
              }, vueExports.createSlots({ _: 2 }, [
                vueExports.renderList(vueExports.unref(v), (D, V) => ({
                  name: D,
                  fn: vueExports.withCtx((F) => [
                    vueExports.renderSlot(M.$slots, D, vueExports.mergeProps({ ref_for: true }, F))
                  ])
                }))
              ]), 1032, ["items", "instance", "show-year-picker", "year", "is-disabled", "onHandleYear", "onYearSelect", "onToggleYearPicker"])
            ]),
            vueExports.createElementVNode("div", Rl, [
              (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(O)(p), (D, V) => (vueExports.openBlock(), vueExports.createElementBlock("div", { key: V }, [
                vueExports.createElementVNode("button", {
                  type: "button",
                  class: vueExports.normalizeClass(["dp--qr-btn", {
                    "dp--qr-btn-active": D.active,
                    "dp--qr-btn-between": D.isBetween,
                    "dp--qr-btn-disabled": D.disabled,
                    "dp--highlighted": D.highlighted
                  }]),
                  "data-dp-action-element": "0",
                  "data-test-id": D.value,
                  disabled: vueExports.unref(u)(D.disabled),
                  onClick: (F) => vueExports.unref(_)(D.value, p, D.disabled),
                  onMouseover: (F) => vueExports.unref(h)(D.value)
                }, [
                  vueExports.renderSlot(M.$slots, "quarter", {
                    value: D.value,
                    text: D.text
                  }, () => [
                    vueExports.createTextVNode(vueExports.toDisplayString(D.text), 1)
                  ])
                ], 42, Cl)
              ]))), 128))
            ])
          ], 4)
        ], 2))), 128))
      ]),
      _: 3
    }, 8, ["collapse"]));
  }
}), Ol = ["id", "tabindex", "role", "aria-label"], Yl = {
  key: 0,
  class: "dp--menu-load-container"
}, Bl = {
  key: 1,
  class: "dp--menu-header"
}, Il = ["data-dp-mobile"], El = {
  key: 0,
  class: "dp__sidebar_left"
}, Vl = ["data-dp-mobile"], Fl = ["data-test-id", "data-dp-mobile", "onClick", "onKeydown"], Nl = { class: "dp__instance_calendar" }, Wl = {
  key: 2,
  class: "dp__sidebar_right"
}, Ll = {
  key: 2,
  class: "dp__action_extra"
}, Hl = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DatepickerMenu",
  props: {
    collapse: { type: Boolean },
    noOverlayFocus: { type: Boolean },
    getInputRect: { type: Function }
  },
  emits: ["close-picker", "select-date", "auto-apply", "time-update", "menu-blur"],
  setup(e, { expose: A, emit: f }) {
    const o = f, c = vueExports.useSlots(), {
      state: s,
      rootProps: r,
      defaults: { textInput: u, inline: v, config: Y, ui: P, ariaLabels: B },
      setState: O
    } = Me(), { isMobile: l } = Zt(), { handleEventPropagation: w, getElWithin: h, checkStopPropagation: _, checkKeyDown: b } = Ie();
    In();
    vueExports.useTemplateRef("inner-menu");
    const k = vueExports.useTemplateRef("dp-menu"), g = vueExports.useTemplateRef("dyn-cmp"), M = vueExports.ref(0), R = vueExports.ref(false);
    vueExports.ref(false);
    const { flowStep: S, updateFlowStep: p, childMount: D, resetFlow: V, handleFlow: F } = Vn(g);
    const re2 = vueExports.computed(() => r.monthPicker ? Ur : r.yearPicker ? Jr : r.timePicker ? cl : r.quarterPicker ? xl : $l), X = () => {
      const i = unrefElement(k);
      i && i.focus({ preventScroll: true });
    }, x = vueExports.computed(() => g.value?.getSidebarProps() || {}), te = lt(c, at.ActionRow), q = lt(c, at.PassTrough), oe = vueExports.computed(() => ({
      dp__menu_disabled: r.disabled,
      dp__menu_readonly: r.readonly,
      "dp-menu-loading": r.loading
    })), K = vueExports.computed(
      () => ({
        dp__menu: true,
        dp__menu_index: !v.value.enabled,
        dp__relative: v.value.enabled,
        ...P.value.menu
      })
    ), Z = (i) => {
      _(i, Y.value, true);
    }, de = (i) => {
      Y.value.escClose && (o("close-picker"), w(i, Y.value));
    }, G = (i) => {
      r.arrowNavigation || (i === Xe.left || i === Xe.up ? ve("handleArrow", Xe.left, 0, i === Xe.up) : ve("handleArrow", Xe.right, 0, i === Xe.down));
    }, ce = (i) => {
      O("shiftKeyInMenu", i.shiftKey), !r.hideMonthYearSelect && i.code === $e.tab && i.target.classList.contains("dp__menu") && s.shiftKeyInMenu && (i.preventDefault(), _(i, Y.value, true), o("close-picker"));
    }, le = (i) => {
      g.value?.toggleTimePicker(false, false), g.value?.toggleMonthPicker(false, false, i), g.value?.toggleYearPicker(false, false, i);
    }, we = (i, d = 0) => i === "month" ? g.value?.toggleMonthPicker(false, true, d) : i === "year" ? g.value?.toggleYearPicker(false, true, d) : i === "time" ? g.value?.toggleTimePicker(true, false) : le(d), ve = (i, ...d) => {
      g.value?.[i] && g.value?.[i](...d);
    }, Ae = () => {
      ve("selectCurrentDate");
    }, Q = (i) => {
      ve("presetDate", vueExports.toValue(i));
    }, I = () => {
      ve("clearHoverDate");
    }, y = (i, d) => {
      ve("updateMonthYear", i, d);
    }, H = (i, d) => {
      i.preventDefault(), G(d);
    }, fe = (i) => {
      if (ce(i), i.key === $e.home || i.key === $e.end)
        return ve(
          "selectWeekDate",
          i.key === $e.home,
          i.target.getAttribute("id")
        );
      switch ((i.key === $e.pageUp || i.key === $e.pageDown) && (i.shiftKey ? (ve("changeYear", i.key === $e.pageUp), h(k.value, "overlay-year")?.focus()) : (ve("changeMonth", i.key === $e.pageUp), h(k.value, i.key === $e.pageUp ? "action-prev" : "action-next")?.focus()), i.target.getAttribute("id") && k.value?.focus({ preventScroll: true })), i.key) {
        case $e.esc:
          return de(i);
        case $e.arrowLeft:
          return H(i, Xe.left);
        case $e.arrowRight:
          return H(i, Xe.right);
        case $e.arrowUp:
          return H(i, Xe.up);
        case $e.arrowDown:
          return H(i, Xe.down);
        default:
          return;
      }
    };
    return A({
      updateMonthYear: y,
      switchView: we,
      onValueCleared: () => {
        g.value?.setStartTime?.();
      },
      handleFlow: F
    }), (i, d) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
      id: vueExports.unref(r).menuId,
      ref: "dp-menu",
      tabindex: vueExports.unref(v).enabled ? void 0 : "0",
      role: vueExports.unref(v).enabled ? void 0 : "dialog",
      "aria-label": vueExports.unref(B)?.menu,
      class: vueExports.normalizeClass(K.value),
      onMouseleave: I,
      onClick: Z,
      onKeydown: fe
    }, [
      (vueExports.unref(r).disabled || vueExports.unref(r).readonly) && vueExports.unref(v).enabled || vueExports.unref(r).loading ? (vueExports.openBlock(), vueExports.createElementBlock("div", {
        key: 0,
        class: vueExports.normalizeClass(oe.value)
      }, [
        vueExports.unref(r).loading ? (vueExports.openBlock(), vueExports.createElementBlock("div", Yl, [...d[5] || (d[5] = [
          vueExports.createElementVNode("span", { class: "dp--menu-loader" }, null, -1)
        ])])) : vueExports.createCommentVNode("", true)
      ], 2)) : vueExports.createCommentVNode("", true),
      i.$slots["menu-header"] ? (vueExports.openBlock(), vueExports.createElementBlock("div", Bl, [
        vueExports.renderSlot(i.$slots, "menu-header")
      ])) : vueExports.createCommentVNode("", true),
      vueExports.renderSlot(i.$slots, "arrow"),
      vueExports.createElementVNode("div", {
        ref: "inner-menu",
        class: vueExports.normalizeClass({
          dp__menu_content_wrapper: vueExports.unref(r).presetDates?.length || !!i.$slots["left-sidebar"] || !!i.$slots["right-sidebar"],
          "dp--menu-content-wrapper-collapsed": e.collapse && (vueExports.unref(r).presetDates?.length || !!i.$slots["left-sidebar"] || !!i.$slots["right-sidebar"])
        }),
        "data-dp-mobile": vueExports.unref(l),
        style: vueExports.normalizeStyle({ "--dp-menu-width": `${M.value}px` })
      }, [
        i.$slots["left-sidebar"] ? (vueExports.openBlock(), vueExports.createElementBlock("div", El, [
          vueExports.renderSlot(i.$slots, "left-sidebar", vueExports.normalizeProps(vueExports.guardReactiveProps(x.value)))
        ])) : vueExports.createCommentVNode("", true),
        vueExports.unref(r).presetDates.length ? (vueExports.openBlock(), vueExports.createElementBlock("div", {
          key: 1,
          class: vueExports.normalizeClass({ "dp--preset-dates-collapsed": e.collapse, "dp--preset-dates": true }),
          "data-dp-mobile": vueExports.unref(l)
        }, [
          (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(r).presetDates, (a, n) => (vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, { key: n }, [
            a.slot ? vueExports.renderSlot(i.$slots, a.slot, {
              key: 0,
              presetDate: Q,
              label: a.label,
              value: a.value
            }) : (vueExports.openBlock(), vueExports.createElementBlock("button", {
              key: 1,
              type: "button",
              style: vueExports.normalizeStyle(a.style || {}),
              class: vueExports.normalizeClass(["dp__btn dp--preset-range", { "dp--preset-range-collapsed": e.collapse }]),
              "data-test-id": a.testId ?? void 0,
              "data-dp-mobile": vueExports.unref(l),
              onClick: vueExports.withModifiers((C) => Q(a.value), ["prevent"]),
              onKeydown: (C) => vueExports.unref(b)(C, () => Q(a.value), true)
            }, vueExports.toDisplayString(a.label), 47, Fl))
          ], 64))), 128))
        ], 10, Vl)) : vueExports.createCommentVNode("", true),
        vueExports.createElementVNode("div", Nl, [
          (vueExports.openBlock(), vueExports.createBlock(vueExports.resolveDynamicComponent(re2.value), {
            ref: "dyn-cmp",
            "flow-step": vueExports.unref(S),
            collapse: e.collapse,
            "no-overlay-focus": e.noOverlayFocus,
            "menu-wrap-ref": k.value,
            onMount: vueExports.unref(D),
            onUpdateFlowStep: vueExports.unref(p),
            onResetFlow: vueExports.unref(V),
            onFocusMenu: X,
            onSelectDate: d[0] || (d[0] = (a) => i.$emit("select-date")),
            onAutoApply: d[1] || (d[1] = (a) => i.$emit("auto-apply", a)),
            onTimeUpdate: d[2] || (d[2] = (a) => i.$emit("time-update"))
          }, vueExports.createSlots({ _: 2 }, [
            vueExports.renderList(vueExports.unref(q), (a, n) => ({
              name: a,
              fn: vueExports.withCtx((C) => [
                vueExports.renderSlot(i.$slots, a, vueExports.normalizeProps(vueExports.guardReactiveProps({ ...C })))
              ])
            }))
          ]), 1064, ["flow-step", "collapse", "no-overlay-focus", "menu-wrap-ref", "onMount", "onUpdateFlowStep", "onResetFlow"]))
        ]),
        i.$slots["right-sidebar"] ? (vueExports.openBlock(), vueExports.createElementBlock("div", Wl, [
          vueExports.renderSlot(i.$slots, "right-sidebar", vueExports.normalizeProps(vueExports.guardReactiveProps(x.value)))
        ])) : vueExports.createCommentVNode("", true)
      ], 14, Il),
      i.$slots["action-extra"] ? (vueExports.openBlock(), vueExports.createElementBlock("div", Ll, [
        i.$slots["action-extra"] ? vueExports.renderSlot(i.$slots, "action-extra", {
          key: 0,
          selectCurrentDate: Ae
        }) : vueExports.createCommentVNode("", true)
      ])) : vueExports.createCommentVNode("", true),
      !vueExports.unref(r).autoApply || vueExports.unref(Y).keepActionRow ? (vueExports.openBlock(), vueExports.createBlock(Fr, {
        key: 3,
        "menu-mount": R.value,
        "calendar-width": M.value,
        onClosePicker: d[3] || (d[3] = (a) => i.$emit("close-picker")),
        onSelectDate: d[4] || (d[4] = (a) => i.$emit("select-date")),
        onSelectNow: Ae
      }, vueExports.createSlots({ _: 2 }, [
        vueExports.renderList(vueExports.unref(te), (a, n) => ({
          name: a,
          fn: vueExports.withCtx((C) => [
            vueExports.renderSlot(i.$slots, a, vueExports.normalizeProps(vueExports.guardReactiveProps(C)))
          ])
        }))
      ]), 1032, ["menu-mount", "calendar-width"])) : vueExports.createCommentVNode("", true)
    ], 42, Ol));
  }
}), jl = ["data-dp-mobile"], Kl = /* @__PURE__ */ vueExports.defineComponent({
  __name: "VueDatePicker",
  setup(e, { expose: A }) {
    const {
      rootEmit: f,
      setState: o,
      inputValue: c,
      modelValue: s,
      rootProps: r,
      defaults: { inline: u, config: v, textInput: Y, range: P, multiDates: B, teleport: O, floatingConfig: l }
    } = Me(), { validateDate: w, isValidTime: h } = Ue(), { menuTransition: _, showTransition: b } = Vt(), { isMobile: E } = Zt(), { findNextFocusableElement: k, getNumVal: g } = Ie(), M = vueExports.useSlots(), R = vueExports.ref(false), $ = vueExports.ref(u.value.enabled || r.centered), S = vueExports.toRef(r, "modelValue"), p = vueExports.toRef(r, "timezone"), D = vueExports.useTemplateRef("dp-menu-wrap"), V = vueExports.useTemplateRef("dp-menu"), F = vueExports.useTemplateRef("input-cmp"), L = vueExports.useTemplateRef("picker-wrapper"), ne = vueExports.useTemplateRef("menu-arrow"), re2 = vueExports.ref(false), X = vueExports.ref(false), x = vueExports.ref(false), te = vueExports.ref(true), q = (se) => (l.value.arrow && se.push(
      arrow({ element: l.value.arrow === true ? ne : l.value.arrow })
    ), l.value.flip && se.push(flip(typeof l.value.flip == "object" ? l.value.flip : {})), l.value.shift && se.push(shift(typeof l.value.shift == "object" ? l.value.shift : {})), se), { floatingStyles: oe, middlewareData: K, placement: Z, y: de } = useFloating(
      F,
      D,
      {
        strategy: l.value.strategy,
        placement: l.value.placement,
        middleware: q([offset(l.value.offset)]),
        whileElementsMounted: autoUpdate
      }
    );
    const G = Fa(M, r.presetDates), ce = lt(M, at.Input);
    vueExports.watch(
      [S, p],
      () => {
        le(S.value);
      },
      { deep: true }
    ), vueExports.watch([Z, de], () => {
      !u.value.enabled && !r.centered && te.value && ($.value = false, vueExports.nextTick().then(() => {
        te.value = false, $.value = true;
      }));
    });
    const { parseExternalModelValue: le, emitModelValue: we, formatInputValue: ve, checkBeforeEmit: Ae } = En(), Q = vueExports.computed(
      () => ({
        dp__main: true,
        dp__theme_dark: r.dark,
        dp__theme_light: !r.dark,
        dp__flex_display: u.value.enabled,
        "dp--flex-display-collapsed": x.value,
        dp__flex_display_with_input: u.value.input
      })
    ), I = vueExports.computed(() => r.dark ? "dp__theme_dark" : "dp__theme_light"), y = vueExports.computed(() => u.value.enabled && (r.timePicker || r.monthPicker || r.yearPicker || r.quarterPicker)), H = () => F.value?.$el?.getBoundingClientRect() ?? { width: 0, left: 0, right: 0 }, fe = () => {
      R.value && v.value.closeOnScroll && ge();
    }, d = () => {
      !r.disabled && !r.readonly && (te.value = true, R.value = true, R.value && f("open"), R.value || pe(), le(r.modelValue));
    }, a = () => {
      c.value = "", pe(), V.value?.onValueCleared(), F.value?.setParsedDate(null), f("update:model-value", null), f("cleared"), v.value.closeOnClearValue && ge();
    }, n = () => {
      const se = s.value;
      return !se || !Array.isArray(se) && w(se) ? true : Array.isArray(se) ? B.value.enabled || se.length === 2 && w(se[0]) && w(se[1]) ? true : P.value.partialRange && !r.timePicker ? w(se[0]) : false : false;
    }, C = () => {
      Ae() && n() ? (we(), ge()) : f("invalid-select");
    }, m = (se) => {
      N(), we(), v.value.closeOnAutoApply && !se && ge();
    }, N = () => {
      F.value && Y.value.enabled && F.value.setParsedDate(s.value);
    }, U = (se = false) => {
      r.autoApply && h(s.value) && n() && (P.value.enabled && Array.isArray(s.value) ? (P.value.partialRange || s.value.length === 2) && m(se) : m(se));
    }, pe = () => {
      Y.value.enabled || (s.value = null);
    }, ge = (se = false) => {
      te.value = true, se && s.value && v.value.setDateOnMenuClose && C(), u.value.enabled || (R.value && (R.value = false, o("menuFocused", false), o("shiftKeyInMenu", false), f("closed"), c.value && le(S.value)), pe(), f("blur"));
    }, Qe = (se, Le, Je = false) => {
      if (!se) {
        s.value = null;
        return;
      }
      const St = Array.isArray(se) ? se.every((jt) => w(jt)) : w(se), ht = h(se);
      St && ht ? (o("isTextInputDate", true), s.value = se, Le ? (re2.value = Je, C(), f("text-submit")) : r.autoApply && U(true), vueExports.nextTick().then(() => {
        o("isTextInputDate", false);
      })) : f("invalid-date", se);
    }, Tt = () => {
      r.autoApply && h(s.value) && we(), N();
    }, Wt = () => R.value ? ge() : d(), ra = (se) => {
      s.value = se;
    }, Lt = () => {
      Y.value.enabled && (o("isInputFocused", true), ve()), f("focus");
    }, la = () => {
      Y.value.enabled && (o("isInputFocused", false), le(r.modelValue), re2.value && k(L.value, X.value)?.focus()), f("blur");
    }, oa = (se, Le) => {
      V.value && V.value.updateMonthYear(Le ?? 0, {
        month: g(se.month),
        year: g(se.year)
      });
    }, sa = (se) => {
      le(se ?? r.modelValue);
    }, $t = (se, Le) => {
      V.value?.switchView(se, Le);
    }, ua = (se, Le) => {
      if (R.value)
        return v.value.onClickOutside ? v.value.onClickOutside(se, Le) : ge(true);
    }, ia = (se = 0) => {
      V.value?.handleFlow(se);
    }, Ht = () => D;
    return onClickOutside(D, (se) => ua(n, se), {
      ignore: [F]
    }), A({
      closeMenu: ge,
      selectDate: C,
      clearValue: a,
      openMenu: d,
      onScroll: fe,
      formatInputValue: ve,
      // exposed for testing purposes
      updateInternalModelValue: ra,
      // modify internal modelValue
      setMonthYear: oa,
      parseModel: sa,
      switchView: $t,
      toggleMenu: Wt,
      handleFlow: ia,
      getDpWrapMenuRef: Ht,
      dpMenuRef: () => V,
      dpWrapMenuRef: () => D,
      inputRef: () => F
    }), (se, Le) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
      ref: "picker-wrapper",
      class: vueExports.normalizeClass(Q.value),
      "data-datepicker-instance": "",
      "data-dp-mobile": vueExports.unref(E)
    }, [
      vueExports.createVNode(Yr, {
        ref: "input-cmp",
        "is-menu-open": R.value,
        onClear: a,
        onOpen: d,
        onSetInputDate: Qe,
        onSetEmptyDate: vueExports.unref(we),
        onSelectDate: C,
        onToggle: Wt,
        onClose: ge,
        onFocus: Lt,
        onBlur: la,
        onRealBlur: Le[0] || (Le[0] = (Je) => vueExports.unref(o)("isInputFocused", false))
      }, vueExports.createSlots({ _: 2 }, [
        vueExports.renderList(vueExports.unref(ce), (Je, St) => ({
          name: Je,
          fn: vueExports.withCtx((ht) => [
            vueExports.renderSlot(se.$slots, Je, vueExports.normalizeProps(vueExports.guardReactiveProps(ht)))
          ])
        }))
      ]), 1032, ["is-menu-open", "onSetEmptyDate"]),
      vueExports.createVNode(vueExports.Teleport, {
        to: vueExports.unref(O),
        disabled: !vueExports.unref(O)
      }, {
        default: vueExports.withCtx(() => [
          vueExports.createElementVNode("div", {
            ref: "dp-menu-wrap",
            class: vueExports.normalizeClass({
              "dp--menu-wrapper": !vueExports.unref(u).enabled,
              dp__outer_menu_wrap: true,
              "dp--centered": vueExports.unref(r).centered
            }),
            style: vueExports.normalizeStyle(!vueExports.unref(u).enabled && !vueExports.unref(r).centered ? vueExports.unref(oe) : void 0)
          }, [
            vueExports.createVNode(vueExports.Transition, {
              name: vueExports.unref(_)(vueExports.unref(Z).startsWith("top")),
              css: vueExports.unref(b) && !vueExports.unref(u).enabled && !vueExports.unref(r).centered && $.value
            }, {
              default: vueExports.withCtx(() => [
                R.value && $.value ? (vueExports.openBlock(), vueExports.createBlock(Hl, {
                  key: 0,
                  ref: "dp-menu",
                  class: vueExports.normalizeClass({ [I.value]: true }),
                  "no-overlay-focus": y.value,
                  collapse: x.value,
                  "get-input-rect": H,
                  onClosePicker: ge,
                  onSelectDate: C,
                  onAutoApply: U,
                  onTimeUpdate: Tt,
                  onMenuBlur: Le[1] || (Le[1] = (Je) => vueExports.unref(f)("blur"))
                }, vueExports.createSlots({ _: 2 }, [
                  vueExports.renderList(vueExports.unref(G), (Je, St) => ({
                    name: Je,
                    fn: vueExports.withCtx((ht) => [
                      vueExports.renderSlot(se.$slots, Je, vueExports.normalizeProps(vueExports.guardReactiveProps({ ...ht })))
                    ])
                  })),
                  !vueExports.unref(u).enabled && !vueExports.unref(r).centered && vueExports.unref(l).arrow === true ? {
                    name: "arrow",
                    fn: vueExports.withCtx(() => [
                      vueExports.createElementVNode("div", {
                        ref: "menu-arrow",
                        class: vueExports.normalizeClass({
                          dp__arrow_top: vueExports.unref(Z) === "bottom",
                          dp__arrow_bottom: vueExports.unref(Z) === "top"
                        }),
                        style: vueExports.normalizeStyle({
                          left: vueExports.unref(K).arrow?.x != null ? `${vueExports.unref(K).arrow.x}px` : "",
                          top: vueExports.unref(K).arrow?.y != null ? `${vueExports.unref(K).arrow.y}px` : ""
                        })
                      }, null, 6)
                    ]),
                    key: "0"
                  } : void 0
                ]), 1032, ["class", "no-overlay-focus", "collapse"])) : vueExports.createCommentVNode("", true)
              ]),
              _: 3
            }, 8, ["name", "css"])
          ], 6)
        ]),
        _: 3
      }, 8, ["to", "disabled"])
    ], 10, jl));
  }
}), Zl = /* @__PURE__ */ vueExports.defineComponent({
  __name: "VueDatePickerRoot",
  props: /* @__PURE__ */ vueExports.mergeDefaults({
    multiCalendars: { type: [Boolean, Number, String, Object] },
    modelValue: {},
    modelType: {},
    dark: { type: Boolean },
    transitions: { type: [Boolean, Object] },
    ariaLabels: {},
    hideNavigation: {},
    timezone: {},
    vertical: { type: Boolean },
    hideMonthYearSelect: { type: Boolean },
    disableYearSelect: { type: Boolean },
    yearRange: {},
    autoApply: { type: Boolean },
    disabledDates: { type: [Array, Function] },
    startDate: {},
    hideOffsetDates: { type: Boolean },
    noToday: { type: Boolean },
    allowedDates: {},
    markers: {},
    presetDates: {},
    flow: {},
    preventMinMaxNavigation: { type: Boolean },
    reverseYears: { type: Boolean },
    weekPicker: { type: Boolean },
    filters: {},
    arrowNavigation: { type: Boolean },
    highlight: { type: [Function, Object] },
    teleport: { type: [String, Boolean] },
    centered: { type: Boolean },
    locale: {},
    weekStart: {},
    weekNumbers: { type: [Boolean, Object] },
    dayNames: { type: [Function, Array] },
    monthPicker: { type: Boolean },
    yearPicker: { type: Boolean },
    modelAuto: { type: Boolean },
    formats: {},
    multiDates: { type: [Boolean, Object] },
    minDate: {},
    maxDate: {},
    minTime: {},
    maxTime: {},
    inputAttrs: {},
    timeConfig: {},
    placeholder: {},
    timePicker: { type: Boolean },
    range: { type: [Boolean, Object] },
    menuId: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    inline: { type: [Boolean, Object] },
    textInput: { type: [Boolean, Object] },
    sixWeeks: { type: [Boolean, String] },
    actionRow: {},
    focusStartDate: { type: Boolean },
    disabledTimes: { type: [Function, Array] },
    calendar: { type: Function },
    config: {},
    quarterPicker: { type: Boolean },
    yearFirst: { type: Boolean },
    loading: { type: Boolean },
    ui: {},
    floating: {}
  }, Pr),
  emits: ["update:model-value", "internal-model-change", "text-submit", "text-input", "open", "closed", "focus", "blur", "cleared", "flow-step", "update-month-year", "invalid-select", "invalid-fixed-range", "invalid-date", "tooltip-open", "tooltip-close", "am-pm-change", "range-start", "range-end", "date-click", "overlay-toggle", "invalid"],
  setup(e, { expose: A, emit: f }) {
    const o = f, c = e;
    Yn(c, o);
    const s = vueExports.useSlots(), r = Fa(s, c.presetDates), u = vueExports.useTemplateRef("date-picker");
    return A($r(u)), (v, Y) => (vueExports.openBlock(), vueExports.createBlock(Kl, { ref: "date-picker" }, vueExports.createSlots({ _: 2 }, [
      vueExports.renderList(vueExports.unref(r), (P, B) => ({
        name: P,
        fn: vueExports.withCtx((O) => [
          vueExports.renderSlot(v.$slots, P, vueExports.normalizeProps(vueExports.guardReactiveProps(O)))
        ])
      }))
    ]), 1536));
  }
});

export { Zl as Z };
//# sourceMappingURL=vue-datepicker-6F5-CyxW.mjs.map
