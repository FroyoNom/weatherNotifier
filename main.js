const request = require("request");
const CronJob = require("cron").CronJob;
const dotenv = require("dotenv").config();
const accountSid = process.env.ACCT_SID;
const authToken = process.env.AUTHTOKEN;
const client = require("twilio")(accountSid, authToken);

const PHONE = process.env.PHONE_NUM;
const API = process.env.API_KEY;
const LOCATION = process.argv[2]; //Format = city,countrycode to be more accurate
// const LAT = process.env.LAT;
// const LON = process.env.LON;
// const CITY = process.env.CITY;

// CronJob
// 0 8 * * * = everyday at 8am
new CronJob(
  "0 8 * * *",
  () => {
    request(
      `https://api.openweathermap.org/data/2.5/weather?q=${LOCATION}&units=metric&appid=${API}`,
      (err, response, body) => {
        if (err) {
          console.log(err);
        } else {
          let data = JSON.parse(body);
          client.messages
            .create({
              body: `Current Weather: ${data.main.temp}°C. ${data.weather[0].description}. Feels like ${data.main.feels_like}°C.`,
              to: PHONE,
              from: "+17867893239"
            })
            .then("Message Sent");
        }
      }
    );
  },
  null,
  true,
  "America/Los_Angeles"
);
