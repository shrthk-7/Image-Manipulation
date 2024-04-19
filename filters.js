import Helpers from "./helpers.js";

const invertColors = ({ data }) => {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
};

const changeBrightness = ({ data }, amount) => {
  amount = Math.round(amount / 3);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Helpers.clamp(data[i] + amount, 0, 255);
    data[i + 1] = Helpers.clamp(data[i + 1] + amount, 0, 255);
    data[i + 2] = Helpers.clamp(data[i + 2] + amount, 0, 255);
  }
};

const changeSaturation = ({ data }, amount) => {
  for (let i = 0; i < data.length; i += 4) {
    const [h, s, v] = Helpers.rgbToHsv(data[i], data[i + 1], data[i + 2]);
    const [r, g, b] = Helpers.hsvToRgb(h, s + amount, v);
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
};

const changeHue = ({ data }, amount) => {
  for (let i = 0; i < data.length; i += 4) {
    const [h, s, v] = Helpers.rgbToHsv(data[i], data[i + 1], data[i + 2]);
    const [r, g, b] = Helpers.hsvToRgb(h + amount, s, v);
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
};

const blackAndWhite = ({ data }) => {
  // 0.299 ∙ Red + 0.587 ∙ Green + 0.114 ∙ Blue
  for (let i = 0; i < data.length; i += 4) {
    const grayLevel =
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = grayLevel;
    data[i + 1] = grayLevel;
    data[i + 2] = grayLevel;
  }
};

const blur = ({ data }, rows, cols) => {
  const dataCopy = [...data];
  const windowSize = 3;
  const halfWindowSize = Math.floor(windowSize / 2);
  const area = windowSize * windowSize;

  for (let x = halfWindowSize; x <= cols - halfWindowSize; x++) {
    for (let y = halfWindowSize; y <= rows - halfWindowSize; y++) {
      let r = 0;
      let g = 0;
      let b = 0;

      for (let i = -halfWindowSize; i <= halfWindowSize; i++) {
        for (let j = -halfWindowSize; j <= halfWindowSize; j++) {
          const idx = 4 * ((y + j) * cols + (x + i));
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
        }
      }

      r = Math.round(r / area);
      g = Math.round(g / area);
      b = Math.round(b / area);

      const idx = 4 * (y * cols + x);
      dataCopy[idx] = r;
      dataCopy[idx + 1] = g;
      dataCopy[idx + 2] = b;
    }
  }

  for (let i = 0; i < data.length; i += 4) {
    data[i] = dataCopy[i];
    data[i + 1] = dataCopy[i + 1];
    data[i + 2] = dataCopy[i + 2];
    data[i + 3] = dataCopy[i + 3];
  }
};

const contrastStretch = ({ data }, lowerLimit, upperLimit) => {
  if (!lowerLimit) lowerLimit = 0;
  if (!upperLimit) upperLimit = 355;

  let maxR = 0,
    minR = 255;
  let maxG = 0,
    minG = 255;
  let maxB = 0,
    minB = 255;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    maxR = Math.max(maxR, r);
    minR = Math.min(minR, r);

    maxG = Math.max(maxG, g);
    minG = Math.min(minG, g);

    maxB = Math.max(maxB, b);
    minB = Math.min(minB, b);
  }

  const range = upperLimit - lowerLimit;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const newR = Math.round((range * (r - minR)) / (maxR - minR) + lowerLimit);
    const newG = Math.round((range * (g - minG)) / (maxG - minG) + lowerLimit);
    const newB = Math.round((range * (b - minB)) / (maxB - minB) + lowerLimit);

    data[i] = Helpers.clamp(newR, 0, 255);
    data[i + 1] = Helpers.clamp(newG, 0, 255);
    data[i + 2] = Helpers.clamp(newB, 0, 255);
  }
};

const powerTransform = ({ data }, gamma) => {
  if (!gamma) gamma = 1.5;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const newR = Math.round(255 * Math.pow(r / 255, gamma));
    const newG = Math.round(255 * Math.pow(g / 255, gamma));
    const newB = Math.round(255 * Math.pow(b / 255, gamma));

    data[i] = Helpers.clamp(newR, 0, 255);
    data[i + 1] = Helpers.clamp(newG, 0, 255);
    data[i + 2] = Helpers.clamp(newB, 0, 255);
  }
};

const thresholding = ({ data }, threshold) => {
  if (!threshold) threshold = 128;
  blackAndWhite({ data });

  for (let i = 0; i < data.length; i += 4) {
    let val = data[i];
    val = 255 * (val >= threshold);

    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }
};

const resetImage = ({ data }, original) => {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = original[i];
    data[i + 1] = original[i + 1];
    data[i + 2] = original[i + 2];
    data[i + 3] = original[i + 3];
  }
};

export default {
  invertColors,
  changeBrightness,
  blackAndWhite,
  changeSaturation,
  changeHue,
  blur,
  contrastStretch,
  powerTransform,
  thresholding,
  resetImage,
};
