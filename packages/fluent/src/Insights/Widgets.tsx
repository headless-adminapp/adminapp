import { useIsMobile } from '@headless-adminapp/app/hooks';
import {
  InsightConfig,
  WidgetInfo,
} from '@headless-adminapp/core/experience/insights';

import { WidgetGrid, WidgetGridGroup, WidgetGridItem } from './Grid';

export function Widgets({
  widgets,
}: Readonly<{
  widgets: InsightConfig['widgets'];
}>) {
  return (
    <WidgetGrid>
      <WidgetRenderer items={widgets} />
    </WidgetGrid>
  );
}

interface Props {
  items: WidgetInfo[];
}

function WidgetRenderer({ items }: Props) {
  const isMobile = useIsMobile();

  return items.map((widget, index) => {
    if (widget.type === 'space') {
      if (isMobile) {
        return null;
      }

      return <WidgetGridItem key={String(index)} column={widget.columns} />;
    }

    if (widget.type === 'group') {
      return (
        <WidgetGridGroup
          key={String(index)}
          column={isMobile ? 12 : widget.columns}
          row={widget.rows}
        >
          <WidgetRenderer items={widget.items} />
        </WidgetGridGroup>
      );
    }

    return (
      <WidgetGridItem
        key={String(index)}
        row={widget.rows}
        column={isMobile ? 12 : widget.columns}
      >
        <widget.Component {...widget.props} />
      </WidgetGridItem>
    );
  });
}
