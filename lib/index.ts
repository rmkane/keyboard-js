type OperatingSystemType = 'mac' | 'windows';
type KeyboardType = 'full' | 'tkl';

type LayoutOptions = {
  keyboardType?: KeyboardType,
  os?: OperatingSystemType
}

const defaultOptions: LayoutOptions = {
  keyboardType: 'full',
  os: 'windows'
};

function initializeLayout(selector: string, options: LayoutOptions = defaultOptions) {
  const elements = document.querySelectorAll<HTMLDivElement>(selector);

  const opts: LayoutOptions = { ...defaultOptions, ...options };

  for (let element of elements) {
    for (let i = 0; i < 10; i++) {
      const key: HTMLDivElement = document.createElement('div');
      key.textContent = i.toString();
      element.append(key);
    }
  }

  console.log("Keyboard type:", opts.keyboardType);
  console.log("OS:", opts.os);
}

export { initializeLayout };
