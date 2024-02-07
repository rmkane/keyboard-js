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
    rows: number;
    cols: number;
  };
};

const keyMap = (keys as KeyData[]).reduce(
  (lookup, { which, key, code }) => lookup.set(which, { key, code }),
  new Map<number, KeyValue>()
);

console.log(fullLayout);

type OperatingSystemType = "mac" | "windows";
type KeyboardType = "full" | "tkl";

type LayoutOptions = {
  keyboardType?: KeyboardType;
  os?: OperatingSystemType;
};

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

  for (let keyboardElement of keyboardElements) {
    keyboardElement.replaceChildren();

    for (let i = 0; i < 10; i++) {
      const keyElement: HTMLDivElement = document.createElement("div");
      keyElement.classList.add("key");
      keyElement.textContent = i.toString();
      keyboardElement.append(keyElement);
    }
  }

  console.log("Keyboard type:", opts.keyboardType);
  console.log("OS:", opts.os);
}

export { initializeLayout };
