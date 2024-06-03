import { actualDays, months } from "./dates";
export default function month(adjective, currentMonth) {
  if (adjective == "previous") {
    let index =
      months.indexOf(currentMonth[1]) == 0
        ? 11
        : months.indexOf(currentMonth[1]) - 1;
    let baseIndex = actualDays.indexOf(currentMonth[0]);
    let workingDay = Number(currentMonth[2]);
    while (workingDay > 1) {
      workingDay -= 1;
      baseIndex == 0 ? (baseIndex = 6) : (baseIndex -= 1);
    }
    let lastDay = actualDays[baseIndex - 1];
    let days = months[index].days;
    return { lastDay, days };
  }
}
