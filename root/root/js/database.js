import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";

// HOLIDAY: adds a list of holidays of the given year
async function addHoliday(year, loh) {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();

        var holiday = {
            year: year,
            holidays: loh,
        };
        const result = await client
            .db("myFirstDatabase")
            .collection("holidays")
            .insertOne(holiday);
        console.log(
            `New holiday list created with the following id: ${result.insertedId}, for year ${result.year}`
        );
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

// HOLIDAY: given a year, list the holidays; if there is none, return null
async function listHolidays(year) {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();

        const yearList = await client
            .db("myFirstDatabase")
            .collection("holidays")
            .findOne({ year: year });

        if (yearList) {
            console.log(`Found a list of holidays with from year ${year}`);
            return yearList.holidays;
        } else {
            console.log(`There is no list of holidays from year ${year}`);
            return null;
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

// SCHEDULE: adds a list of garbage/greenbin days
async function addSchedule(district, bin, days) {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();

        var schedule = {
            bin: bin,
            dates: days,
        };
        const result = await client
            .db("myFirstDatabase")
            .collection(district)
            .insertOne(schedule);
        console.log(
            `New schedule added created with the following id: ${result.insertedId}, for district ${district}, for bin ${result.bin}`
        );
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

// SCHEDULE: given a district and which bin, returns a list of dates
async function listSchedule(district, bin) {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();

        const scheduleDates = await client
            .db("myFirstDatabase")
            .collection(district)
            .findOne({ bin: bin });

        if (scheduleDates) {
            console.log(
                `Found a list of dates from district ${district} and bin ${bin}`
            );
            return scheduleDates.dates;
        } else {
            console.log(
                `There is no list of dates from district ${district} and bin ${bin}`
            );
            return null;
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

export { addHoliday, listHolidays, addSchedule, listSchedule };

async function main(year) {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        // we should block further execution until this operation has completed with await
        await client.connect();

        // prints the names of the databases in the cluster
        // await listDatabases(client);

        /*
        // create a single listing
        await createListing(client, {
          name: "Lovely Loft",
          summary: "A charming loft in Paris",
          bedrooms: 1,
          bathrooms: 1,
        });
        */

        /*
        // create multiple listings
        await createMultipleListings(client, [
          {
            name: "Infinite Views",
            summary: "Modern home with infinite views from the infinity pool",
            property_type: "House",
            bedrooms: 5,
            bathrooms: 4.5,
            beds: 5,
          },
          {
            name: "Private room in London",
            property_type: "Apartment",
            bedrooms: 1,
            bathroom: 1,
          },
          {
            name: "Beautiful Beach House",
            summary:
              "Enjoy relaxed beach living in this house with a private beach",
            bedrooms: 4,
            bathrooms: 2.5,
            beds: 7,
            last_review: new Date(),
          },
        ]);
        */

        // find a single listing with the name
        // await findOneListingByName(client, "Infinite Views");

        // await addHoliday(client, 2022, [
        //   "2022-01-01",
        //   "2022-02-21",
        //   "2022-04-15",
        //   "2022-05-23",
        //   "2022-07-01",
        //   "2022-08-01",
        //   "2022-09-05",
        //   "2022-09-30",
        //   "2022-10-10",
        //   "2022-11-11",
        //   "2022-12-25",
        // ]);

        // await listHolidays(client, 2022);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

// main().catch(console.error);

// prints the names of the databases in the cluster
async function listDatabases(client) {
    let databasesList;
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach((db) => console.log(` -${db.name}`));
}

// create a single listing
async function createListing(client, newListing) {
    const result = await client
        .db("sample_airbnb")
        .collection("listingsAndReviews")
        .insertOne(newListing);
    console.log(
        `New listing created with the following id: ${result.insertedId}`
    );
}

// create multiple listings
async function createMultipleListings(client, newListings) {
    const result = await client
        .db("sample_airbnb")
        .collection("listingsAndReviews")
        .insertMany(newListings);
    console.log(
        `${result.insertedCount} new listing(s) created with the following id(s):`
    );
    console.log(result.insertedIds);
}

// find a single listing
async function findOneListingByName(client, nameOfListing) {
    const result = await client
        .db("sample_airbnb")
        .collection("listingsAndReviews")
        .findOne({ name: nameOfListing });

    if (result) {
        console.log(
            `Found a listing in the collection with the name '${nameOfListing}':`
        );
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}`);
    }
}