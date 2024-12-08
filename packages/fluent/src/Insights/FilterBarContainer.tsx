import { Button } from '@fluentui/react-components';
import { CommandItemState } from '@headless-adminapp/app/command';
import { useOpenPromptDialog } from '@headless-adminapp/app/dialog/hooks';
import { InsightsContext } from '@headless-adminapp/app/insights';
import {
  ContextValue,
  useContextSelector,
  useContextSetValue,
} from '@headless-adminapp/app/mutable';
import { getAttributeFormattedValue } from '@headless-adminapp/app/utils';
import { Attribute } from '@headless-adminapp/core/attributes';
import { InsightsState } from '@headless-adminapp/core/experience/insights';
import { Icons } from '@headless-adminapp/icons';

import { OverflowCommandBar } from '../OverflowCommandBar';

export function FilterBarContainer() {
  const openPromptDialog = useOpenPromptDialog();
  const insightsState = useContextSelector(InsightsContext, (state) => state);
  const insightExpereince = insightsState.experience;

  const setValue = useContextSetValue(
    InsightsContext as unknown as React.Context<ContextValue<InsightsState>>
  );

  const handleOpenPromptDialog = async () => {
    const attributes = insightExpereince.filters.reduce((acc, item) => {
      acc[item.logicalName] =
        insightsState.experience.attributes[item.logicalName];
      return acc;
    }, {} as Record<string, Attribute>);

    const defaultValues = insightExpereince.filters.reduce((acc, item) => {
      acc[item.logicalName] = insightsState.data[item.logicalName];
      return acc;
    }, {} as Record<string, unknown>);

    const result = await openPromptDialog({
      attributes,
      defaultValues,
      title: 'Modify filter',
      allowDismiss: true,
    });

    if (!result) {
      return;
    }

    setValue({
      data: result,
    });
  };

  const filterCommandItems = insightExpereince.filters
    .map((item) => {
      const logicalName = item.logicalName;
      const value = insightsState.data[logicalName];
      const attribute = insightsState.experience.attributes[logicalName];

      if (!item.showInFilterBar) {
        return null;
      }

      if (!attribute || !value) {
        return null;
      }

      if (item.allowQuickFilter) {
        return {
          type: 'button',
          Icon: item.Icon,
          text: getAttributeFormattedValue(attribute, value, { maxCount: 2 }),
          onClick: async () => {
            const result = await openPromptDialog({
              allowDismiss: true,
              attributes: {
                [logicalName]: attribute,
              },
              defaultValues: {
                [logicalName]: value,
              },
              title: item.quickFilterTitle ?? attribute.label,
            });

            if (!result) {
              return;
            }

            setValue({
              data: {
                ...insightsState.data,
                [logicalName]: result[logicalName],
              },
            });
          },
        };
      }

      return {
        type: 'label',
        Icon: item.Icon,
        text:
          (item.beforeContent ?? '') +
          getAttributeFormattedValue(attribute, value, { maxCount: 2 }),
      } as CommandItemState;
    })
    .filter(Boolean) as CommandItemState[];

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexShrink: 0,
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <OverflowCommandBar
          commands={[filterCommandItems]}
          align="end"
          beforeDivider
        />
      </div>
      {insightExpereince.filters.length > 0 && (
        <Button
          appearance="primary"
          icon={<Icons.Filter size={16} />}
          onClick={handleOpenPromptDialog}
          style={{ flexShrink: 0, marginInline: 8 }}
        >
          Filter
        </Button>
      )}
    </div>
  );
}
