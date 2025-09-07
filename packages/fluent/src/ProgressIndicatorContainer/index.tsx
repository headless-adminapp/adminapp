import {
  Body1,
  Dialog,
  DialogBody,
  DialogContent,
  Spinner,
  tokens,
} from '@fluentui/react-components';
import { useProgressIndicator } from '@headless-adminapp/app/progress-indicator/hooks';

import { DialogSurface } from '../components/fluent';

export const ProgressIndicatorContainer = () => {
  const state = useProgressIndicator();

  return (
    <>
      {state.overlayVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        />
      )}
      <Dialog
        open={state.visible}
        onOpenChange={() => {
          // do nothing
        }}
      >
        <DialogSurface style={{ maxWidth: 320 }}>
          <DialogBody>
            <DialogContent>
              <Spinner />
              {!!state.message && (
                <Body1
                  style={{
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: tokens.spacingVerticalL,
                  }}
                >
                  {state.message}
                </Body1>
              )}
              <button
                style={{
                  position: 'absolute',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              ></button>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};
