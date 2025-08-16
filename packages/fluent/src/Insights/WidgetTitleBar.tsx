import { Body1Strong, Divider } from '@fluentui/react-components';
import { CommandItemState } from '@headless-adminapp/app/command';
import { useLocale } from '@headless-adminapp/app/locale';

import CommandBar from '../CommandBar';
import { renderCommandItem } from '../OverflowCommandBar';

interface WidgetTitleBarProps {
  title: string;
  commands?: CommandItemState[][];
  rightContent?: React.ReactNode;
}

export function WidgetTitleBar({
  title,
  commands,
  rightContent,
}: Readonly<WidgetTitleBarProps>) {
  const { language } = useLocale();

  return (
    <>
      <div
        style={{
          display: 'flex',
          paddingLeft: 16,
          paddingBlock: 8,
          height: 40,
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Body1Strong style={{ flexShrink: 0 }}>{title}</Body1Strong>
          <div style={{ flex: 1 }} />
          {rightContent}
          {!!commands && commands[0]?.length > 0 && (
            <CommandBar.Wrapper align="end">
              {commands[0].map((command, index) =>
                renderCommandItem(index, command, language)
              )}
            </CommandBar.Wrapper>
          )}
        </div>
      </div>
      <div>
        <Divider style={{ opacity: 0.2 }} />
      </div>
    </>
  );
}
