import { Localized } from '@headless-adminapp/core/types';

export function createLocalizedSelector<T>(
  stringSet: T,
  localizedStringSet: Localized<T> | undefined,
  language: string
) {
  return function selectLocalized<U>(selector: (stringSet: T) => U): U {
    if (localizedStringSet && localizedStringSet[language]) {
      return selector(localizedStringSet[language]);
    }

    return selector(stringSet);
  };
}

export function plurialize(
  count: number,
  singular: string | [string, string],
  plural?: string
): string {
  if (Array.isArray(singular)) {
    plural = singular[1];
    singular = singular[0];
  }

  let msg = count === 1 ? singular : plural ?? singular;

  msg = msg.replace('{count}', count.toString());

  return msg;
}
