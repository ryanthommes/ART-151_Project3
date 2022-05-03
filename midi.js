nav = window.navigator;

console.log(nav)

if (nav.requestMIDIAccess) {
    nav.requestMIDIAccess().then(success);
} else {
    console.log('WebMIDI is not supported in this browser.');
}


/**
 * Indicates error connecting to MIDI
 */
function failure() {
    console.log('Could not connect MIDI');
}


/**
 * Input handling for MIDI if successfully connected
 * @param {*} midiAccess 
 */
function success(midiAccess) {
    console.log(midiAccess)
    midiAccess.addEventListener('statechange', updateDevices);
    const inputs = midiAccess.inputs;

    for (var output of midiAccess.outputs.values()) {
        device = output;
    }

    inputs.forEach((input) => {
        input.addEventListener('midimessage', handleInput);
    });
}


/**
 * Listens for events
 * @param {*} event 
 */
 function updateDevices(event) {
    console.log(event);
}


/**
 * Action to take on recieved input from MIDI
 * @param {*} input 
 */
 function handleInput(input) {
    const command = input.data[0];
    const key = input.data[1];
    const velocity = input.data[2];

    console.log(`command: ${command}, keyID: ${key}, type: ${velocity}`);

    switch (command) {
        // 144 is grid of keys
        case 144:
            if (velocity > 0) {
                keyOn(keyID);
            } else {
                keyOff(keyID);
            }
        break;
    }
 }