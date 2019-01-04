// this is the handler function which handles the user input
// you pass it an event which in context passes or fails (line 15)

var http = require('http');
// this is inbuilt in Node.js

exports.handler = function (event, context) {
    // the event is linked to event.json file

    var request = event.request;
    // within the event, you made a request which can be either a launch request which opens the app, an intent which askes Alexa something/to do something or a session ended request which closes the app
    // event.json has a request

    if (request.type === "LaunchRequest") {

        // here you are building the options object to pass into buildResponse in line 32

        let options = {}; // we pass these options into line 32
        options.speechText = "Welcome to Delicious Fudge. You can ask a question like, what\'s the recipe for a %s? ... Now, what can I help you with?'", // we need this in line 44
            // amazon asks you to explain here to the user what they need to do - usually ask them a question or prompt them to do something, otherwise they will need to be reprompted to interact with the skill
            options.repromptText = "You can ask questions such as, what\'s the recipe for a %s, or, you can say exit...Now, what can I help you with?" // needed in line 52 - not essential
        options.endSession = false;

        // we need to check if the event in context means something to the skill.  If it does it goes onto build the response with the options set up
        context.succeed(buildResponse(options));

    } else if (request.type === "IntentRequest") {

        let options = {};

        if (request.intent.name === "HelloIntent") {

            let name = request.intents.slots.FirstName.value;
            // gets the name stored in the slot from the request
            options.speechText = "Hello " + name + ". ";

            // alter the greeting depending on the time of day
            options.speechText += getWish();
            getQuote(function (quote, err) {
                // if there is an error, Alexa won't try to read it!
                if (err) {
                    context.fail(err);
                } else {
                    options.speechText += quote;
                    options.endSession = true;
                    // closes app after this exchange
                    context.succeed(buildResponse(options));
                }
            });

        } else {
            // this skill only has one intent - HelloIntent
            context.fail("Unknown intent")
        } else (request.type === "SessionEndedRequest") {

        } else {
            context.fail("Unknown intent type")
        }
    }

    function getWish() {
        var myDate = new Date();
        var hours = myDate.getHours();

        if (hours < 0) {
            hours = hours + 24;
            // corrects for 24 hour clock
        }

        if (hours < 12) {
            return "Good Morning. ";
        } else if (hours < 18) {
            return "Good afternoon. ";
        } else {
            return "Good evening. ";
        }
    }

    function getQuote(callback) {
        // can take data from API to include in response
        var url = "http://api.forismatic.com/api/1.0/json?method=getQuote&lang=en&format=json";

        // get a random quote from this quote API
        var req = http.get(url, function (res) {
            var body = "";

            // every time we get a response from the API, the chunk of data that we get will be passed to the body
            res.on('data', function (chunk) {
                body += chunk;
            });

            // after we have the data, trigger this 'end' function
            res.on('end', function () {
                // this replaces any symbols within the data to spaces (which Alexa can read)
                body = body.replace(/\\/g, '');
                // this converts the data we get back into JSON
                var quote = JSON.parse(body);
                // from this data, take just the quoteText
                callback(quote.quoteText)
            })
        });

        // if there are errors getting the data from the API, trigger this callback to log the error
        req.on('error', function (err) {
            callback('', err);
        });
    }

    function buildResponse(options) {
        // this is the function where you determine how the request that has just come in will be handled
        // the response object can be found in response.json

        var response = {
            version: "1.0",
            response: {
                outputSpeech: {
                    type: "PlainText",
                    text: options.speechText
                    // this will refer to the text passed into request as an option - line 14
                },
                shouldEndSession: options.endSession
            }
        };

        if (options.repromptText) {
            response.response.reprompt = {
                // this comes from the response file in the response object, labelled reprompt

            }
        };
    }
