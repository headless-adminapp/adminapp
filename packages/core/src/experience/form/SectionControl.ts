import type { Attribute } from '@headless-adminapp/core/attributes';

import type { SchemaAttributes } from '../../schema';
import type { Localized } from '../../types';
import type { QuickViewForm } from './QuickViewForm';
import type { SectionEditableGridControl } from './SectionEditableGridControl';

export interface StandardControlProps {
  attribute: Attribute;
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  name: string;
  value: any;
  placeholder?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
  fileServiceContext?: Record<string, unknown>;
  borderOnFocusOnly?: boolean;
  hideLabel?: boolean;
  hidePlaceholder?: boolean;
  allowQuickCreate?: boolean;
  readOnly?: boolean;
  quickViewControl?: boolean;
  allowNavigation?: boolean;
  allowNewRecord?: boolean;
  autoHeight?: boolean;
  maxHeight?: number;
}

export interface BaseSectionControl {
  key?: string;
  span?: number;
  hidden?: boolean;
  label?: string;
  localizedLabels?: Localized<string>;
  labelHidden?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export interface SectionStatndardControl<
  S extends SchemaAttributes = SchemaAttributes
> extends BaseSectionControl {
  type: 'standard';
  attributeName: keyof S;
  component?: string | React.ComponentType<StandardControlProps>; // Component or unique name of component from registry to override default component
  autoHeight?: boolean; // auto height for the control
  maxHeight?: number; // max height for the control
}

export interface SectionSpacerControl extends BaseSectionControl {
  type: 'spacer';
}

export interface SectionSubgridControl extends BaseSectionControl {
  type: 'subgrid';
  logicalName: string;
  // attributeName: string;
  viewId?: string;
  availableViewIds?: string[];
  allowViewSelection?: boolean;
  // noAssociateFilter?: boolean;
  // relatedRecordsOnly: boolean;
  associatedAttribute: false | string; // false if no associated attribute // local attirubte for the subgrid
  component?: string | React.ComponentType; // Component or unique name of component from registry to override default component
}

export interface SectionQuickViewControl<
  S extends SchemaAttributes = SchemaAttributes
> extends BaseSectionControl {
  type: 'quickview';
  logicalName: string;
  attributeName: string;
  form: QuickViewForm<S>;
}

export interface CustomComponentControl {
  key?: string;
  span?: number;
  hidden?: boolean;
  type: 'component';
  component: string | React.ComponentType;
  componentProps?: Record<string, unknown>;
}

export type SectionControl<S extends SchemaAttributes = SchemaAttributes> =
  | SectionStatndardControl<S>
  | SectionSubgridControl
  | SectionQuickViewControl
  | SectionEditableGridControl
  | SectionSpacerControl
  | CustomComponentControl;
