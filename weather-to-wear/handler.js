'use strict';

var http = require('http');

exports.handler = function(event, context) {

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

                options.speechText = "Working. Get the weather. ";

                context.succeed(buildResponse(options));

            } else {
                throw("Unknown intent")
            }
        
        } else if (request.type === "SessionEndedRequest") {

        } else {
            throw("Unknown intent type");
        }
    } catch(e) {
        context.fail("Exception: " +e);
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

    if(options.repromptText) {
        response.response.reprompt = {
            outputSpeech: {
                type: "PlainText",
                text: options.repromptText
            }
        };
    }

    return response;



}