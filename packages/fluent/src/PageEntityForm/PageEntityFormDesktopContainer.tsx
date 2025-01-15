import {
  Body1,
  Caption1,
  Divider,
  MessageBar,
  MessageBarBody,
  Subtitle2,
  Tab,
  TabList,
  tokens,
} from '@fluentui/react-components';
import { DataFormContext } from '@headless-adminapp/app/dataform';
import {
  useDataFormSchema,
  useFormInstance,
  useFormIsDirty,
  useFormNotifications,
  useProcessFlowSteps,
  useRecordId,
  useRecordTitle,
  useSelectedForm,
} from '@headless-adminapp/app/dataform/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { localizedLabel } from '@headless-adminapp/app/locale/utils';
import {
  useContextSelector,
  useContextValueSetter,
} from '@headless-adminapp/app/mutable';
import { getAttributeFormattedValue } from '@headless-adminapp/app/utils';
import { FC, Fragment, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import { PageBroken } from '../components/PageBroken';
import { PageLoading } from '../components/PageLoading';
import { FormBody } from '../form/layout/FormBody';
import { FormTab } from '../form/layout/FormTab';
import { CommandContainer } from './CommandContainer';
import { FormTabRelated } from './FormTabRelated';
import { usePageEntityFormStrings } from './PageEntityFormStringContext';
import { ProcessFlow } from './ProcessFlow';
import { RelatedItemInfo, RelatedViewSelector } from './RelatedViewSelector';
import { SectionContainer } from './SectionContainer';

export const PageEntityFormDesktopContainer: FC = () => {
  const dataState = useContextSelector(
    DataFormContext,
    (state) => state.dataState
  );

  const strings = usePageEntityFormStrings();
  const recordId = useRecordId();
  const record = useContextSelector(DataFormContext, (state) => state.record);
  const activeTab = useContextSelector(
    DataFormContext,
    (state) => state.activeTab
  );
  const { language } = useLocale();

  const schema = useDataFormSchema();

  const formConfig = useSelectedForm();
  const processFlowSteps = useProcessFlowSteps();

  const setActiveTab = useContextValueSetter(
    DataFormContext,
    (setValue) => (value: string) => {
      setValue((state) => ({
        ...state,
        activeTab: value,
      }));
    }
  );

  useEffect(() => {
    setActiveTab('general');
  }, [setActiveTab]);

  const recordTitle = useRecordTitle();

  // const readonly = useIsFormReadonly();

  const formInstance = useFormInstance();

  const isDirty = useFormIsDirty();
  const notifications = useFormNotifications();

  const [selectedRelatedItem, setSelectedRelatedItem] =
    useState<RelatedItemInfo | null>(null);

  if (dataState.isFetching) {
    return <PageLoading />;
  }

  if (dataState.isError) {
    return <PageBroken title="Error" message="Unable to load page" />;
  }

  if (recordId && !record) {
    return (
      <PageBroken
        title="Record not found"
        message="Requested record not found in system or you may not have enought permission."
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        // backgroundColor: tokens.colorNeutralBackground2,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacingVerticalM,
          paddingTop: tokens.spacingVerticalM,
          paddingInline: tokens.spacingHorizontalM,
        }}
      >
        <div
          style={{
            // padding: 4,
            boxShadow: tokens.shadow2,
            borderRadius: tokens.borderRadiusMedium,
            background: tokens.colorNeutralBackground1,
            display: 'flex',
            // overflow: 'hidden',
          }}
        >
          <CommandContainer />
        </div>
        {notifications.length > 0 && (
          <div>
            {notifications.map((notification, index) => (
              <MessageBar key={index} intent={notification.level} icon={null}>
                <MessageBarBody>{notification.message}</MessageBarBody>
              </MessageBar>
            ))}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            boxShadow: tokens.shadow4,
            borderRadius: tokens.borderRadiusMedium,
            background: tokens.colorNeutralBackground1,
            overflow: 'hidden',
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingInline: tokens.spacingHorizontalM,
              paddingTop: tokens.spacingVerticalS,
              marginBottom: tokens.spacingVerticalS,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  gap: tokens.spacingHorizontalXS,
                  alignItems: 'center',
                }}
              >
                <Subtitle2>{recordTitle}</Subtitle2>
                <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
                  {isDirty
                    ? `- ${strings.unsaved}`
                    : !!record
                    ? `- ${strings.saved}`
                    : ''}
                </Caption1>
              </div>
              <Body1 style={{ color: tokens.colorNeutralForeground3 }}>
                {localizedLabel(language, schema)}
              </Body1>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {formConfig.experience.headerControls?.map(
                (controlName, index) => {
                  const attribute = schema.attributes[controlName];

                  return (
                    <Fragment key={controlName}>
                      {index > 0 && (
                        <Divider
                          vertical
                          style={{
                            width: tokens.spacingHorizontalXXL,
                            opacity: 0.5,
                          }}
                        />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Body1
                          style={{ color: tokens.colorNeutralForeground4 }}
                        >
                          {attribute.label}
                        </Body1>
                        <Controller
                          control={formInstance.control}
                          name={controlName}
                          render={({ field }) => {
                            return (
                              <Body1>
                                {getAttributeFormattedValue(
                                  attribute,
                                  field.value
                                )}
                              </Body1>
                            );
                          }}
                        ></Controller>
                      </div>
                    </Fragment>
                  );
                }
              )}
            </div>
          </div>
          {!!processFlowSteps?.length && (
            <ProcessFlow height={28} rounded={false} items={processFlowSteps} />
          )}
          <div
            style={{ display: 'flex', paddingBottom: tokens.spacingVerticalS }}
          >
            <TabList
              selectedValue={activeTab}
              onTabSelect={(e, value) => setActiveTab(value.value as string)}
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
        </div>
      </div>
      <FormBody>
        {formConfig.experience.tabs.map((tab) => (
          <FormTab
            key={tab.name}
            value={tab.name}
            columnCount={tab.columnCount}
            columnWidths={tab.columnWidths}
          >
            {tab.tabColumns.map((tabColumn, index) => (
              <FormTab.Column key={index}>
                {tabColumn.sections.map((section) => (
                  <SectionContainer
                    key={section.name}
                    section={section}
                    readOnly={false}
                  />
                ))}
              </FormTab.Column>
            ))}
          </FormTab>
        ))}
        <FormTabRelated selectedRelatedItem={selectedRelatedItem} />
      </FormBody>
    </div>
  );
};
