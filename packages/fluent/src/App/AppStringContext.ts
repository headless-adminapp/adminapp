import {
  CalendarStrings,
  defaultDatePickerStrings,
} from '@fluentui/react-datepicker-compat';
import {
  defaultOperatorStrings,
  OperatorStrings,
} from '@headless-adminapp/app/datagrid/column-filter';
import { createContext, useContext } from 'react';

export interface AppStringSet {
  datePickerStrings: CalendarStrings;
  loockupStrings: {
    newRecord: string;
    noRecordsFound: string;
  };
  operatorStrings: OperatorStrings;
  logout: string;
  error: string;
  searchPlaceholder: string;
}

export const defaultAppStrings: AppStringSet = {
  datePickerStrings: defaultDatePickerStrings,
  operatorStrings: defaultOperatorStrings,
  loockupStrings: {
    newRecord: 'New Record',
    noRecordsFound: 'No records found',
  },
  logout: 'Logout',
  error: 'Error',
  searchPlaceholder: 'Search...',
};

export const AppStringContext = createContext<AppStringSet>(defaultAppStrings);

export function useAppStrings() {
  const context = useContext(AppStringContext);

  return context;
}
