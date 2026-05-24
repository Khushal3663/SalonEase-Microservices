import { format, parse, parseISO } from "date-fns";

const getTimeFormat = (time) => {
  return format(parse(time, "HH:mm:ss", new Date()), "h:mm a");
};

const getDateTimeFormat = (dateTime) => {
  if (!dateTime) return "";
  const date = parseISO(dateTime);
  return format(date, "dd MMM, yyyy h:mm a");
};

const getDateFormat = (dateI) => {
  if (!dateI) return "";
  const date = parseISO(dateI);
  return format(date, "dd MMM, yyyy");
};

export { getTimeFormat, getDateTimeFormat, getDateFormat };
