import {
  Overflow,
  OverflowDivider,
  OverflowItem,
} from '@fluentui/react-components';
import { CommandItemState } from '@headless-adminapp/app/command';
import { useLocale } from '@headless-adminapp/app/locale';
import { FC, Fragment } from 'react';

import CommandBar from '../CommandBar';
import { OverflowMenu } from './OverflowMenu';
import { renderCommandItem } from './render';

interface OverflowCommandBarProps {
  commands: CommandItemState[][];
  align?: 'start' | 'end';
  beforeDivider?: boolean;
  afterDivider?: boolean;
}

export const OverflowCommandBar: FC<OverflowCommandBarProps> = ({
  commands,
  align = 'start',
  afterDivider,
  beforeDivider,
}) => {
  const { language } = useLocale();

  return (
    <Overflow>
      <CommandBar.Wrapper overflow="hidden" align={align}>
        {beforeDivider && <CommandBar.Divider />}
        {commands.map((group, groupIndex) => (
          <Fragment key={groupIndex}>
            {groupIndex > 0 && (
              <OverflowDivider groupId={String(groupIndex - 1)}>
                <CommandBar.Divider />
              </OverflowDivider>
            )}
            {group.map((item, index) => {
              const commandType = item.type;

              switch (item.type) {
                case 'menu':
                  return (
                    <OverflowItem
                      key={index}
                      id={`${groupIndex}-${index}`}
                      groupId={String(groupIndex)}
                    >
                      {renderCommandItem(
                        `${groupIndex}-${index}`,
                        item,
                        language
                      )}
                    </OverflowItem>
                  );
                case 'button':
                  return (
                    <OverflowItem
                      key={index}
                      id={`${groupIndex}-${index}`}
                      groupId={String(groupIndex)}
                    >
                      {renderCommandItem(
                        `${groupIndex}-${index}`,
                        item,
                        language
                      )}
                    </OverflowItem>
                  );
                case 'label':
                  return (
                    <OverflowItem
                      key={index}
                      id={`${groupIndex}-${index}`}
                      groupId={String(groupIndex)}
                    >
                      {renderCommandItem(
                        `${groupIndex}-${index}`,
                        item,
                        language
                      )}
                    </OverflowItem>
                  );

                case 'icon':
                  return (
                    <OverflowItem
                      key={index}
                      id={`${groupIndex}-${index}`}
                      groupId={String(groupIndex)}
                    >
                      {renderCommandItem(
                        `${groupIndex}-${index}`,
                        item,
                        language
                      )}
                    </OverflowItem>
                  );

                default:
                  throw new Error(`Unknown command type: ${commandType}`);
              }
            })}
          </Fragment>
        ))}
        <OverflowMenu items={commands} />
        {afterDivider && <CommandBar.Divider />}
      </CommandBar.Wrapper>
    </Overflow>
  );
};
