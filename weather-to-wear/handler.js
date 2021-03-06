

'use strict';

var http = require('http');

exports.handler = function (event, context) {

    try {

        var request = event.request;

        if (request.type === "LaunchRequest") {

            let options = {};

            // options.speechText += getWish();
            options.speechText = "Hello. I can help you choose your outfit, based on the weather. Let's get started. Ask me, what shall I wear today?";
            options.repromptText = "Let me help you choose what to wear today.  Ask me, what shall I wear today?";
            options.endSession = false;

            context.succeed(buildResponse(options));

        } else if (request.type === "IntentRequest") {

            let options = {};

            if (request.intent.name === "HelloIntent") {

                options.speechText = "Working. Get the weather. ";

                // getWeather(function(forecast, err) {
                //     if(err) {
                //         context.fail(err);
                //     } else { 
                //         options.speechText += forecast;
                //         options.endSession = true;
                //         context.succeed(buildResponse(options));
                //     }
                // });

            } else {
                throw ("Unknown intent")
            }

        } else if (request.type === "SessionEndedRequest") {

        } else {
            throw ("Unknown intent type");
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
}

function getWish() {
    var myDate = new Date();
    var hours = myDate.getHours();

    // if (hours < 0) {
    //     hours = hours + 24;
    // }
    if (hours < 12) {
        return "Good Morning. ";
    } else if (hours < 18) {
        return "Good Afternoon. ";
    } else {
        return "Good Evening. ";
    }
}

// function getWeather() {

//     var url = 'https://api.darksky.net/forecast/63c7e1fe04debd05e2a196e39bc9e9c4/51.4570,0.2288?units=uk2';
//     var req = http.get(url, function(res) {

//         var body = "";

//         res.on('data', function(chunk) {
//             body += chunk;
//         });

//         res.on('end', function() {
//             body = body.replace(/||/g, '');
//             var forecast = JSON.parse(body);
//             callback(forecast.data.currently.summary)
//         });
//     });

//     req.on('error'. function(err) {
//         callback(err);
//     });
// }


function buildResponse(options) {

    var response = {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "PlainText",
                text: options.speechText
            },
            shouldEndSession: options.endSession
        }
    };

    if (options.repromptText) {
        response.response.reprompt = {
            outputSpeech: {
                type: "PlainText",
                text: options.repromptText
            }
        };
    }

    return response;



}