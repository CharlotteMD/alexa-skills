'use strict';

var http = require('http');

exports.handler = function (event, context) {

    try {

        var request = event.request;

        if (request.type === "LaunchRequest") {

            let options = {};

            options.speechText = "Hello. I can help you choose your outfit, based on the weather. Let's get started. Ask me, what shall I wear today?";
            options.repromptText = "Let me help you choose what to wear today.  Ask me, what shall I wear today?";
            options.endSession = false;

            context.succeed(buildResponse(options));

        } else if (request.type === "IntentRequest") {

            let options = {};

            if (request.intent.name === "HelloIntent") {
            

                options.speechText = " ";
                options.speechText += getWish();

                getQuote(function (quote, err) {
                    if (err) {
                        context.fail(err);
                    } else {
                        options.speechText += quote;
                        options.endSession = true;
                        context.succeed(buildResponse(options));
                    }
                });

            } else {
                context.fail("Unknown intent");
            }
 

        } else if (request.type === "SessionEndedRequest") {

        } else {
            throw ("Unknown intent type");
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
}

function getQuote(callback) {
    var url = "http://api.forismatic.com/api/1.0/json?method=getQuote&lang=en&format=json";

    var req = http.get(url, function (res) {
        var body = "";

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            body = body.replace(/\\/g, '');
            var quote = JSON.parse(body);
            callback(quote.quoteText)
        })
    });

    req.on('error', function (err) {
        callback('', err);
    });
}

function getWish() {
    var myDate = new Date();
    
    var day = myDate.getDay();

    if (day === 'Saturday' || day === 'Sunday') {
        return "It's the weekend! Jeans it is!";
    } else {
        return "Suit up!"
    }
}

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