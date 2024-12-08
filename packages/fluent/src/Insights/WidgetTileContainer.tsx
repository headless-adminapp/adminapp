'use client';
import { Title2, tokens } from '@fluentui/react-components';
import { TileWidgetExperience } from '@headless-adminapp/core/experience/insights';
import { FC } from 'react';
import { WidgetTitleBar } from './WidgetTitleBar';
import { useWidgetDetail } from './hooks/useWidgetDetail';

interface WidgetTileContainerProps {
  content: TileWidgetExperience;
}

export const WidgetTileContainer: FC<WidgetTileContainerProps> = ({
  content,
}) => {
  const { transformedCommands, widget } =
    useWidgetDetail<TileWidgetExperience>(content);

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        background: tokens.colorNeutralBackground1,
        boxShadow: tokens.shadow2,
        borderRadius: tokens.borderRadiusMedium,
        flexDirection: 'column',
      }}
    >
      <WidgetTitleBar title={widget.title} commands={transformedCommands} />
      <div style={{ display: 'flex', flex: 1 }}>
        <div
          style={{
            flex: 1,
            alignItems: 'center',
            display: 'flex',
            paddingInline: 16,
          }}
        >
          <Title2>Not supported yet</Title2>
        </div>
      </div>
    </div>
  );
};
