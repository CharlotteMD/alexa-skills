'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
      let speech = 'Do you either go through the blue door, or through the red door?';
      let reprompt = 'You have two options, the blue door, or the red door.';
      this.ask(speech, reprompt);
    },

    EnterDoorIntent() {
      let speech = '';
      let reprompt = '';

      if (this.$inputs.color.value === 'blue') {
        speech = 'You chose to go through the blue door. There is a dark corridor. Suddenly you hear a sound from the room at the end. Do you want to follow the sound?';
        reprompt = 'Please say yes or no.'
        this.followUpState('BlueDoorState').ask(speech, reprompt);
      } else if (this.$inputs.color.value === 'red') {
        speech = 'You chose to go through the red door. You find yourself in a small room with only one door, and a dog sleeping in front of it. To go through it, you would have to wake up the dog. Do you want to do it?';
        reprompt = 'Please say yes or no.';
        this.followUpState('RedDoorState').ask(speech, reprompt);
      } else {
        speech = 'Please choose either the blue door or the red door.';
        reprompt = 'Say blue door, or red door.';
        this.ask(speech, reprompt);
      }
    },

    BlueDoorState: {
    YesIntent() {
        let speech = 'Blue Door: You chose Yes!';
        this.tell(speech);
    },

    NoIntent() {
        let speech = 'Blue Door: You chose No!';
        this.tell(speech);
    },

    Unhandled() {
            this.followUpState('BlueDoorState')
                .ask('You have to answer with yes or no.', 'Please say yes or no');
        },
},
RedDoorState: {
    YesIntent() {
        let speech = 'Red Door: You chose Yes!';
        this.tell(speech);
    },

    NoIntent() {
        let speech = 'Red Door: You chose No!';
        this.tell(speech);
    },

    Unhandled() {
            this.followUpState('RedDoorState')
                .ask('You have to answer with yes or no.', 'Please say yes or no');
        },
},

Unhandled() {
    this.toIntent('LAUNCH');
},

});

module.exports.app = app;
