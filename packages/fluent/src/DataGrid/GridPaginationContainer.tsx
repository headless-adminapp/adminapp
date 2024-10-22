import { Body1, tokens } from '@fluentui/react-components';
import {
  useGridData,
  useGridSelection,
} from '@headless-adminapp/app/datagrid/hooks';
import { FC, Fragment } from 'react';

import { usePageEntityViewStrings } from '../PageEntityView/PageEntityViewStringContext';

export const GridPaginationContainer: FC = () => {
  const data = useGridData();
  const [selectedIds] = useGridSelection();
  const strings = usePageEntityViewStrings();

  return (
    <div>
      <Body1
        style={{
          color: tokens.colorNeutralForeground3,
          display: 'flex',
          gap: 8,
        }}
      >
        <span>
          {strings.records}: {data?.count ?? '-'}
        </span>
        <span>|</span>
        <span>
          {strings.loaded}: {data?.records.length ?? '-'}
        </span>
        {(selectedIds.length > 0 || (data?.count ?? 0) > 0) && (
          <Fragment>
            <span>|</span>
            <span>
              {strings.selected}: {selectedIds.length}
            </span>
          </Fragment>
        )}
      </Body1>
    </div>
  );
};
