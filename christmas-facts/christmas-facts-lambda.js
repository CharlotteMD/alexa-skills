/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const factArr = data;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'Christmas Facts';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a Christmas fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const data = [
  'Tinsel was originally made from strands of silver.',
  'The Nutcracker premiered in Saint Petersburgh in 1892.',
  'White Christmas was Bing Crosby's best-selling single ever.',
  'Noel means birth in Latin.',
  'Xmas was first used in the 16th Century taking the Greek letter, Chi that looks like an 'X' which had long been used as an abbreviation for Christ.',
  'St Nicholas was a Greek bishop who lived in the 4th century and was famous for his generosity and gift giving.',
  'In the 1920s Coca Cola started using Santa Claus in their Christmas adverts but it was Thomas Nast, a cartoonist for Harper's Bazaar who first drew Father Christmas.',
  'The tallest ever snowman was actually a snow woman, named Olympia, who was 122ft tall. She was built in Maine in 2008.',
  'The most popular Christmas meal in Japan is KFC fried chicken.',
  'In The Philippines, Christmas celebrations can start as early as September, with celebrations for Santo Nino and continue as far as late January.',
  'In Sweden, Donald Duck is a Christmas Eve staple in his cartoon, 'From All of us to all of you', watched by millions every Christmas eve.',
  'In Poland, it is common to find money and even bits of hay under the table cloth of the Christmas meal.',
  'In fact, the book of Matthew is the only gospel to mention wise men or kings present at the birth of Christ and he doesn't state how many there were.',
];

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
