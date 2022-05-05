nav = window.navigator;
console.log(nav);

// list of key IDs from left to right, top to bottom
keyID_list = [
    64, 65, 66, 67, 96, 97, 98, 99,
    60, 61, 62, 63, 92, 93, 94, 95,
    56, 57, 58, 59, 88, 89, 90, 91,
    52, 53, 54, 55, 84, 85, 86, 87,
    48, 49, 50, 51, 80, 81, 82, 83,
    44, 45, 46, 47, 76, 77, 78, 79,
    40, 41, 42, 43, 72, 73, 74, 75,
    36, 37, 38, 39, 68, 69, 70, 71
];

// 128 possible colors for launchpad
// each decimal index represents the rgb color it would show
color_map = [
    [179,179,179], [221,221,221], [255,255,255], [255, 179, 179], [255, 97, 97], [221, 97, 97], [179, 97, 97],
    [255, 243, 213], [255, 179, 97], [221, 140, 97], [179, 118, 97], [255, 238, 161], [255, 255, 97], [221, 221, 97], [179, 179, 97],
    [221, 255, 161], [194, 255, 97], [161, 221, 97], [194, 255, 179], [97, 255, 97], [97, 255, 97], [97, 221, 97], [97, 179, 97],
    [194, 255, 194], [97, 255, 140], [97, 221, 118], [97, 179, 107], [194, 255, 204], [97, 255, 204], [97, 221, 161], [97, 221, 161],
    [194, 255, 243], [97, 255, 233], [97, 221, 194], [97, 179, 150], [194, 243, 255], [97, 238, 255], [97, 199, 221], [97, 161, 179],
    [194, 221, 255], [97, 199, 255], [97, 161, 221], [97, 129, 179], [161, 140, 255], [97, 97, 255], [97, 97, 221], [97, 97, 179],
    [204, 179, 255], [161, 97, 255], [129, 97, 221], [118, 97, 179], [255, 179, 255], [255, 97, 255], [221, 97, 221], [179, 97, 179],
    [255, 179, 213], [255, 97, 194], [221, 97, 161], [179, 97, 140], [255, 118, 97], [233, 179, 97], [221, 194, 97], [161, 161, 97],
    [97, 179, 97], [97, 179, 140], [97, 140, 213], [97, 97, 255], [97, 179, 179], [140, 97, 243], [204, 179, 194], [140, 118, 129],
    [255, 97, 97], [243, 255, 161], [238, 252, 97], [204, 255, 97], [118, 221, 97], [97, 255, 204], [97, 233, 255], [97, 161, 255],
    [140, 97, 255], [204, 97, 252], [238, 140, 221], [161, 118, 97], [255, 161, 97], [221, 249, 97], [213, 255, 140], [97, 255, 97],
    [179, 255, 161], [204, 252, 213], [179, 255, 246], [204, 228, 255], [161, 194, 246], [213, 194, 249], [249, 140, 255], [255, 97, 204],
    [255, 194, 97], [243, 238, 97], [228, 255, 97], [221, 204, 97], [179, 161, 97], [97, 186, 118], [118, 194, 140], [129, 129, 161],
    [129, 140, 204], [204, 170, 129], [221, 97, 97], [249, 179, 161], [249, 186, 118], [255, 243, 140], [233, 249, 161], [213, 238, 118],
    [129, 129, 161], [249, 249, 213], [221, 252, 228], [233, 233, 255], [228, 213, 255], [179, 179, 179], [213, 213, 213], [249, 255, 255],
    [233, 97, 97], [170, 97, 97], [129, 246, 97], [97, 179, 97], [243, 238, 97], [179, 161, 97], [238, 194, 97], [194, 118, 97]
];


/**
 * Setup midi
 */
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
    const keyID = input.data[1];
    const velocity = input.data[2];

    console.log(`command: ${command}, keyID: ${keyID}, type: ${velocity}`);

    switch (command) {
        case 144:
            if (velocity != 0) {
                colorKeys(keyID, 0);
            }
            break;
    }
}


/**
 * Listens for events
 * @param {number} key ID of key to color
 * @param {number} color 1 of 128 possible colors
 */
function colorKeys(keyID, color) {
    device && device.send([0x90, keyID, color]);
}


/**
 * Draws color array to launchpad matrix
 * @param {array} colorArray array of colors to draw
 */
function drawMatrix(colorArray) {
    var i = 0;
    console.log(colorArray);

    keyID_list.forEach(id => {
        try {

            // assigns color value to MIDI key that was pressed
            colorKeys(id, colorArray[i]);
            i++;

        } catch {

            console.log("No MIDI found, no keys to color...");

        }
    })
}


/**
 * Clears launchpad matrix
 */
function clearMatrix() {
    keyID_list.forEach(id => {
        try {

            // assigns color value to MIDI key that was pressed
            colorKeys(id, 0);
            i++;

        } catch {

            console.log("No MIDI found, no keys to color...");

        }
    })
}