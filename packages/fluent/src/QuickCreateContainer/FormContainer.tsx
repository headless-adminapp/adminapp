import {
  DrawerBody,
  MessageBar,
  MessageBarBody,
  Spinner,
  tokens,
} from '@fluentui/react-components';
import {
  useDataFormSchema,
  useFormNotifications,
  useSelectedForm,
} from '@headless-adminapp/app/dataform/hooks';
import { useFormDataState } from '@headless-adminapp/app/dataform/hooks/useFormDataState';
import { useMobileHeaderSetValue } from '@headless-adminapp/app/header/hooks/useMobileHeaderSetValue';
import { useFormSave } from '@headless-adminapp/app/quickcreate/hooks/useFormSave';
import { DataLookup, Id } from '@headless-adminapp/core/attributes';
import { useMutation } from '@tanstack/react-query';
import { FC, Fragment } from 'react';

import { BodyLoading } from '../components/BodyLoading';
import { DrawerFooter } from '../components/DrawerFooter';
import { DrawerHeader } from '../components/DrawerHeader';
import { Button } from '../components/fluent';
import { PageBroken } from '../components/PageBroken';
import { FormTab } from '../form/layout/FormTab';
import { SectionContainer } from '../PageEntityForm/SectionContainer';
import { QuickCreateTabContainer } from './QuickCreateTabContainer';

interface FormContainerProps {
  onClose: () => void;
  onCreate: (value: DataLookup<Id>) => void;
}

export const FormContainer: FC<FormContainerProps> = ({
  onClose,
  onCreate,
}) => {
  const dataState = useFormDataState();

  const schema = useDataFormSchema();

  useMobileHeaderSetValue(schema.label, 2, 'title');

  const formConfig = useSelectedForm();

  const notifications = useFormNotifications();

  const saveForm = useFormSave();

  const { mutate: save, isPending: isCreating } = useMutation({
    mutationFn: saveForm,
    onSuccess: (data) => {
      if (data) {
        onCreate(data);
      }
    },
  });

  if (!dataState.isFetching && dataState.isError) {
    return <PageBroken title="Error" message="Unable to load page" />;
  }

  return (
    <Fragment>
      <BodyLoading loading={isCreating} />
      <DrawerHeader
        title={`Quick Create - ${schema.label}`}
        showCloseButton
        onClose={onClose}
        bottomContent={
          <Fragment>
            <QuickCreateTabContainer />
            {notifications.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: tokens.spacingVerticalS,
                  paddingInline: tokens.spacingHorizontalS,
                  paddingTop: tokens.spacingVerticalS,
                }}
              >
                {notifications.map((notification, index) => (
                  <MessageBar
                    key={index}
                    intent={notification.level}
                    icon={null}
                  >
                    <MessageBarBody>{notification.message}</MessageBarBody>
                  </MessageBar>
                ))}
              </div>
            )}
          </Fragment>
        }
      />
      <DrawerBody
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: tokens.spacingVerticalM,
          // backgroundColor: tokens.colorNeutralBackground2,
        }}
      >
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
      </DrawerBody>
      <DrawerFooter>
        <Button appearance="primary" onClick={() => save()}>
          {isCreating ? (
            <Fragment>
              <Spinner
                size="extra-tiny"
                appearance="inverted"
                style={{ marginRight: 8 }}
              />
              Creating...
            </Fragment>
          ) : (
            'Create'
          )}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DrawerFooter>
    </Fragment>
  );
};
