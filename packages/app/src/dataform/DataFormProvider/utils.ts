import { AttributeBase } from '@headless-adminapp/core/attributes/AttributeBase';
import { Form, Section } from '@headless-adminapp/core/experience/form';
import {
  SectionControl,
  SectionStatndardControl,
} from '@headless-adminapp/core/experience/form/SectionControl';
import { Tab } from '@headless-adminapp/core/experience/form/Tab';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';

import { DataFormContextState } from '../context';

export function getControls<SA extends SchemaAttributes>(
  form: Form<SA>
): SectionControl<SA>[] {
  const controls = form.experience.tabs
    .flatMap((tab) => tab.tabColumns)
    .flatMap((tabColumn) => tabColumn.sections)
    .flatMap((section) => section.controls);

  return controls;
}

export function getColumns<SA extends SchemaAttributes>(
  form: Form<SA>,
  schema: Schema<SA>
) {
  const set = new Set([
    ...(form.experience.includeAttributes ?? []),
    ...(form.experience.headerControls ?? []),
    ...getControls(form)
      .filter((control) => control.type === 'standard')
      .map((control) => control.attributeName),
  ]);

  if (schema.avatarAttribute) {
    set.add(schema.avatarAttribute);
  }

  const columns = Array.from(set);

  return columns;
}

export function transformFormInternal<SA extends SchemaAttributes>(
  form: Form<SA>
): DataFormContextState<SA>['formInternal'] {
  const controls = getControls(form);

  const dict = controls.reduce((acc, control) => {
    let key = control.key;

    if (!key && control.type === 'standard') {
      key = control.attributeName as string;
    }

    if (key) {
      acc[key] = control;
    }
    return acc;
  }, {} as Record<string, SectionControl<SA>>);

  const sections = form.experience.tabs
    .flatMap((tab) => tab.tabColumns)
    .flatMap((tabColumn) => tabColumn.sections);

  const dictBySectionKey = sections.reduce((acc, section) => {
    acc[section.name] = section;
    return acc;
  }, {} as Record<string, Section<SA>>);

  const tabsDict = form.experience.tabs.reduce((acc, tab) => {
    acc[tab.name] = tab;
    return acc;
  }, {} as Record<string, Tab<SA>>);

  return {
    controls: {
      list: controls,
      dict,
    },
    sections: {
      list: sections,
      dict: dictBySectionKey,
    },
    tabs: {
      dict: tabsDict,
    },
  };
}

export function getIsFieldDisabled<
  S extends SchemaAttributes = SchemaAttributes
>({
  attribute,
  isFormReadonly,
  disabledFields,
  control,
}: {
  attribute: AttributeBase;
  isFormReadonly: boolean | undefined;
  disabledFields: Record<string, boolean>;
  control: Section<S>['controls'][0];
}): boolean {
  let disabled = isFormReadonly ?? false;

  if (!disabled) {
    if (
      control.type === 'standard' &&
      typeof control.attributeName === 'string' &&
      disabledFields[control.attributeName] !== undefined
    ) {
      disabled = disabledFields[control.attributeName];
    } else if (control.disabled !== undefined) {
      disabled = control.disabled;
    } else if (attribute.readonly !== undefined) {
      disabled = attribute.readonly;
    }
  }

  return disabled;
}

export function getIsControlHidden<
  S extends SchemaAttributes = SchemaAttributes
>({
  control,
  hiddenControls,
}: {
  hiddenControls: Record<string, boolean>;
  control: Section<S>['controls'][0];
}): boolean {
  let hidden = control.hidden ?? false;

  let key = control.key;

  if (!key && control.type === 'standard') {
    key = control.attributeName as string;
  }

  if (key && hiddenControls[key] !== undefined) {
    hidden = hiddenControls[key];
  }

  return hidden;
}

export function getIsFieldRequired<
  S extends SchemaAttributes = SchemaAttributes
>({
  attribute,
  control,
  requiredFields,
}: {
  attribute: AttributeBase;
  requiredFields: Record<string, boolean>;
  control: SectionStatndardControl<S>;
}): boolean {
  const attributeName = control.attributeName as string;

  let required = attribute.required ?? false;

  if (requiredFields[attributeName] !== undefined) {
    required = requiredFields[attributeName];
  } else if (control.required !== undefined) {
    required = control.required;
  }

  return required;
}
