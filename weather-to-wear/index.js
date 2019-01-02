exports.handler = function(event, context) {

    var request = event.request;

    if (request.type === "LaunchRequest") {

    } else if (request.type === "IntentRequest") {
    
    } else if (request.type === "SessionEndedRequest") {

    } else {
        context.fail("Unknown intent type");
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