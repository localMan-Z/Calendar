import { useState } from "react";
import { months, generateCurrentDate, actualDays } from "./dates";
import { useCalendar, useQuery } from "./calendarContext";
export default function Dates() {
  const { altDispatch } = useQuery();
  const { state } = useCalendar();
  const [truncatedDate, setDate] = useState(0);
  let [completeDate, setCompleteDate] = useState("");

  function parseInput(event) {
    let input = event.target.value;
    const dateRegex = new RegExp(/[/][0-9]{1,2}/, "g");

    if (input.length == 2) {
      Number(input) >= 12 ? (input = `12/`) : (input = `${input}/`);
      const date =
        months[Number(input.substring(0, input.length - 1)) - 1].days;
      setDate(date);
    } else if (input.length == 5) {
      let dayOfTheMonth = Number(input.match(dateRegex)[0].substring(1));
      dayOfTheMonth >= truncatedDate
        ? (dayOfTheMonth = truncatedDate)
        : (dayOfTheMonth = Number(dayOfTheMonth));
      input = `${input.substring(0, 3)}${dayOfTheMonth}/`;
    } else if (input.length >= 10) {
      input = input.slice(0, 10);
      completeDate = input;
      setCompleteDate(completeDate);
      constructMonth();
    }
    return input;
  }

  function constructMonth() {
    const { current } = generateCurrentDate();
    let yearGap =
      Number(current[3]) > Number(completeDate.substring(6))
        ? Number(current[3]) - Number(completeDate.substring(6))
        : Number(completeDate.substring(6)) - Number(current[3]);

    let lastDayIndex =
      state.month[state.month.length - 1].week[
        state.month[state.month.length - 1].week.length - 1
      ].dayIndex;
    while (yearGap > 0) {
      if (lastDayIndex == 6) {
        lastDayIndex = 0;
      } else {
        lastDayIndex += 1;
      }
      yearGap -= 1;
    }

    let baseMonthIndex: number, queryMonthIndex: number;
    for (let i = 0; i < months.length; i++) {
      if (months[i].month == state.presentDay[1]) {
        baseMonthIndex = i;
      }
      if (i == Number(completeDate.substring(0, 2)) - 1) {
        queryMonthIndex = i;
      }
    }

    const daysOfTheFutureMonths = months
      .map((monthInIteration, monthIndex) => {
        if (monthIndex >= baseMonthIndex && monthIndex <= queryMonthIndex) {
          return monthInIteration.days;
        }
      })
      .filter((index) => index != undefined);
    for (let i = 0; i < daysOfTheFutureMonths.length - 1; i++) {
      daysOfTheFutureMonths[i] == 31
        ? lastDayIndex >= 6
          ? (lastDayIndex = 2)
          : (lastDayIndex += 3)
        : daysOfTheFutureMonths[i] == 30
        ? lastDayIndex >= 6
          ? (lastDayIndex = 1)
          : (lastDayIndex += 2)
        : daysOfTheFutureMonths[i] == 29
        ? lastDayIndex >= 6
          ? (lastDayIndex = 0)
          : (lastDayIndex += 1)
        : lastDayIndex;
      lastDayIndex > 6 ? (lastDayIndex -= 7) : lastDayIndex;
    }

    months[queryMonthIndex].days - months[baseMonthIndex].days > 0
      ? (lastDayIndex =
          lastDayIndex +
          (months[queryMonthIndex].days - months[baseMonthIndex].days))
      : months[baseMonthIndex].days - months[queryMonthIndex].days > 0
      ? (lastDayIndex =
          lastDayIndex -
          (months[baseMonthIndex].days - months[queryMonthIndex].days))
      : lastDayIndex;

    let queryArray = [];
    queryArray.push(
      actualDays[lastDayIndex],
      months[queryMonthIndex].month,
      String(months[queryMonthIndex].days)
    );
    handleMonthQuery(queryArray);
  }
  function handleMonthQuery(queryArray: string[]) {
    altDispatch({
      type: "CONSTRUCT_QUERIED_MONTH",
      payload: {
        currenta: queryArray,
      },
    });
  }
  function searchForTheDay(array) {
    const date = completeDate.substring(3, 5);
    console.log(date);
    for (const week of array) {
      for (let i = 0; i < week.week.length; i++) {
        if (week.week[i].date == Number(date)) {
          console.log("a");
          console.log(week.week[i].day);
          return week.week[i].day;
        }
      }
    }
  }
  const { altState } = useQuery();
  if (altState.month.length != 0) {
    searchForTheDay(altState.month);
  }

  return {
    parseInput,
  };
}
