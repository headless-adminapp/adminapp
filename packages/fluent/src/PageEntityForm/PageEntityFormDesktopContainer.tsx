import {
  Body1,
  Caption1,
  Divider,
  MessageBarBody,
  Subtitle2,
  tokens,
} from '@fluentui/react-components';
import { ScrollView } from '@headless-adminapp/app/components/ScrollView';
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
import { useFormDataState } from '@headless-adminapp/app/dataform/hooks/useFormDataState';
import { useMobileHeaderSetValue } from '@headless-adminapp/app/header/hooks/useMobileHeaderSetValue';
import { useElementSize, useIsMobile } from '@headless-adminapp/app/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { localizedLabel } from '@headless-adminapp/app/locale/utils';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { getAttributeFormattedValue } from '@headless-adminapp/app/utils';
import { FC, Fragment, PropsWithChildren, useRef } from 'react';
import { Controller } from 'react-hook-form';

import { extendedTokens, MessageBar } from '../components/fluent';
import { useExtendedThemeContext } from '../components/fluent/FluentProvider';
import { PageBroken } from '../components/PageBroken';
import { FormBody } from '../form/layout/FormBody';
import { FormTab } from '../form/layout/FormTab';
import { Body1Skeleton, Subtitle2Skeleton } from '../Skeleton/TextSkeleton';
import { CommandContainer } from './CommandContainer';
import { FormTabRelated } from './FormTabRelated';
import { MobileHeaderRightContainer } from './MobileHeaderRightContainer';
import { MobileHeaderTitleContainer } from './MobileHeaderTitleContainer';
import { usePageEntityFormStrings } from './PageEntityFormStringContext';
import { ProcessFlow } from './ProcessFlow';
import { RecordAvatar } from './RecordAvatar';
import { SectionContainer } from './SectionContainer';
import { TabContainer } from './TabContainer';

export const PageEntityFormDesktopContainer: FC = () => {
  const formHeaderDivRef = useRef<HTMLDivElement>(null);
  const dataState = useFormDataState();
  const isMobile = useIsMobile();

  const strings = usePageEntityFormStrings();
  const locale = useLocale();
  const recordId = useRecordId();
  const record = useContextSelector(DataFormContext, (state) => state.record);
  const selectedRelatedItem = useContextSelector(
    DataFormContext,
    (state) => state.selectedRelatedItem
  );
  const { language } = useLocale();

  const schema = useDataFormSchema();

  useMobileHeaderSetValue(schema.label, 2, 'title');

  const formConfig = useSelectedForm();
  const processFlowSteps = useProcessFlowSteps();

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
      <Wrapper formHeaderDivRef={formHeaderDivRef}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacingVerticalM,
            paddingTop: tokens.spacingVerticalM,
            paddingInline: tokens.spacingHorizontalM,
          }}
        >
          {!isMobile && (
            <div
              style={{
                // padding: 4,
                boxShadow: tokens.shadow2,
                borderRadius: extendedTokens.paperBorderRadius,
                background: tokens.colorNeutralBackground1,
                display: 'flex',
                // overflow: 'hidden',
              }}
            >
              <CommandContainer skeleton={dataState.isFetching} />
            </div>
          )}
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
              borderRadius: extendedTokens.paperBorderRadius,
              background: tokens.colorNeutralBackground1,
              overflow: 'hidden',
              zIndex: 2,
            }}
            ref={formHeaderDivRef}
          >
            {(!!formConfig.experience.headerControls?.length || !isMobile) && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingInline: tokens.spacingHorizontalM,
                  paddingTop: tokens.spacingVerticalS,
                  marginBottom: tokens.spacingVerticalS,
                }}
              >
                {!isMobile && (
                  <>
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
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: tokens.spacingHorizontalXS,
                            alignItems: 'center',
                          }}
                        >
                          <Subtitle2>{recordTitle}</Subtitle2>
                          <Caption1
                            style={{ color: tokens.colorNeutralForeground4 }}
                          >
                            {isDirty
                              ? `- ${strings.unsaved}`
                              : record
                              ? `- ${strings.saved}`
                              : ''}
                          </Caption1>
                        </div>
                        <Body1
                          style={{ color: tokens.colorNeutralForeground3 }}
                        >
                          {localizedLabel(language, schema)}
                        </Body1>
                      </div>
                    )}
                  </>
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
                          <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
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
            )}
            <MobileHeaderTitleContainer />
            <MobileHeaderRightContainer />
            {!!processFlowSteps?.length && (
              <ProcessFlow
                height={28}
                rounded={false}
                items={processFlowSteps}
                skeleton={dataState.isFetching}
              />
            )}
            <TabContainer />
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
      </Wrapper>
    </div>
  );
};

interface WrapperProps {
  formHeaderDivRef: React.RefObject<HTMLDivElement>;
}

const Wrapper: FC<PropsWithChildren<WrapperProps>> = ({
  children,
  formHeaderDivRef,
}) => {
  const isMobile = useIsMobile();

  const rect = useElementSize(formHeaderDivRef, isMobile ? 100 : 5000);

  const { density } = useExtendedThemeContext();

  const headerHeight = density === 'compact' ? 48 : 64;
  const tabContainerHeight = 36;

  const visible = !!rect && rect.bottom < headerHeight + tabContainerHeight;

  if (isMobile) {
    return (
      <ScrollView>
        <div
          style={{
            background: tokens.colorNeutralBackgroundAlpha2,
            backdropFilter: 'blur(20px)',
            position: 'fixed',
            transition: 'all 0.2s',
            top: visible ? headerHeight : -headerHeight,
            left: 0,
            right: 0,
            zIndex: visible ? 3 : 0,
            boxShadow: tokens.shadow4,
          }}
        >
          <TabContainer />
        </div>
        {children}
        <div style={{ height: 'env(safe-area-inset-bottom)' }} />
      </ScrollView>
    );
  }

  return children;
};
