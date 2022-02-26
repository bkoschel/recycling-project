// nodemon printSched.js
// prints upcoming green bin or garbage days based on the district specified

import { listSchedule } from "./database.js";

// given a district, accesses the db to return the nearest upcoming greenbin collection day
// assumes today is "2022" (as of feb 12, 2022)
async function printGreenBin(district) {
  var schedules = await listSchedule(district, "green bin");
  if (schedules == null) {
    schedules.log(`There is no green bin schedule in db for ${district}`);
    return false;
  }
  //   console.log(schedules);
  var today = new Date();
  for (let i = 0; i < schedules.length; i++) {
    var compare = schedules[i];
    if (
      today.getMonth() < compare.getMonth() ||
      (today.getMonth() == compare.getMonth() &&
        today.getDate() < compare.getDate())
    ) {
      return schedules[i];
    }
  }
  console.log(
    `No more data available. Please generate holidays and schedules in db for year ${today.getFullYear()}`
  );
}

// given a district, accesses the db to return the nearest upcoming garbage collection day
// assumes today is "2022" (as of feb 12, 2022)
async function printGarbage(district) {
  var schedules = await listSchedule(district, "garbage");
  if (schedules == null) {
    schedules.log(`There is no garbage schedule in db for ${district}`);
    return false;
  }
  //   console.log(schedules);
  var today = new Date();
  for (let i = 0; i < schedules.length; i++) {
    var compare = schedules[i];
    if (
      today.getMonth() < compare.getMonth() ||
      (today.getMonth() == compare.getMonth() &&
        today.getDate() < compare.getDate())
    ) {
      return schedules[i];
    }
  }
  console.log(
    `No more data available. Please generate holidays and schedules in db for year ${today.getFullYear()}`
  );
}

console.log(await printGreenBin("N-blue"));
console.log(await printGarbage("N-blue"));
