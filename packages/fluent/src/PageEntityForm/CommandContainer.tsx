import { SkeletonItem, tokens } from '@fluentui/react-components';
import { CommandItemState } from '@headless-adminapp/app/command';
import {
  useDataFormSchema,
  useMainFormCommands,
} from '@headless-adminapp/app/dataform/hooks';
import { useIsMobile } from '@headless-adminapp/app/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { RecordSetContext } from '@headless-adminapp/app/recordset';
import { useRecordSetVisibility } from '@headless-adminapp/app/recordset/hooks';
import { useRouter } from '@headless-adminapp/app/route/hooks';
import { Icons } from '@headless-adminapp/icons';
import { FC, Fragment, useMemo } from 'react';

import CommandBar from '../CommandBar';
import { OverflowCommandBar, renderCommandItem } from '../OverflowCommandBar';

interface CommandContainerProps {
  skeleton?: boolean;
}

export const CommandContainer: FC<CommandContainerProps> = ({ skeleton }) => {
  const { language } = useLocale();
  const formCommands = useMainFormCommands();

  const router = useRouter();
  const isMobile = useIsMobile();

  const schema = useDataFormSchema();
  const [recordSetVisible, setRecordSetVisible] = useRecordSetVisibility();
  const recordSetContext = useContextSelector(
    RecordSetContext,
    (state) => state
  );

  const navigationCommands = useMemo(() => {
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
      recordSetContext.ids.length > 0 &&
      !isMobile
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
    ];
  }, [
    isMobile,
    recordSetContext.ids.length,
    recordSetContext.logicalName,
    recordSetVisible,
    router,
    schema.logicalName,
    setRecordSetVisible,
  ]);

  const extendedCommands = useMemo(() => {
    return [...navigationCommands, ...formCommands];
  }, [formCommands, navigationCommands]);

  if (skeleton) {
    return (
      <CommandBar.Wrapper overflow="hidden">
        {navigationCommands.map((group, groupIndex) => (
          <Fragment key={groupIndex}>
            {groupIndex > 0 && <CommandBar.Divider />}
            {group.map((item, index) => {
              const commandType = item.type;

              switch (item.type) {
                case 'menu':
                case 'button':
                case 'label':
                case 'icon':
                  return (
                    <Fragment key={`${groupIndex}-${index}`}>
                      {renderCommandItem(
                        `${groupIndex}-${index}`,
                        item,
                        language
                      )}
                    </Fragment>
                  );

                default:
                  throw new Error(`Unknown command type: ${commandType}`);
              }
            })}
          </Fragment>
        ))}
        <CommandBar.Divider />
        <SkeletonCommandButton />
        <SkeletonCommandButton />
        <SkeletonCommandButton />
      </CommandBar.Wrapper>
    );
  }

  return <OverflowCommandBar commands={extendedCommands} />;
};

const SkeletonCommandButton: FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: tokens.spacingHorizontalS,
        paddingInline: tokens.spacingHorizontalM,
      }}
    >
      <SkeletonItem style={{ width: 20, height: 20 }} />
      <SkeletonItem style={{ width: 60, height: 20 }} />
    </div>
  );
};
