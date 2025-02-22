interface CustomHookExecuterProps {
  useHookFn: (() => void) | undefined | null;
}

export function CustomHookExecuter({
  useHookFn,
}: Readonly<CustomHookExecuterProps>) {
  if (!useHookFn) {
    return null;
  }

  return <CustomHookExecuterInternal useHookFn={useHookFn} />;
}

interface CustomHookExecuterInternalProps {
  useHookFn: () => void;
}

function CustomHookExecuterInternal({
  useHookFn,
}: Readonly<CustomHookExecuterInternalProps>) {
  useHookFn();

  return null;
}
