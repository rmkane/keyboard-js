import "./style.css";

import keys from "./data/keys.json";
import fullLayout from "./data/layouts/full.json";

type KeyValue = { key: string; code: string };
type KeyData = { which: number } & KeyValue;

type LayoutData = {
  data: {
    region: string;
    keys: number[] | number[][] | number[][][];
  };
  metadata: {
    display: "grid" | "flex";
    rows?: number;
    cols?: number;
  };
};

const keyMap = (keys as KeyData[]).reduce(
  (lookup, { which, key, code }) => lookup.set(which, { key, code }),
  new Map<number, KeyValue>()
);

type OperatingSystemType = "mac" | "windows";
type KeyboardType = "full" | "tkl";

type LayoutOptions = {
  keyboardType?: KeyboardType;
  os?: OperatingSystemType;
};

function isNumberArray(value: any): value is number[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "number")
  );
}

function isNumberArray2D(value: any): value is number[][] {
  return Array.isArray(value) && value.every(isNumberArray);
}

function isNumberArray3D(value: any): value is number[][][] {
  return Array.isArray(value) && value.every(isNumberArray2D);
}

const defaultOptions: LayoutOptions = {
  keyboardType: "full",
  os: "windows",
};

function initializeLayout(
  selector: string,
  options: LayoutOptions = defaultOptions
) {
  const keyboardElements = document.querySelectorAll<HTMLDivElement>(selector);

  const opts: LayoutOptions = { ...defaultOptions, ...options };

  for (let keyboardEl of keyboardElements) {
    renderKeyboard(keyboardEl, opts);
  }
}

function renderKeyboard(keyboardEl: HTMLDivElement, opts: LayoutOptions) {
  keyboardEl.replaceChildren();

  switch (opts.keyboardType) {
    case "full":
      return renderFullKeyboard(keyboardEl, opts);
    case "tkl":
      return renderTklKeyboard(keyboardEl, opts);
  }
}

function renderFullKeyboard(keyboardEl: HTMLDivElement, opts: LayoutOptions) {
  (fullLayout as LayoutData[]).forEach(({ data, metadata }) => {
    const regionEl = document.createElement("div");
    regionEl.dataset.region = data.region;
    regionEl.style.display = metadata.display;

    if (regionEl.style.display === "grid") {
      regionEl.style.gridTemplateColumns = `repeat(${metadata.cols}, auto)`;
      (data.keys as number[]).forEach((which) => {
        regionEl.append(renderKey(which, opts));
      });
    } else if (regionEl.style.display === "flex") {
      if (isNumberArray(data.keys)) {
        (data.keys as number[]).forEach((which) => {
          regionEl.append(renderKey(which, opts));
        });
      } else if (isNumberArray2D(data.keys)) {
        (data.keys as number[][]).forEach((row) => {
          const rowEl = document.createElement("div");
          row.forEach((which) => {
            rowEl.append(renderKey(which, opts));
          });
          regionEl.append(rowEl);
        });
      } else {
        throw new Error("Unsupported n-dimensional array");
      }
    }
    keyboardEl.append(regionEl);
  });
}

function renderKey(which: number, opts: LayoutOptions) {
  const keyElement: HTMLDivElement = document.createElement("div");
  keyElement.classList.add("key");
  keyElement.textContent = which.toString();
  return keyElement;
}

function renderTklKeyboard(keyboardEl: HTMLDivElement, opts: LayoutOptions) {
  for (let i = 0; i < 10; i++) {
    const keyElement: HTMLDivElement = document.createElement("div");
    keyElement.classList.add("key");
    keyElement.textContent = i.toString();
    keyboardEl.append(keyElement);
  }
}

export { initializeLayout };
