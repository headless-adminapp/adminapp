import { CommandItemState } from '@headless-adminapp/app/command';
import {
  useDataFormSchema,
  useMainFormCommands,
} from '@headless-adminapp/app/dataform/hooks';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { RecordSetContext } from '@headless-adminapp/app/recordset';
import { useRecordSetVisibility } from '@headless-adminapp/app/recordset/hooks';
import { useRouter } from '@headless-adminapp/app/route/hooks';
import { Icons } from '@headless-adminapp/icons';
import { FC, useMemo } from 'react';

import { OverflowCommandBar } from '../OverflowCommandBar';

export const CommandContainer: FC = () => {
  const gridCommands = useMainFormCommands();

  const router = useRouter();

  const schema = useDataFormSchema();
  const [recordSetVisible, setRecordSetVisible] = useRecordSetVisibility();
  const recordSetContext = useContextSelector(
    RecordSetContext,
    (state) => state
  );

  const extendedCommands = useMemo(() => {
    return [
      [
        {
          type: 'icon',
          Icon: Icons.ArrowLeft,
          onClick: () => {
            router.back();
          },
        } as CommandItemState,
      ],
      ...(recordSetContext.logicalName === schema.logicalName &&
      recordSetContext.ids.length > 0
        ? [
            [
              {
                type: 'icon',
                Icon: Icons.ListLtr,
                onClick: () => {
                  setRecordSetVisible(!recordSetVisible);
                },
              } as CommandItemState,
            ],
          ]
        : []),
      ...gridCommands,
    ];
  }, [gridCommands, recordSetContext, recordSetVisible, schema.logicalName]);

  return <OverflowCommandBar commands={extendedCommands} />;
};