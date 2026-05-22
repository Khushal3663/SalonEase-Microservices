import { format, parse, parseISO } from "date-fns";

const getTimeFormat = (time) => {
  return format(parse(time, "HH:mm:ss", new Date()), "h:mm a");
};

const getDateTimeFormat = (dateTime) => {
  if (!dateTime) return "";
  const date = parseISO(dateTime);
  return format(date, "dd MMM, yyyy h:mm a");
};

export { getTimeFormat, getDateTimeFormat };
