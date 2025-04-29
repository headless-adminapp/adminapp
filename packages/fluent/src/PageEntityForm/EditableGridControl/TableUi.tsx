import {
  Button,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  tokens,
} from '@fluentui/react-components';
import { SectionEditableGridControl } from '@headless-adminapp/core/experience/form';
import { Schema } from '@headless-adminapp/core/schema';
import { Icons } from '@headless-adminapp/icons';
import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';

import { SectionControlWrapper } from '../../DataForm/SectionControl';
import { StandardControl } from '../StandardControl';

const useStyles = makeStyles({
  table: {
    '& tbody tr:hover': {
      backgroundColor: 'transparent',
    },
    '& tr': {
      borderBottom: `${tokens.strokeWidthThin} solid transparent`,
    },
    '& th': {
      fontWeight: tokens.fontWeightMedium,
      paddingInline: tokens.spacingHorizontalXS,
    },
    '& td': {
      paddingInline: tokens.spacingHorizontalXS,
    },
    '& tbody tr:last-child': {
      borderBottom: 'none',
    },
    '& td:first-child': {
      paddingLeft: 0,
    },
    '& th:first-child': {
      paddingLeft: 0,
    },
    '& td:last-child': {
      paddingRight: 0,
    },
    '& th:last-child': {
      paddingRight: 0,
    },
  },
});

interface TableUiProps {
  schema: Schema;
  control: SectionEditableGridControl;
  formControl: Control;
  onAddRow?: () => void;
  onRemoveRow?: (index: number) => void;
  rows: Record<'__key', string>[];
  alias: string;
}

export const TableUi: FC<TableUiProps> = ({
  schema,
  control,
  formControl,
  onAddRow,
  onRemoveRow,
  rows,
  alias,
}) => {
  const styles = useStyles();

  return (
    <Table className={styles.table}>
      <colgroup>
        {control.controls.map((_, index) => (
          <col key={index} />
        ))}
        <col style={{ width: 36 }}></col>
      </colgroup>
      <TableHeader>
        <TableRow>
          {control.controls.map((control) => {
            const attributeName =
              typeof control === 'string' ? control : control.attributeName;

            const attribute = schema.attributes[attributeName];

            if (!attribute) {
              return null;
            }

            return (
              <TableHeaderCell key={attributeName}>
                {attribute.label ?? attribute.label}
              </TableHeaderCell>
            );
          })}
          <TableHeaderCell>
            <Button
              icon={<Icons.Add size={16} />}
              appearance="subtle"
              onClick={onAddRow}
            />
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((item, index) => (
          <TableRow key={item.__key}>
            {control.controls.map((control) => {
              const attributeName =
                typeof control === 'string' ? control : control.attributeName;

              const attribute = schema.attributes[attributeName];

              if (!attribute) {
                return null;
              }

              return (
                <TableCell key={attributeName}>
                  <Controller
                    name={`${alias}.${index}.${attributeName}`}
                    control={formControl}
                    render={({ field, fieldState, formState }) => {
                      const isError =
                        (fieldState.isTouched || formState.isSubmitted) &&
                        !!fieldState.error?.message;

                      return (
                        <SectionControlWrapper
                          label={attribute.label}
                          labelHidden
                          labelPosition="top"
                          isError={isError}
                        >
                          <StandardControl
                            attribute={attribute}
                            name={attributeName}
                            value={field.value ?? null}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder=""
                          />
                        </SectionControlWrapper>
                      );
                    }}
                  />
                </TableCell>
              );
            })}
            <TableCell>
              <Button
                icon={<Icons.Delete size={16} />}
                appearance="subtle"
                onClick={() => onRemoveRow?.(index)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
