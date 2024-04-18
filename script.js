import Filters from "./filters.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

document
  .getElementById("imageInput")
  .addEventListener("change", (inputEvent) => {
    const file = inputEvent.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (readerEvent) {
      const img = new Image();
      img.src = readerEvent.target.result;

      img.onload = function () {
        const ratio = img.width / img.height;
        const newWidth = ratio * 500;
        canvas.width = newWidth;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    };
  });

const btn = document.getElementById("btn");

btn.addEventListener("click", () => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // Filters.invertColors(imageData);
  // Filters.changeBrightness(imageData, -50);
  // Filters.blackAndWhite(imageData);
  // Filters.changeSaturation(imageData, 0.05);
  // Filters.changeHue(imageData, 0.25);
  // Filters.blur(imageData, canvas.height, canvas.width);
  // Filters.contrastStretch(imageData);
  // Filters.powerTransform(imageData, 1.2);
  Filters.thresholding(imageData);
  ctx.putImageData(imageData, 0, 0);
});
