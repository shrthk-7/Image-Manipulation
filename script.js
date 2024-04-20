import Filters from "./filters.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const uploadBtn = document.getElementById("uploadBtn");
const editor = document.getElementById("editor");
const btns = document.getElementById("editorBtns");

let originalData = [];

const applyFilter = () => {
  originalData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
};

const loadDefault = () => {
  const img = new Image();
  img.src = "./apple.jpg";
  img.onload = function () {
    const ratio = img.width / img.height;
    const newWidth = ratio * 500;
    canvas.width = newWidth;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    applyFilter();
  };
};

// Image Upload
document
  .getElementById("imageInput")
  .addEventListener("change", (inputEvent) => {
    const file = inputEvent.target.files[0];
    if (!file) return;
    uploadBtn.classList.add("hidden");
    editor.classList.remove("hidden");
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
        applyFilter();
      };
    };
  });

//brightness slider
const activateFilterBtn = (filterName, filterFn) => {
  const btn = document.getElementById(`${filterName}Btn`);
  const slider = document.getElementById(`${filterName}Slider`);
  btn.addEventListener("click", (_clickEvent) => {
    btns.classList.add("hidden");
    slider.classList.remove("hidden");
  });
  slider.addEventListener("input", (inputEvent) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    Filters.resetImage(imageData, originalData);
    filterFn(imageData, inputEvent.target.value);
    ctx.putImageData(imageData, 0, 0);
  });
  slider
    .getElementsByClassName("applyBtn")[0]
    .addEventListener("click", (_clickEvent) => {
      slider.classList.add("hidden");
      btns.classList.remove("hidden");
      applyFilter();
    });
  slider
    .getElementsByClassName("cancelBtn")[0]
    .addEventListener("click", (_clickEvent) => {
      slider.classList.add("hidden");
      btns.classList.remove("hidden");
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      Filters.resetImage(imageData, originalData);
      ctx.putImageData(imageData, 0, 0);
    });
};

activateFilterBtn("brightness", Filters.changeBrightness);
activateFilterBtn("thresholding", Filters.thresholding);
activateFilterBtn("saturation", Filters.changeSaturation);
activateFilterBtn("powerTransform", Filters.powerTransform);

// Filter Button
// document
//   .getElementById("filterBtn")
//   .addEventListener("click", (_clickEvent) => {
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     // Filters.invertColors(imageData);
//     Filters.changeBrightness(imageData, -50);
//     // Filters.blackAndWhite(imageData);
// Filters.changeSaturation(imageData, 0.050);
//     // Filters.changeHue(imageData, 0.25);
//     // Filters.blur(imageData, canvas.height, canvas.width);
//     // Filters.contrastStretch(imageData);
//     // Filters.powerTransform(imageData, 1.2);
//     // Filters.thresholding(imageData);
//     ctx.putImageData(imageData, 0, 0);
//   });

// Download Button
document
  .getElementById("downloadBtn")
  .addEventListener("click", (_clickEvent) => {
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;

    const randomTag = Math.round(Math.random() * 1000);
    a.download = `image-${randomTag}.jpeg`;

    a.click();
  });

loadDefault();
