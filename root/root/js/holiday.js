import axios from "axios";
import { addHoliday } from "./database.js";

// nodemon holiday.js
// generates a list of holidays (from holiday api)

function main() {
    // generate a list of holidays and store into db
    var year = 2022;
    var easter = new Date(2022, 3, 18);
    var arr = new Array();
    arr.push(easter);
    generateHolidayList(year, arr);
}

// main()

// given a year, places the list of holidays in BC in Date() format into db
// adds any extraDates (none bc holidays in list of Date() format) to the list as well
async function generateHolidayList(year, extraDates) {
    var options = {
        method: "GET",
        url: `https://public-holiday.p.rapidapi.com/${year}/CA`,
        headers: {
            "x-rapidapi-host": "public-holiday.p.rapidapi.com",
            "x-rapidapi-key": process.env.HOLIDAY_API_KEY,
        },
    };

    var arr = new Array();

    axios
        .request(options)
        .then(async function (response) {
            // insert only BC holidays into arr
            var responses = response.data;
            responses.forEach(function (holiday) {
                var countries = holiday.counties;
                if (countries == null) {
                    var d = splitDate(holiday.date);
                    arr.push(d);
                } else {
                    countries.forEach(function (province) {
                        if (province == "CA-BC") {
                            var d = splitDate(holiday.date);
                            arr.push(d);
                        }
                    });
                }
            });

            if (extraDates != null) {
                for (let i = 0; i < extraDates.length; i++) {
                    // add easter monday here
                    arr = addDateToList(extraDates[i], arr);
                }
            }

            // add the dates into db
            await addHoliday(year, arr);
        })
        .catch(function (error) {
            console.error(error);
        });
}

// given a date in "YYYY-MM-DD", returns a Date()
function splitDate(strDate) {
    var splited = strDate.split("-");
    // month is zero indexed
    return new Date(splited[0], splited[1] - 1, splited[2]);
}

// given Date() and a list of Date()s, insert the date into the list from Jan - Dec
// this function assumes that the date and list of dates are all in the same year
function addDateToList(dateToAdd, lodates) {
    for (let i = 0; i < lodates.length; i++) {
        var dateInList = lodates[i];
        if (dateToAdd.getTime() <= dateInList.getTime()) {
            lodates.splice(i, 0, dateToAdd);
            break;
        }
    }
    return lodates;
}