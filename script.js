function upload() {
    const image_input = document.querySelector("#image-input");
    const image_display = document.querySelector("#image-display");

    const convert_botton = document.querySelector("#convert-button");

    image_input.addEventListener("change", function() {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            image_display.src = reader.result;
            image_display.style.display = "block";

            image_input.style.display = "none";
            convert_botton.style.display = "block";

            // localStorage.setItem("image", reader.result);

        });
        reader.readAsDataURL(this.files[0]);
    });
}

function convert() {
    const config = {
        to : document.querySelector("#pixelit-canvas"),
        //defaults to document.getElementById("pixelitcanvas")
        from : document.querySelector("#image-display"), 
        //defaults to document.getElementById("pixelitimg")
        scale : 1.11125, 
        //from 0-50, defaults to 8
        //palette : [[r,g,b]], 
        //defaults to a fixed pallete
        //maxHeight: 300, 
        //defaults to null
        //maxWidth: 300, 
        //defaults to null
    }

    const px = new pixelit(config);
    px.draw().pixelate();

    const convert_botton = document.querySelector("#convert-button");
    convert_botton.style.display = "none";

    var colorsRGB = getColorsFromCanvas();
    var colorsDec = convertRGBtoDecimal(colorsRGB);
    drawMatrix(colorsDec);
}

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

function convertRGBtoDecimal(rgbArray) {
    var decimalArray = [];

    rgbArray.forEach(rgb => {
        var decimal = findNearestColor(color_map, rgb);
        decimalArray.push(decimal);
    })

    console.log(rgbArray);
    console.log(decimalArray);
    return decimalArray;
}

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

function getColorDistance(current, match) {
    var redDifference   = current[0] - match[0];
    var greenDifference = current[1] - match[1];
    var blueDifference  = current[2] - match[2];

    var distance = redDifference * redDifference + greenDifference * greenDifference + blueDifference * blueDifference;

    return distance;
}