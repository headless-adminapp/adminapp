import { DrawerBody } from '@fluentui/react-components';
import { DataFormProvider } from '@headless-adminapp/app/dataform';
import { DataLookup, Id } from '@headless-adminapp/core/attributes';
import { Icons } from '@headless-adminapp/icons';
import { FC, Fragment } from 'react';

import { BodyLoading } from '../components/BodyLoading';
import { DrawerHeader } from '../components/DrawerHeader';
import { PageBroken } from '../components/PageBroken';
import { FormContainer } from './FormContainer';
import { useLoadQuickCreateFormInfo } from './useLoadQuickCreateFormInfo';

interface QuickCreateItemContentProps {
  logicalName: string;
  onClose: () => void;
  onCreate: (value: DataLookup<Id>) => void;
}

export const QuickCreateItemContent: FC<QuickCreateItemContentProps> = ({
  logicalName,
  onClose,
  onCreate,
}) => {
  const result = useLoadQuickCreateFormInfo(logicalName, undefined);

  if (result.loading) {
    return (
      <Fragment>
        <DrawerHeader title="Quick Create" showCloseButton onClose={onClose} />
        <DrawerBody>
          <BodyLoading loading />
        </DrawerBody>
      </Fragment>
    );
  }

  if (result.error) {
    return (
      <Fragment>
        <DrawerHeader title="Quick Create" showCloseButton onClose={onClose} />
        <DrawerBody>
          <PageBroken
            Icon={Icons.Error}
            title={result.title}
            message={result.message}
          />
        </DrawerBody>
      </Fragment>
    );
  }

  const { schema, form, commands } = result;

  if (schema.restrictions?.disableCreate) {
    return (
      <Fragment>
        <DrawerHeader
          title={`Quick Create - ${schema.label}`}
          showCloseButton
          onClose={onClose}
        />
        <DrawerBody>
          <PageBroken
            Icon={Icons.Error}
            title="Creating is disabled"
            message="Creating records is disabled for this entity."
          />
        </DrawerBody>
      </Fragment>
    );
  }

  return (
    <DataFormProvider schema={schema} form={form} commands={commands}>
      <FormContainer onClose={onClose} onCreate={onCreate} />
    </DataFormProvider>
  );
};
