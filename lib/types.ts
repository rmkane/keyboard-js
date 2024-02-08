type OperatingSystemType = "mac" | "windows";
type KeyboardType = "full" | "tkl";
type KeyboardFormat = "standard";

// data/keys.json
type KeyValue = { key: string; code: string; unicode?: string };
type KeyData = { which: number } & KeyValue;

// data/formats.json
type KeyFormat = { which: number; symbols: null | string[] };

// data/layouts/*.json
type LayoutOptions = {
  format?: KeyboardFormat;
  keyboardType?: KeyboardType;
  os?: OperatingSystemType;
};

type Layout = {
  type: "layout";
  name: string;
  sectors: Sector[];
};

type Sector = {
  type: "sector";
  name: string;
  regions: Region[];
};

type Region = SimpleRegion | GridRegion;

type BasicRegion = {
  name: string;
  style: any;
  keyStyle?: any;
};

type SimpleRegion = {
  type: "region";
  rows: Row[];
} & BasicRegion;

type GridRegion = {
  type: "region-grid";
  keys: Keys;
} & BasicRegion;

type SimpleRow = {
  type: "row";
  name: string;
  keys: Keys;
};

type GroupRow = {
  type: "row-group";
  name: string;
  groups: KeyGroup[];
};

type Row = SimpleRow | GroupRow;

type KeyGroup = {
  keys: Keys;
};

type Keys = number[];

export type {
  BasicRegion,
  GridRegion,
  GroupRow,
  KeyboardType,
  KeyData,
  KeyFormat,
  KeyGroup,
  Keys,
  KeyValue,
  Layout,
  LayoutOptions,
  OperatingSystemType,
  Region,
  Row,
  Sector,
  SimpleRegion,
  SimpleRow,
};
