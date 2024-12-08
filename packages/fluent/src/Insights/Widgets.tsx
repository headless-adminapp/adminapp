import { InsightsContext } from '@headless-adminapp/app/insights';
import {
  useContextSelector,
  useCreateContextStore,
} from '@headless-adminapp/app/mutable';
import { WidgetContext } from '@headless-adminapp/app/widget';
import {
  InsightExpereince,
  WidgetExperience,
  WidgetState,
} from '@headless-adminapp/core/experience/insights';
import { FC, PropsWithChildren, useEffect } from 'react';

import { WidgetGrid, WidgetGridItem } from './Grid';
import { WidgetChartContainer } from './WidgetChartContainer';
import { WidgetDataGridContainer } from './WidgetDataGridContainer';
import { WidgetTableContainer } from './WidgetTableContainer';
import { WidgetTileContainer } from './WidgetTileContainer';

const WidgetProvider: FC<PropsWithChildren<{ widget: WidgetExperience }>> = ({
  children,
  widget,
}) => {
  const contextValue = useCreateContextStore<WidgetState>({
    widget,
    data: widget.defaultData,
  });

  useEffect(() => {
    contextValue.setValue({
      widget,
      data: widget.defaultData,
    });
  }, [widget]);

  return (
    <WidgetContext.Provider value={contextValue}>
      {children}
    </WidgetContext.Provider>
  );
};

export function Widgets({
  widgets,
}: {
  widgets: InsightExpereince['widgets'];
}) {
  return (
    <WidgetGrid>
      {widgets.map((widget, index) => {
        return (
          <WidgetGridItem key={index} row={widget.rows} column={widget.columns}>
            <WidgetProvider widget={widget}>
              <WidgetItem />
            </WidgetProvider>
          </WidgetGridItem>
        );
      })}
    </WidgetGrid>
  );
}

function WidgetItem() {
  const insightState = useContextSelector(InsightsContext, (state) => state);
  const widgetState = useContextSelector(WidgetContext, (state) => state);

  const widget = widgetState.widget;

  const content =
    typeof widget.content === 'function'
      ? widget.content(insightState, widgetState)
      : widget.content;

  if (content.type === 'tile') {
    return <WidgetTileContainer content={content} />;
  }

  if (content.type === 'chart') {
    return <WidgetChartContainer content={content} />;
  }

  if (content.type === 'grid') {
    return <WidgetDataGridContainer content={content} />;
  }

  if (content.type === 'table') {
    return <WidgetTableContainer content={content} />;
  }

  if (content.type === 'custom') {
    return <content.Component />;
  }

  return null;
}
