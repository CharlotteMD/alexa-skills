'use strict';

var http = require('http');

exports.handler = function (event, context) {

    try {

        var request = event.request;
        var session = event.session;

        if (!event.session.attributes) {
            event.session.attributes = {};
        }

        if (request.type === "LaunchRequest") {
            
            handleLaunchRequest(context);
            
        } else if (request.type === "IntentRequest") {

            if (request.intent.name === "HelloIntent") {
            
                handleHelloIntent(request, context);

            } else if (request.intent.name === "QuoteIntent") {
                
                handleQuoteIntent(request, context, session);

            } else if (request.intent.name === "NextQuoteIntent") {

                handleNextQuoteIntent(request, context, session);

            } else if (request.intent.name === "AMAZON.StopIntent" || request.intent.name === "AMAZON.CancelIntent") {
                
                context.succeed(buildResponse({
                    speechText: "Good bye.",
                    endSession: true
                }))

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



function getWish() {
    var myDate = new Date();
    
    var day = myDate.getDay();

    if (day === 'Saturday' || day === 'Sunday') {
        return "It's the weekend! No need to wake up! ";
    } else {
        return "Time to wake up! "
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

    if (options.session && options.session.attributes) {
        response.sessionAttributes = options.session.attributes;
    }

    return response;
}

function handleLaunchRequest(context) {
    let options = {};

    options.speechText = "Hello. Who needs waking up?";
    options.repromptText = "Tell me who I should wake up?";
    options.endSession = false;

    context.succeed(buildResponse(options));
}

function handleHelloIntent(request, context) {
    let options = {};

    let name = request.intent.slots.FirstName.value;
    
    options.speechText = `Hello ${name}. `;
    
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

 
}

function handleQuoteIntent(request, context, session) {
    let options = {};
    options.session = session;

    getQuote(function (quote, err) {
        if (err) {
            context.fail(err);
        } else {
            options.speechText = quote;
            options.speechText += "Are you still in need of more inspiration?";
            options.repromptText = "If you'd like to hear another quote, say yes.";
            options.session.attributes.quoteIntent = true;
            options.endSession = false;
            context.succeed(buildResponse(options));
        }
    });
}

function handleNextQuoteIntent(request, context, session) {
    let options = {};
    options.session = session;

    if (session.attributes.quoteIntent) {
        getQuote(function (quote, err) {
            if (err) {
                context.fail(err);
            } else {
                options.speechText = quote;
                options.speechText += "Are you still in need of more inspiration?";
                options.repromptText = "If you'd like to hear another quote, say yes.";
                // options.session.attributes.quoteIntent = true;
                options.endSession = false;
                context.succeed(buildResponse(options));
            }
        });
    } else {
        options.speechText = "Wrong invocation of this intent";
        options.endSession = true;
        context.succeed(buildResponse(options));
    }
    
}