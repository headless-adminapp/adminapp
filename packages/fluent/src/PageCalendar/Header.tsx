import {
  Button,
  Caption1,
  Divider,
  Subtitle2,
  tokens,
} from '@fluentui/react-components';
import { useConfig } from '@headless-adminapp/app/calendar/hooks/useConfig';
import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { iconSet } from '@headless-adminapp/icons-fluent';
import { Fragment } from 'react';
import { Controller, Path, UseFormReturn } from 'react-hook-form';

import { StandardControl } from '../PageEntityForm/StandardControl';

interface HeaderProps<SA extends SchemaAttributes = SchemaAttributes> {
  filterForm: UseFormReturn<InferredSchemaType<SA>, unknown, undefined>;
  onCreateButtonClick: () => void;
}

export function Header<SA extends SchemaAttributes = SchemaAttributes>({
  filterForm,
  onCreateButtonClick,
}: Readonly<HeaderProps<SA>>) {
  const config = useConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusLarge,
        paddingBlock: tokens.spacingVerticalS,
        paddingInline: tokens.spacingHorizontalM,
        gap: tokens.spacingVerticalS,
        boxShadow: tokens.shadow2,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacingHorizontalM,
        }}
      >
        <div style={{ flex: 1 }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Subtitle2 style={{ color: tokens.colorNeutralForeground1 }}>
                {config.title}
              </Subtitle2>
              <Caption1 style={{ color: tokens.colorNeutralForeground2 }}>
                {config.description}
              </Caption1>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacingHorizontalS,
          }}
        >
          {!config.createOptions && (
            <Button
              style={{ fontWeight: tokens.fontWeightMedium }}
              icon={<iconSet.Add />}
              appearance="primary"
              onClick={onCreateButtonClick}
            >
              Create
            </Button>
          )}
        </div>
      </div>
      {!!config.filterAttributes &&
        Object.keys(config.filterAttributes).length > 0 && (
          <Fragment>
            <Divider style={{ opacity: 0.2 }} />
            <div style={{ display: 'flex', gap: tokens.spacingHorizontalS }}>
              {Object.entries(config.filterAttributes).map(
                ([attributeName, attribute]) => {
                  return (
                    <Controller
                      key={attributeName}
                      control={filterForm.control}
                      name={attributeName as Path<InferredSchemaType<SA>>}
                      render={({ field }) => {
                        return (
                          <div>
                            <StandardControl
                              attribute={attribute}
                              name={attributeName}
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                            />
                          </div>
                        );
                      }}
                    />
                  );
                }
              )}
            </div>
          </Fragment>
        )}
    </div>
  );
}
