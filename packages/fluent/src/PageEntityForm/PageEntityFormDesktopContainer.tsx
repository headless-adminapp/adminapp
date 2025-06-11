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
import { RelatedItemInfo } from '@headless-adminapp/app/dataform/context';
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
import { useFormDataState } from '@headless-adminapp/app/dataform/hooks/useFormDataState';
import { useLocale } from '@headless-adminapp/app/locale';
import { localizedLabel } from '@headless-adminapp/app/locale/utils';
import {
  useContextSelector,
  useContextValueSetter,
} from '@headless-adminapp/app/mutable';
import { getAttributeFormattedValue } from '@headless-adminapp/app/utils';
import { FC, Fragment } from 'react';
import { Controller } from 'react-hook-form';

import { PageBroken } from '../components/PageBroken';
import { FormBody } from '../form/layout/FormBody';
import { FormTab } from '../form/layout/FormTab';
import { Body1Skeleton, Subtitle2Skeleton } from '../Skeleton/TextSkeleton';
import { CommandContainer } from './CommandContainer';
import { FormTabRelated } from './FormTabRelated';
import { usePageEntityFormStrings } from './PageEntityFormStringContext';
import { ProcessFlow } from './ProcessFlow';
import { RecordAvatar } from './RecordAvatar';
import { RelatedViewSelector } from './RelatedViewSelector';
import { SectionContainer } from './SectionContainer';

export const PageEntityFormDesktopContainer: FC = () => {
  const dataState = useFormDataState();

  const strings = usePageEntityFormStrings();
  const locale = useLocale();
  const recordId = useRecordId();
  const record = useContextSelector(DataFormContext, (state) => state.record);
  const activeTab = useContextSelector(
    DataFormContext,
    (state) => state.activeTab
  );
  const selectedRelatedItem = useContextSelector(
    DataFormContext,
    (state) => state.selectedRelatedItem
  );
  const { language } = useLocale();

  const schema = useDataFormSchema();

  const formConfig = useSelectedForm();
  const processFlowSteps = useProcessFlowSteps();

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

  const [recordTitle] = useRecordTitle();

  // const readonly = useIsFormReadonly();

  const formInstance = useFormInstance();

  const isDirty = useFormIsDirty();
  const notifications = useFormNotifications();

  if (!dataState.isFetching && dataState.isError) {
    return <PageBroken title="Error" message="Unable to load page" />;
  }

  if (recordId && !record && !dataState.isFetching) {
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
          <CommandContainer skeleton={dataState.isFetching} />
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
            <RecordAvatar />
            {dataState.isFetching ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                }}
              >
                <Subtitle2Skeleton width={200} />
                <Body1Skeleton width={80} />
              </div>
            ) : (
              <div
                style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
              >
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
            )}
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {formConfig.experience.headerControls?.map(
                (controlName, index) => {
                  const attribute = schema.attributes[controlName];

                  if (!attribute) {
                    console.warn(`Attribute ${controlName} not found`);
                    return null;
                  }

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
                            if (dataState.isFetching) {
                              return <Body1Skeleton width={100} />;
                            }

                            return (
                              <Body1>
                                {getAttributeFormattedValue(
                                  attribute,
                                  field.value,
                                  locale
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
            <ProcessFlow
              height={28}
              rounded={false}
              items={processFlowSteps}
              skeleton={dataState.isFetching}
            />
          )}
          <div
            style={{ display: 'flex', paddingBottom: tokens.spacingVerticalS }}
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
                    skeleton={dataState.isFetching}
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
