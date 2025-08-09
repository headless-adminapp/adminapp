import { useMobileHeaderSetValue } from './useMobileHeaderSetValue';

export function useMobileHeader(
  showBackButton: boolean,
  options?: {
    title?: React.ReactNode;
    rightContent?: React.ReactNode;
    order?: number;
  }
) {
  useMobileHeaderSetValue(
    showBackButton,
    options?.order ?? 0,
    'showBackButton'
  );
  useMobileHeaderSetValue(options?.title, options?.order ?? 0, 'title');
  useMobileHeaderSetValue(
    options?.rightContent,
    options?.order ?? 0,
    'rightComponent'
  );
}
