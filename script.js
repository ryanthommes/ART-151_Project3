function upload() {
    const image_input = document.querySelector("#image-input");
    const image_display = document.querySelector("#image-display");

    image_input.addEventListener("change", function() {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            image_display.src = reader.result;

            localStorage.setItem("image", reader.result);

        });
        reader.readAsDataURL(this.files[0]);
    });
}