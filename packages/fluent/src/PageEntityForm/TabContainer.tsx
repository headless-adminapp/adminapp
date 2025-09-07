import { Tab, TabList, tokens } from '@fluentui/react-components';
import { DataFormContext } from '@headless-adminapp/app/dataform';
import { RelatedItemInfo } from '@headless-adminapp/app/dataform/context';
import { useSelectedForm } from '@headless-adminapp/app/dataform/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { localizedLabel } from '@headless-adminapp/app/locale/utils';
import {
  useContextSelector,
  useContextValueSetter,
} from '@headless-adminapp/app/mutable';
import { FC } from 'react';

import { RelatedViewSelector } from './RelatedViewSelector';

export const TabContainer: FC = () => {
  const formConfig = useSelectedForm();
  const { language } = useLocale();
  const activeTab = useContextSelector(
    DataFormContext,
    (state) => state.activeTab
  );
  const selectedRelatedItem = useContextSelector(
    DataFormContext,
    (state) => state.selectedRelatedItem
  );

  const setActiveTab = useContextValueSetter(
    DataFormContext,
    (setValue) => (value: string) => {
      setValue(() => ({
        activeTab: value,
      }));
    }
  );

  const setSelectedRelatedItem = useContextValueSetter(
    DataFormContext,
    (setValue) => (item: RelatedItemInfo | null) => {
      setValue(() => ({
        selectedRelatedItem: item,
      }));
    }
  );

  return (
    <div
      style={{
        display: 'flex',
        paddingBottom: tokens.spacingVerticalS,
        overflowY: 'auto',
      }}
    >
      <TabList
        selectedValue={activeTab}
        onTabSelect={(e, value) => {
          setActiveTab(value.value as string);
        }}
      >
        {formConfig.experience.tabs.map((tab) => (
          <Tab key={tab.name} value={tab.name}>
            {localizedLabel(language, tab)}
          </Tab>
        ))}
        {!!selectedRelatedItem && (
          <Tab value="related">
            {selectedRelatedItem.localizedPluralLabels?.[language] ??
              selectedRelatedItem.pluralLabel}
          </Tab>
        )}
      </TabList>
      <RelatedViewSelector
        onSelect={(item) => {
          setSelectedRelatedItem(item);
          setActiveTab('related');
        }}
      />
    </div>
  );
};
