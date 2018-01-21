const request = require('axios');
// const AWS = require('aws-sdk');
const Speech = require('ssml-builder');
const Alexa = require('alexa-sdk');
const moment = require('moment-timezone');
const { extractWodsFromHTML, formatResponse } = require('./helpers');

const urls = {
  sudbury: 'http://www.crossfittiltii.com/wod/',
  waltham: 'http://www.crossfittiltwaltham.com/wod/'
}

const languageString = {
    "en": {
        "translation": {
            "HELP_MESSAGE": "Ask me for today's, yesterday's, or tomorrow's workout.",
            "STOP_MESSAGE": "Ok, come back soon.",
            "NO_WOD_MESSAGE": "I'm sorry, I couldn't find a workout for that day or location."
        },
    }
  }

module.exports.getWodIntent = (event, context, callback) => {
  // const alexa = Alexa.handler(event, context);
  // alexa.APP_ID = APP_ID;
  // To enable string internationalization (i18n) features, set a resources object.

  console.log(event);
  var speech = new Speech();
  let wods;

  // var requestLocation = 'waltham';
  // var requestDay = new Date();
  var requestDay = event.request.intent.slots.day.value || moment(new Date()).tz('America/New_York');
  var requestLocation = event.request.intent.slots.location.value || 'Waltham';
  requestLocation = requestLocation.toLowerCase();
  requestDay = moment(requestDay).date();

  if (urls[requestLocation] === undefined) {
    console.log("Could not find a WOD for " + requestLocation)
      speech.say("I'm sorry, I couldn't find a workout for that day or location.");
      callback(null, formatResponse(speech.ssml()));
  } else {
    request(urls[requestLocation])
      .then(({data}) => {
        console.log("Getting WOD for " + requestDay + " at " + requestLocation);
        wods = extractWodsFromHTML(data)
        console.log(wods)
        if (wods[requestDay] === undefined) {
          console.log("Could not find a WOD for " + requestDay)
          speech.say("I'm sorry, I couldn't find a workout for that day or location.");
        } else {
          console.log("The WOD for " + requestDay+ " is " + wods[requestDay].title);
          console.log(wods[requestDay].wod.join(","));
          speech.say(`The workout of the day is ${wods[requestDay].title}`)
                .sentence(`${wods[requestDay].title} is `);
          wods[requestDay].wod.forEach(function (wod, i) {
            speech.sentence(wod);
          })
        }
        callback(null, formatResponse(speech.ssml()));
      })
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

// exports.handler = function (event, context) {
//     const alexa = Alexa.handler(event, context);
//     alexa.APP_ID = APP_ID;
//     // To enable string internationalization (i18n) features, set a resources object.
//     alexa.resources = languageStrings;
//     alexa.registerHandlers(handlers);
//     alexa.execute();
// };
