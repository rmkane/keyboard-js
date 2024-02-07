import "./style.css";

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
