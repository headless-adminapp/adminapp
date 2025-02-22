import { Attribute } from '@headless-adminapp/core';
import { Section } from '@headless-adminapp/core/experience/form';
import { SectionControl } from '@headless-adminapp/core/experience/form/SectionControl';
import { Tab } from '@headless-adminapp/core/experience/form/Tab';
import { SchemaAttributes } from '@headless-adminapp/core/schema';

import { ContextValue } from '../mutable';
import { DataFormContextState } from './context';
import {
  getIsControlHidden,
  getIsFieldDisabled,
  getIsFieldRequired,
} from './DataFormProvider/utils';

export class FormManager<SA extends SchemaAttributes = SchemaAttributes> {
  constructor(
    private readonly contextState: ContextValue<DataFormContextState<SA>>
  ) {}

  private get context() {
    return this.contextState.value.current;
  }

  public getAttribute(attributeName: keyof SA): FormAttribute<SA> | null {
    return new FormAttribute<SA>(
      this.contextState,
      attributeName,
      this.context.schema.attributes[attributeName]
    );
  }

  public getControl<C extends Control<SA>>(name: string): C | null {
    const control = this.context.formInternal.controls.dict[name] ?? null;

    if (!control) {
      return null;
    }

    return new Control(this.contextState, control) as C;
  }

  public getSection(name: string) {
    const section = this.context.formInternal.sections.dict[name];

    if (!section) {
      return null;
    }

    return new FormSection(this.contextState, section);
  }
  public getTab(name: string) {
    const tab = this.context.formInternal.tabs.dict[name];

    if (!tab) {
      return null;
    }

    return new FormTab(this.contextState, tab);
  }
}

class FormAttribute<SA extends SchemaAttributes = SchemaAttributes> {
  constructor(
    private readonly contextState: ContextValue<DataFormContextState<SA>>,
    private readonly attributeName: keyof SA,
    private readonly attribute: Attribute
  ) {}

  public getInnerAttribute() {
    return this.attribute;
  }

  public setRequired(state: boolean) {
    const control =
      this.contextState.value.current.formInternal.controls.dict[
        this.attributeName as string
      ];

    if (!control) {
      return;
    }

    if (control.type !== 'standard') {
      return;
    }

    this.contextState.setValue((prev) => {
      return {
        requiredFields: {
          ...prev.requiredFields,
          [this.attributeName as string]: state,
        },
      };
    });
  }
  public getRequired() {
    const attribute = this.attribute;
    const control =
      this.contextState.value.current.formInternal.controls.dict[
        this.attributeName as string
      ];

    if (control.type !== 'standard') {
      return false;
    }

    return getIsFieldRequired({
      attribute,
      control,
      requiredFields: this.contextState.value.current.requiredFields,
    });
  }
  public resetRequired() {
    this.contextState.setValue((prev) => {
      const requiredFields = { ...prev.requiredFields };
      delete requiredFields[this.attributeName as string];
      return {
        requiredFields,
      };
    });
  }

  public getControls() {
    return this.contextState.value.current.formInternal.controls.list
      .filter(
        (control) =>
          control.type === 'standard' &&
          control.attributeName === this.attributeName
      )
      .map((control) => new Control(this.contextState, control));
  }
}

class Control<SA extends SchemaAttributes = SchemaAttributes> {
  constructor(
    private readonly contextState: ContextValue<DataFormContextState<SA>>,
    private readonly control: SectionControl<SA>
  ) {}

  private get context() {
    return this.contextState.value.current;
  }

  public getKey(): string | undefined {
    let key = this.control.key;

    if (!key && this.control.type === 'standard') {
      key = this.control.attributeName as string;
    }

    return key;
  }

  public getDisabled() {
    if (this.control.type !== 'standard') {
      return false;
    }

    const attributeName = this.control.attributeName as string;

    return getIsFieldDisabled({
      control: this.control,
      attribute: this.context.schema.attributes[attributeName],
      disabledFields: this.context.disabledControls,
      isFormReadonly: this.context.isReadonly,
    });
  }
  public setDisabled(state: boolean) {
    if (this.control.type !== 'standard') {
      return;
    }

    const key = this.control.attributeName as string;

    this.contextState.setValue((prev) => {
      return {
        disabledControls: {
          ...prev.disabledControls,
          [key]: state,
        },
      };
    });
  }
  public resetDisabled() {
    if (this.control.type !== 'standard') {
      return;
    }

    const key = this.control.attributeName as string;

    this.contextState.setValue((prev) => {
      const disabledFields = { ...prev.disabledControls };
      delete disabledFields[key];
      return {
        disabledControls: disabledFields,
      };
    });
  }
  public getHidden(): boolean {
    return getIsControlHidden({
      control: this.control,
      hiddenControls: this.context.hiddenControls,
    });
  }

  public setHidden(state: boolean) {
    const key = this.getKey();

    if (!key) {
      return;
    }

    this.contextState.setValue((prev) => {
      return {
        hiddenControls: {
          ...prev.hiddenControls,
          [key]: state,
        },
      };
    });
  }

  public resetHidden() {
    const key = this.getKey();

    if (!key) {
      return;
    }

    this.contextState.setValue((prev) => {
      const hiddenControls = { ...prev.hiddenControls };
      delete hiddenControls[key];
      return {
        hiddenControls,
      };
    });
  }
}

class FormSection<SA extends SchemaAttributes = SchemaAttributes> {
  constructor(
    private readonly contextState: ContextValue<DataFormContextState<SA>>,
    private readonly section: Section<SA>
  ) {}
  public setHidden(state: boolean) {
    this.contextState.setValue((prev) => {
      return {
        hiddenSections: {
          ...prev.hiddenSections,
          [this.section.name]: state,
        },
      };
    });
  }
  public getHidden(): boolean {
    return (
      this.contextState.value.current.hiddenSections[this.section.name] ??
      this.section.hidden ??
      false
    );
  }
  public resetHidden() {
    this.contextState.setValue((prev) => {
      const hiddenSections = { ...prev.hiddenSections };
      delete hiddenSections[this.section.name];
      return {
        hiddenSections,
      };
    });
  }
}

class FormTab<SA extends SchemaAttributes = SchemaAttributes> {
  constructor(
    private readonly contextState: ContextValue<DataFormContextState<SA>>,
    private readonly tab: Tab<SA>
  ) {}
  public setHidden(state: boolean) {
    this.contextState.setValue((prev) => {
      return {
        hiddenTabs: {
          ...prev.hiddenTabs,
          [this.tab.name]: state,
        },
      };
    });
  }
  public getHidden() {
    return this.contextState.value.current.hiddenTabs[this.tab.name] ?? false;
  }
  public resetHidden() {
    this.contextState.setValue((prev) => {
      const hiddenTabs = { ...prev.hiddenTabs };
      delete hiddenTabs[this.tab.name];
      return {
        hiddenTabs,
      };
    });
  }
}
