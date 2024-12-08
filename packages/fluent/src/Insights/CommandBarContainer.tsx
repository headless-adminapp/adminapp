import { useCommands } from '@headless-adminapp/app/command';
import { useBaseCommandHandlerContext } from '@headless-adminapp/app/command/hooks';
import { InsightsContext } from '@headless-adminapp/app/insights';
import { useContextSelector } from '@headless-adminapp/app/mutable';

import { OverflowCommandBar } from '../OverflowCommandBar';

export function CommandBarContainer() {
  const baseCommandHandleContext = useBaseCommandHandlerContext();
  const insightExpereince = useContextSelector(
    InsightsContext,
    (x) => x.experience
  );

  const transformedCommands = useCommands([insightExpereince.commands], {
    ...baseCommandHandleContext,
    primaryControl: {},
  });

  return (
    <div style={{ flex: 1, flexShrink: 0, overflow: 'hidden' }}>
      <OverflowCommandBar commands={transformedCommands} />
    </div>
  );
}
