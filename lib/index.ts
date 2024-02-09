import "./style.css";

import type {
  BasicRegion,
  GridRegion,
  GroupRow,
  KeyData,
  KeyValue,
  Layout,
  LayoutOptions,
  Region,
  Sector,
  SimpleRegion,
  SimpleRow,
} from "./types";

import keys from "./data/keys.json";
import fullLayout from "./data/layouts/full.json";
import standardFormat from "./data/formats/standard.json";

const defaultOptions: LayoutOptions = {
  keyboardType: "full",
  format: "standard",
  os: "windows",
};

const keyMap = (keys as KeyData[]).reduce(
  (lookup, { which, key, code, unicode }) =>
    lookup.set(which, { key, code, unicode }),
  new Map<number, KeyValue>()
);

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
  (fullLayout as Layout).sectors.forEach((sector) => {
    keyboardEl.append(renderSector(sector, opts));
  });
}

function renderSector(sector: Sector, opts: LayoutOptions) {
  const { regions } = sector;
  const sectorEl = document.createElement("div");
  sectorEl.classList.add("keyboard-sector");
  regions.forEach((region) => {
    sectorEl.append(renderRegion(region, opts));
  });
  return sectorEl;
}

function renderRegion(region: Region, opts: LayoutOptions) {
  const { name, style, type } = region;
  const regionEl = document.createElement("div");
  regionEl.classList.add("keyboard-region");
  regionEl.dataset.region = name;

  Object.assign(regionEl.style, style);

  switch (type) {
    case "region-grid": {
      regionEl.classList.add("keyboard-region-grid");

      const gridRegion = region as GridRegion;
      gridRegion.keys.forEach((which) => {
        regionEl.append(renderKey(which, opts, region));
      });

      break;
    }
    case "region": {
      (region as SimpleRegion).rows.forEach((row) => {
        const rowEl = document.createElement("div");
        rowEl.classList.add("keyboard-row");

        switch (row.type) {
          case "row": {
            (row as SimpleRow).keys.forEach((which) => {
              rowEl.append(renderKey(which, opts, region));
            });
            break;
          }
          case "row-group":
            rowEl.classList.add("keyboard-row-grouped");

            (row as GroupRow).groups.forEach((group) => {
              const groupEl = document.createElement("div");
              groupEl.classList.add("keyboard-row-group");
              group.keys.forEach((which) => {
                groupEl.append(renderKey(which, opts, region));
              });
              rowEl.append(groupEl);
            });
            break;
        }
        regionEl.append(rowEl);
      });

      break;
    }
  }

  return regionEl;
}

function renderKey(which: number, opts: LayoutOptions, region: BasicRegion) {
  const keyEl: HTMLDivElement = document.createElement("div");
  keyEl.classList.add("keyboard-key");

  const { key, code, unicode } = keyMap.get(which) ?? {};
  keyEl.dataset.which = which.toString();
  keyEl.dataset.key = key;
  keyEl.dataset.code = code;

  const keyInnerEl = document.createElement("kbd");
  keyInnerEl.classList.add("keyboard-key-inner");

  const symbols = standardFormat.find((k) => k.which === which)?.symbols;
  if (symbols) {
    keyInnerEl.append(
      ...symbols.map((symbol) => {
        const symbolEl = document.createElement("div");
        symbolEl.innerHTML = symbol.replace("\n", "<br>");
        return symbolEl;
      })
    );
  } else {
    //keyEl.textContent = unicode ?? key ?? which.toString();
  }

  keyEl.append(keyInnerEl);

  Object.assign(keyEl.style, region.keyStyle?.[which.toString()]);

  return keyEl;
}

function renderTklKeyboard(keyboardEl: HTMLDivElement, opts: LayoutOptions) {
  console.log("Not implemented...");
}

export { initializeLayout };
