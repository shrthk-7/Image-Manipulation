import Filters from "./filters.js";
import VersionControl from "./versionControl.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const btns = document.getElementById("editorBtns");
const loadingScreen = document.getElementById("loading");
const sliderDiv = document.querySelector(".sliderDiv");

let currentData = [];

const applyFilter = () => {
  setTimeout(() => {
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    currentData = VersionControl.applyChange(data);
  }, 500);
};

const undoFilter = () => {
  currentData = VersionControl.undoChange();
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  Filters.resetImage(imageData, currentData);
  ctx.putImageData(imageData, 0, 0);
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

const setLoading = (loadingState) => {
  if (loadingState) {
    loadingScreen.classList.remove("hidden");
  } else {
    loadingScreen.classList.add("hidden");
  }
};

// Image Upload
document
  .getElementById("imageInput")
  .addEventListener("change", (inputEvent) => {
    const file = inputEvent.target.files[0];
    if (!file) return;
    // uploadBtn.classList.add("hidden");
    // editor.classList.remove("hidden");
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

const activateSlider = (filterName, filterFn, needsLoading) => {
  const btn = document.getElementById(`${filterName}Btn`);
  const slider = document.getElementById(`${filterName}Slider`);

  btn.addEventListener("click", (_clickEvent) => {
    const children = sliderDiv.children;
    for (let i = 0; i < children.length; i++) {
      children[i].classList.add("hidden");
    }
    slider.classList.remove("hidden");
  });

  slider.addEventListener("input", (inputEvent) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    /*
      In case of slow filter functions (eg Blur),
      a loading screen is shown which is removed once
      the filter is done prcessing
      However the call stack needs to be emptied before repainting
      hence the immediate setTimeout() is needed
    */
    if (needsLoading) {
      setLoading(true);
      setTimeout(() => {
        Filters.resetImage(imageData, currentData);
        filterFn(imageData, Number(inputEvent.target.value));
        ctx.putImageData(imageData, 0, 0);
        setLoading(false);
      }, 0);
    } else {
      Filters.resetImage(imageData, currentData);
      filterFn(imageData, Number(inputEvent.target.value));
      ctx.putImageData(imageData, 0, 0);
    }
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
      Filters.resetImage(imageData, currentData);
      ctx.putImageData(imageData, 0, 0);
    });
};

const activateFilterBtn = (filterName, filterFn) => {
  const btn = document.getElementById(`${filterName}Btn`);
  btn.addEventListener("click", () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    filterFn(imageData);
    ctx.putImageData(imageData, 0, 0);
  });
};

activateSlider("brightness", Filters.changeBrightness);
activateSlider("thresholding", Filters.thresholding);
activateSlider("saturation", (imageData, amount) => {
  Filters.changeSaturation(imageData, amount / 100);
});
activateSlider("powerTransform", Filters.powerTransform);
activateSlider("contrast", Filters.changeContrast);
activateSlider(
  "blur",
  (imageData, blurRadius) => {
    Filters.blur(imageData, blurRadius, canvas.height, canvas.width);
  },
  true
);
activateSlider("hue", (imageData, amount) => {
  Filters.changeHue(imageData, amount / 100);
});
activateSlider("pixelate", (imageData, amount) => {
  Filters.pixelate(imageData, amount, canvas.height, canvas.width);
});

activateFilterBtn("b&w", (imageData) => {
  Filters.blackAndWhite(imageData);
  applyFilter();
});
activateFilterBtn("invert", (imageData) => {
  Filters.invertColors(imageData);
  applyFilter();
});
activateFilterBtn("edgeDetection", (imageData) => {
  Filters.edgeDetection(imageData, canvas.height, canvas.width);
  applyFilter();
});

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

document.getElementById("undoBtn").addEventListener("click", undoFilter);
loadDefault();
