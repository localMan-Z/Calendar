import month from "./future";
import {
  baseWeeks,
  days,
  actualDays,
  months,
  generateCurrentDate,
} from "./dates";
import "./App.css";
import { useEffect, useReducer } from "react";
let exportingIndex: {
  week: { date: number; day: string }[];
  weekIndex: string;
}[];
function App() {
  let calendar = {
    month: [],
  };
  function calendarReducer(
    state: any,
    action: { type: any; weekIndex: number; currentDay: string; currenta: any }
  ) {
    let constructedMonth;
    switch (action.type) {
      case "CONSTRUCT_CALENDAR":
        constructedMonth = constructCalendar(
          action.weekIndex,
          action.currentDay,
          action.currenta
        );
        console.log(constructedMonth);
        return {
          ...state,
          month: constructedMonth,
        };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(calendarReducer, calendar);
  const { current } = generateCurrentDate();
  const handleDispatch = (
    weekIndex: number,
    currentDay: string,
    currenta: string[]
  ) => {
    dispatch({
      type: "CONSTRUCT_CALENDAR",
      weekIndex,
      currentDay,
      currenta,
    });
  };
  useEffect(() => {
    baseWeeks.forEach((_, weekIndex) => {
      days.forEach((_, dayIndex) => {
        handleDispatch(weekIndex, actualDays[dayIndex], current);
      });
    });
  }, []);
  function assignDates(currenta: any[], lastDayGenerated: boolean) {
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
        dayIndex: actualDays.indexOf(actualDays[baseIndex - i]),
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
  function constructCalendar(
    weekIndex: number,
    currentDay: string,
    currenta: any
  ) {
    // console.log(weekIndex, currentDay, currenta);
    let week = assignDates(currenta, false);
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
    exportingIndex = month;
    return month;
  }

  function toggleMonth(adjective: string) {
    month(adjective, current, exportingIndex);
  }
  function extractDate(
    monthState: {
      month: {
        [x: string]: {
          week: {
            [x: string]: number;
            date: any;
          }[];
        };
      };
    },
    dayIndex: number,
    weekIndex: number
  ) {
    for (let i = 0; i < actualDays.length; i++) {
      if (dayIndex == monthState.month[weekIndex]?.week[i]?.dayIndex) {
        return monthState.month[weekIndex].week[i].date;
      }
    }
  }
  return (
    <div className="App">
      <div className="navBar">
        <div className="currentDay">{current}</div>
        <div className="currentDate">{current[2]}</div>
        <button
          className="prev"
          onClick={() => {
            toggleMonth("previous");
          }}
        >
          Prev
        </button>
        <button className="next" onClick={() => toggleMonth("next")}>
          Next
        </button>
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
            {days.map((day, dayIndex) => (
              <div key={dayIndex} className={`${day} ${actualDays[dayIndex]}`}>
                {extractDate(state, dayIndex, weekIndex)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
