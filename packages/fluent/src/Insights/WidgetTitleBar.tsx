import { Body1Strong, Divider } from '@fluentui/react-components';
import { CommandItemState } from '@headless-adminapp/app/command';
import { useLocale } from '@headless-adminapp/app/locale';

import CommandBar from '../CommandBar';
import { renderCommandItem } from '../OverflowCommandBar';

interface WidgetTitleBarProps {
  title: string;
  commands?: CommandItemState[][];
}

export function WidgetTitleBar({ title, commands }: WidgetTitleBarProps) {
  const { language } = useLocale();

  return (
    <>
      <div
        style={{
          display: 'flex',
          paddingInline: 16,
          paddingBlock: 8,
          height: 40,
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Body1Strong>{title}</Body1Strong>
          <div style={{ flex: 1 }} />
          {!!commands && commands[0]?.length > 0 && (
            <div style={{ marginRight: -20 }}>
              <CommandBar.Wrapper>
                {commands[0].map((command, index) =>
                  renderCommandItem(index, command, language)
                )}
              </CommandBar.Wrapper>
            </div>
          )}
        </div>
      </div>
      <div>
        <Divider style={{ opacity: 0.2 }} />
      </div>
    </>
  );
}
