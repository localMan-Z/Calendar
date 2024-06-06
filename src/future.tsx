import { actualDays, months, baseWeeks } from "./dates";
export default function month(
  adjective: string,
  currentMonth: string[],
  exportingIndex: {
    week: { date: number; day: string; dayIndex: number }[];
    weekIndex: string;
  }[]
) {
  console.log(exportingIndex);
  let index: number, days: number;
  for (const month of months) {
    if (month.month == currentMonth[1]) {
      days = months[months.indexOf(month)].days;
      index =
        adjective == "previous"
          ? months.indexOf(month) == 0
            ? 11
            : months.indexOf(month) - 1
          : months.indexOf(month) == 11
          ? 0
          : months.indexOf(month) + 1;
    }
  }
  let baseIndex = actualDays.indexOf(currentMonth[0]);
  let weekIndex: number;
  for (const week of exportingIndex) {
    for (let i = 0; i < week.week.length; i++) {
      if (week.week[i].date == Number(currentMonth[2])) {
        weekIndex = baseWeeks.indexOf(week.weekIndex);
      }
    }
  }
  const numberOfDaysOfTheMonth = months[index].days;

  let workingDay = Number(currentMonth[2]);
  if (adjective == "previous") {
    while (workingDay > 1) {
      workingDay -= 1;
      baseIndex == 0
        ? ((baseIndex = 6), weekIndex == 0 ? (weekIndex = 5) : (weekIndex -= 1))
        : (baseIndex -= 1);
    }
  } else if (adjective == "next") {
    while (days > workingDay) {
      workingDay += 1;
      baseIndex == 6
        ? ((baseIndex = 0), weekIndex == 5 ? (weekIndex = 0) : (weekIndex += 1))
        : (baseIndex += 1);
    }
  }
  weekIndex = exportingIndex.length - 1 - weekIndex;
  const dayOfTheMonth: string =
    adjective == "previous"
      ? baseIndex == 0
        ? actualDays[6]
        : actualDays[baseIndex - 1]
      : baseIndex == 6
      ? actualDays[0]
      : actualDays[baseIndex + 1];
  const date: number = adjective == "previous" ? numberOfDaysOfTheMonth : 1;
  const month = [];
  month.push(dayOfTheMonth, months[index].month, String(date), weekIndex);
  return month;
}
