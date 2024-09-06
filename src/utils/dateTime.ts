export const londonDateYYYYMMDD = (date: Date) => {
  const fullDate = date.toLocaleDateString("en-GB", {
    timeZone: "Europe/London"
  });
  const dateParts = fullDate.split("/");
  const year = dateParts[2];
  const month = dateParts[1].padStart(2, "0");
  const day = dateParts[0].padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const londonTimeHHMMSS = (date: Date) => {
  const fullTime = date.toLocaleTimeString("en-GB", {
    timeZone: "Europe/London"
  });
  const time = fullTime.split(" ")[0];
  return time;
};
