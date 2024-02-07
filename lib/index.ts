import "./style.css";

import keys from "./data/keys.json";
import fullLayout from "./data/layouts/full.json";

type KeyValue = { key: string; code: string; unicode?: string };
type KeyData = { which: number } & KeyValue;

type Region = {
  data: {
    name: string;
    keys: number[] | number[][] | number[][][];
  };
  metadata: {
    display: "grid" | "flex";
    rows?: number;
    cols?: number;
  };
};

type Sector = {
  data: {
    name: string;
    regions: Region[];
  };
};

type LayoutData = {
  sectors: Sector[];
};

const keyMap = (keys as KeyData[]).reduce(
  (lookup, { which, key, code, unicode }) =>
    lookup.set(which, { key, code, unicode }),
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
  keyboardEl.style.display = "flex";
  keyboardEl.style.flexDirection = "row";

  (fullLayout as LayoutData).sectors.forEach((sector) => {
    keyboardEl.append(renderSector(sector, opts));
  });
}

function renderSector(sector: Sector, opts: LayoutOptions) {
  const { data } = sector;
  const sectorEl = document.createElement("div");
  sectorEl.classList.add("keyboard-sector");
  sectorEl.style.display = "flex";
  sectorEl.style.flexDirection = "column";
  data.regions.forEach((region) => {
    sectorEl.append(renderRegion(region, opts));
  });
  return sectorEl;
}

function renderRegion(region: Region, opts: LayoutOptions) {
  const { data, metadata } = region;
  const regionEl = document.createElement("div");
  regionEl.classList.add("keyboard-region");
  regionEl.style.display = "flex";
  regionEl.style.flexDirection = "column";
  regionEl.dataset.region = data.name;
  regionEl.style.display = metadata.display;

  switch (regionEl.style.display) {
    case "grid": {
      regionEl.style.gridTemplateColumns = `repeat(${metadata.cols}, auto)`;

      (data.keys as number[]).forEach((which) => {
        regionEl.append(renderKey(which, opts));
      });

      break;
    }
    case "flex": {
      if (isNumberArray(data.keys)) {
        (data.keys as number[]).forEach((which) => {
          regionEl.append(renderKey(which, opts));
        });
      } else if (isNumberArray2D(data.keys)) {
        (data.keys as number[][]).forEach((row) => {
          const rowEl = document.createElement("div");
          rowEl.style.display = "flex";
          rowEl.style.flexDirection = "row";
          row.forEach((which) => {
            rowEl.append(renderKey(which, opts));
          });
          regionEl.append(rowEl);
        });
      } else {
        throw new Error("Unsupported n-dimensional array");
      }

      break;
    }
  }

  return regionEl;
}

function renderKey(which: number, opts: LayoutOptions) {
  const keyEl: HTMLDivElement = document.createElement("div");
  keyEl.classList.add("keyboard-key");
  const { key, code, unicode } = keyMap.get(which) ?? {};
  keyEl.dataset.which = which.toString();
  keyEl.dataset.key = key;
  keyEl.dataset.code = code;
  keyEl.textContent = unicode ?? key ?? which.toString();
  return keyEl;
}

function renderTklKeyboard(keyboardEl: HTMLDivElement, opts: LayoutOptions) {
  for (let i = 0; i < 10; i++) {
    keyboardEl.append(renderKey(i, opts));
  }
}

export { initializeLayout };
