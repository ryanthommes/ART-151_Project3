/**
 * Upload image from computer and resize
 */
function upload() {
    const image_input = document.querySelector("#image-input");

    image_input.addEventListener("change", function() {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            
            resizeImage(reader.result, 800, 800);
        });
        reader.readAsDataURL(this.files[0]);
    });
}


/**
 * Reset page for new image
 */
function reset() {
    console.log("reset");

    clearMatrix();

    const image_input = document.querySelector("#image-input");
    const image_display = document.querySelector("#image-display");
    const pixelit_canvas = document.querySelector("#pixelit-canvas");
    const convert_button = document.querySelector("#convert-button");
    const reset_button = document.querySelector("#reset-button");

    image_input.value = "";
    image_input.style.display = "block";
    image_display.style.display = "none";
    pixelit_canvas.style.display ="none";

    reset_button.style.display = "none";
}


/**
 * resize a given image and draw it to the canvas
 * @param {*} imagePath
 * @param {*} newWidth
 * @param {*} newHeight
 */
function resizeImage(imagePath, newWidth, newHeight) {
    //create an image object from the path
    const originalImage = new Image();
    originalImage.src = imagePath;
 
    //get a reference to the canvas
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
 
    //wait for the image to load
    originalImage.addEventListener('load', function() {
        
        //get the original image size and aspect ratio
        const originalWidth = originalImage.naturalWidth;
        const originalHeight = originalImage.naturalHeight;
        const aspectRatio = originalWidth/originalHeight;
 
        //if the new height wasn't specified, use the width and the original aspect ratio
        if (newHeight === undefined) {
            //calculate the new height
            newHeight = newWidth/aspectRatio;
            newHeight = Math.floor(newHeight);
            
            //update the input element with the new height
            hInput.placeholder = `Height (${newHeight})`;
            hInput.value = newHeight;
        }
      
        //set the canvas size
        canvas.width = newWidth;
        canvas.height = newHeight;
         
        //render the image
        ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);

        const image_input = document.querySelector("#image-input");
        const image_display = document.querySelector("#image-display");
        const convert_button = document.querySelector("#convert-button");

        image_display.src = canvas.toDataURL();
        image_display.style.display = "block";
        image_display.style.visibility = "visible";

        image_input.style.display = "none";
        convert_button.style.display = "block";
    });
}


/**
 * Pixelate uploaded image
 */
function pixelate() {
    const image_display = document.querySelector("#image-display");
    const pixelit_canvas = document.querySelector("#pixelit-canvas");
    const convert_button = document.querySelector("#convert-button");
    const reset_button = document.querySelector("#reset-button");

    const config = {
        to : pixelit_canvas,
        //defaults to document.getElementById("pixelitcanvas")
        from : image_display, 
        //defaults to document.getElementById("pixelitimg")
        scale : 1.11125, 
        //from 0-50, defaults to 8
        palette : color_map 
        //defaults to a fixed pallete
        //maxHeight: 800, 
        //defaults to null
        //maxWidth: 800, 
        //defaults to null
    }

    const px = new pixelit(config);
    px.draw().pixelate();
    pixelit_canvas.style.display ="block";

    var colorsRGB = getColorsFromCanvas();
    var colorsDec = convertRGBtoDecimal(colorsRGB);
    drawMatrix(colorsDec);

    convert_button.style.display = "none";
    reset_button.style.display = "block";
}


/**
 * Extract color data from pixelated canvas
 */
function getColorsFromCanvas() {
    var pixelit_canvas = document.querySelector("#pixelit-canvas");
    var rgbArray = [];

    for(let y=0; y<pixelit_canvas.width; y+=100) {
        for(let x=0; x<pixelit_canvas.height; x+=100) {
            var data = pixelit_canvas.getContext("2d").getImageData(x, y, pixelit_canvas.width, pixelit_canvas.height).data;
            var rgb = [ data[0], data[1], data[2] ];
            rgbArray.push(rgb);
        }
    }

    return rgbArray;
}


/**
 * Convert the array of RGB color values into decimal color values
 * that the MIDI can read in
 * @param {*} rgbArray 
 */
function convertRGBtoDecimal(rgbArray) {
    var decimalArray = [];

    rgbArray.forEach(rgb => {
        var decimal = findNearestColor(color_map, rgb);
        decimalArray.push(decimal);
    })

    return decimalArray;
}


/**
 * Compares current color to all colors in color map
 * to find closest color
 * @param {*} color_map array of array of RGB values MIDI can display
 * @param {*} current array of RGB values to match against color_map
 */
function findNearestColor(color_map, current) {
    var index = -1;
    var shortestDistance = Number.MAX_SAFE_INTEGER;
  
    for (var i = 0; i < color_map.length; i++) {
        var match = color_map[i];
        var distance = getColorDistance(current, match);

        if (distance < shortestDistance) {
            index = i;
            shortestDistance = distance;
        }
    }
  
    return index;
}


/**
 * Gets distance between two colors (how close the two given colors are)
 * @param {*} current current color - array of RGB values
 * @param {*} match array of RGB values to match against
 */
function getColorDistance(current, match) {
    var redDifference   = current[0] - match[0];
    var greenDifference = current[1] - match[1];
    var blueDifference  = current[2] - match[2];

    var distance = redDifference*redDifference + greenDifference*greenDifference + blueDifference*blueDifference;

    return distance;
}