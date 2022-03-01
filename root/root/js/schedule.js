// nodemon dates.js
// generates list of schedules for each district

import { listHolidays, addSchedule } from "./database.js";

function main() {
    // make sure generateHolidayList has been run beforehand with the year you need
    var bool = generateSchedule(2022, "N-blue", 1, true);

    if (bool == false) {
        console.log("make sure to run generateHolidayList before this!!");
        return;
    }

    // if holidaylist has already been generated, execute the rest of the functions
    generateSchedule(2022, "N-green", 2, true);
    generateSchedule(2022, "N-purple", 3, true);
    generateSchedule(2022, "N-yellow", 4, true);
    generateSchedule(2022, "N-red", 5, true);

    generateSchedule(2022, "S-blue", 1, false);
    generateSchedule(2022, "S-green", 2, false);
    generateSchedule(2022, "S-purple", 3, false);
    generateSchedule(2022, "S-yellow", 4, false);
    generateSchedule(2022, "S-red", 5, false);
}

// main();

// given a year, (any extra holidays), district and the first day it starts on, produces a list of schedules for each recycling districts
// assumes list of holidays have already been added to db
// firstDay is one of Monday = 1, Tuesday = 2 ... Friday = 5
// district is one of
// gar is a boolean value that is true if the first year is garbage week, and false if it isn't
// assumes this function is run once
async function generateSchedule(year, district, firstDay, garb) {
    // check if the list of holidays already exist within db
    var holidays = await listHolidays(year);
    if (holidays == null) {
        console.log(`There is no list of holidays for year ${year}`);
        return false;
    }

    // grab the first day of the given day of the year
    var day = firstDay;
    var date = getDateOfFirstDay(day, year);
    var garbageDays = new Array();
    var greenDays = new Array();
    var garbool = garb;
    // skip jan 1
    var holidayCount = 1;

    // check if you are still in the "year"
    while (date.getFullYear() == year) {
        if (garbool) {
            garbageDays.push(date);
            garbool = false;
        } else {
            garbool = true;
        }
        greenDays.push(date);
        // check if there is a holiday during the week
        if (holidayCount < holidays.length) {
            while (holidayInTheWeek(date, holidays[holidayCount]) == true) {
                if (day == 5) {
                    day = 1;
                    date = new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000);
                } else {
                    ++day;
                    date = new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000);
                }
                holidayCount++;
                if (holidayCount >= holidays.length) {
                    break;
                }
            }
        }
        date = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    // add schedule to db
    await addSchedule(district, "garbage", garbageDays);
    await addSchedule(district, "green bin", greenDays);
    return true;
}

// given a starting date and a holiday (first in the list), check if the holiday is within a week from the starting date
function holidayInTheWeek(date, holidate) {
    var compareDate = date;
    for (let i = 0; i < 8; i++) {
        if (
            compareDate.getFullYear() == holidate.getFullYear() &&
            compareDate.getMonth() == holidate.getMonth() &&
            compareDate.getDate() == holidate.getDate()
        ) {
            return true;
        }
        compareDate = new Date(compareDate.getTime() + 24 * 60 * 60 * 1000);
    }
    return false;
}

// returns the first date given a day and a year
function getDateOfFirstDay(day, year) {
    var d = new Date();
    d.setFullYear(year);
    d.setMonth(0);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);

    while (d.getDay() != day) {
        d.setDate(d.getDate() + 1);
    }
    return d;
}