import { tokens } from '@fluentui/react-components';
import { useLoadFormGridPage } from '@headless-adminapp/app/dataform/hooks';
import { HistoryStateKeyProvider } from '@headless-adminapp/app/historystate';
import { PageEntityFormProvider } from '@headless-adminapp/app/providers/PageEntityFormProvider';
import { RecordSetProvider } from '@headless-adminapp/app/recordset';
import { Icons } from '@headless-adminapp/icons';
import { FC } from 'react';

import { PageBroken } from '../components/PageBroken';
import { PageLoading } from '../components/PageLoading';
import { PageEntityFormDesktopContainer } from './PageEntityFormDesktopContainer';
import { RecordSetNavigatorContainer } from './RecordSetNavigatorContainer';

interface PageEntityFormProps {
  logicalName: string;
  formId?: string;
  recordId?: string;
}

export const PageEntityForm: FC<PageEntityFormProps> = ({
  logicalName,
  formId,
  recordId,
}) => {
  const result = useLoadFormGridPage(logicalName, formId);

  if (result.loading) {
    return <PageLoading />;
  }

  if (result.error) {
    return (
      <PageBroken
        Icon={Icons.Error}
        title={result.title}
        message={result.message}
      />
    );
  }

  const { schema, form, commands } = result;

  if (!recordId) {
    if (schema.virtual) {
      return (
        <PageBroken
          Icon={Icons.Error}
          title="Virtual Schema"
          message="This schema is virtual and cannot be used in this context."
        />
      );
    }

    if (schema.restrictions?.disableCreate) {
      return (
        <PageBroken
          Icon={Icons.Error}
          title="Creating is disabled"
          message="Creating records is disabled for this entity."
        />
      );
    }
  }

  return (
    <HistoryStateKeyProvider historyKey={'page-entity-form.' + logicalName}>
      <RecordSetProvider>
        <PageEntityFormProvider
          schema={schema}
          form={form}
          recordId={recordId}
          commands={commands}
        >
          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'row',
              backgroundColor: tokens.colorNeutralBackground2,
              overflow: 'hidden',
            }}
          >
            <RecordSetNavigatorContainer />
            <PageEntityFormDesktopContainer />
          </div>
        </PageEntityFormProvider>
      </RecordSetProvider>
    </HistoryStateKeyProvider>
  );
};
