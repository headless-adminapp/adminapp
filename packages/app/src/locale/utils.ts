import { Localized } from '@headless-adminapp/core/types';

export function localizedLabel<
  T extends { label: string; localizedLabels?: Localized<string> }
>(language: string, value: T, fallback?: T): string {
  return (
    value.localizedLabels?.[language] ??
    fallback?.localizedLabels?.[language] ??
    value.label ??
    fallback?.label
  );
}
