import { SchemaAttributes } from '../../schema';
import { Localized } from '../../types';
import { QuickViewForm } from './QuickViewForm';

export interface BaseSectionControl {
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
  component?: string; // unique name of component from registry to override default component
}

export interface SectionSpacerControl extends BaseSectionControl {
  type: 'spacer';
}

export interface SectionSubgridControl extends BaseSectionControl {
  type: 'subgrid';
  logicalName: string;
  // attributeName: string;
  viewId: string;
  availableViewIds?: string[];
  allowViewSelection?: boolean;
  // noAssociateFilter?: boolean;
  // relatedRecordsOnly: boolean;
  associatedAttribute: false | string; // false if no associated attribute // local attirubte for the subgrid
  component?: string; // unique name of component from registry to override default component
}

export interface SectionQuickViewControl<
  S extends SchemaAttributes = SchemaAttributes
> extends BaseSectionControl {
  type: 'quickview';
  logicalName: string;
  attributeName: string;
  form: QuickViewForm<S>;
}
