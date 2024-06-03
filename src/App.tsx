import {
  baseWeeks,
  days,
  actualDays,
  months,
  generateCurrentDate,
} from "./dates";
import "./App.css";
function App() {
  const { current } = generateCurrentDate();
  function assignDates(currenta: never[], lastDayGenerated: boolean) {
    function remainingDays() {
      let windowOfAvailableDays, days;
      for (const month of months) {
        if (month.month == currenta[1]) {
          days = month.days;
          windowOfAvailableDays = Number(days) - Number(currenta[2]);
        }
      }
      return { days, windowOfAvailableDays };
    }
    const days = !lastDayGenerated ? remainingDays().days : currenta[2];
    let baseIndex = actualDays.indexOf(currenta[0]);
    let workingDate = Number(currenta[2]);
    while (workingDate < Number(days)) {
      workingDate += 1;
      baseIndex == 6 ? (baseIndex = 0) : (baseIndex += 1);
    }
    const lastDay = actualDays[baseIndex];

    const currentWeekData = Array.from({ length: 7 }, (_, i) => {
      return {
        date: Number(days) - i,
        day: actualDays[baseIndex - i],
      };
    })
      .filter((days) => days.date >= 1)
      .filter((days) => days.day != undefined)
      .reverse();
    return {
      baseIndex,
      dayOfTheWeek: lastDay,
      month: currenta[1],
      week: currentWeekData,
    };
  }
  function constructCalendar(weekIndex: number, currentDay: string) {
    let week = assignDates(current, false);
    const cWeek = week.week;
    let month = [];
    month.push(cWeek);
    const availableWeeks = Math.ceil(
      (Number(week.week[week.week.length - 1].date) - 7) / 7
    );

    for (let i = 0; i <= availableWeeks; i++) {
      const date =
        week.baseIndex < 6
          ? week.week[week.week.length - 1].date - week.baseIndex - 1
          : week.week[week.week.length - 1].date - 7;
      const day = week.baseIndex < 6 ? "Sun" : week.dayOfTheWeek;
      const current = [day, week.month, date];
      const intermediateWeek = assignDates(current, true);
      const a = intermediateWeek.week;
      month.push(a);
      week = intermediateWeek;
    }
    month = month
      .filter((week) => week.length != 0)
      .reverse()
      .map((week, weekIndex) => {
        return {
          week,
          weekIndex: baseWeeks[weekIndex],
        };
      });
    const weeks = Array.from(
      { length: month.length },
      (_, i) => month[i].weekIndex
    );
    if (weeks.includes(baseWeeks[weekIndex])) {
      const week = month.filter(
        (week) => week.weekIndex == baseWeeks[weekIndex]
      )[0].week;
      for (let i = 0; i < week.length; i++) {
        if (week[i].day == currentDay) {
          return week[i].date;
        }
      }
    }
  }
  return (
    <div className="App">
      <div className="navBar">
        <div className="currentDay">{current[0]}</div>
        <div className="currentDate">{current[2]}</div>

        {/* <select id="dropDown">
          <option value="" disabled></option>
          {months.map((month, index) => (
            <option key={index} value={month.month}>
              {month.month}
            </option>
          ))}
        </select>*/}
      </div>
      <div className="calendarDates">
        <div id="dayColumn">
          {actualDays.map((day, index) => (
            <div key={index} id={day}>
              {day}
            </div>
          ))}
        </div>

        {baseWeeks.map((week, weekIndex) => (
          <div key={weekIndex} id={week} className="week">
            {days.map((day, baseIndex) => (
              <div
                key={baseIndex}
                className={`${day} ${actualDays[baseIndex]}`}
              >
                {constructCalendar(weekIndex, actualDays[baseIndex])}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
