interface WidgetInfoBase {
  columns: number;
  rows: number;
}
interface WidgetSpaceInfo extends WidgetInfoBase {
  type: 'space';
}

export interface WidgetComponentInfo extends WidgetInfoBase {
  type: 'component';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: any;
}

interface WidgetGroupInfo extends WidgetInfoBase {
  type: 'group';
  items: WidgetInfo[];
}

export type WidgetInfo =
  | WidgetComponentInfo
  | WidgetGroupInfo
  | WidgetSpaceInfo;
