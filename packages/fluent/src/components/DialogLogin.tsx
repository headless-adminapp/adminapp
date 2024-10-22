import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
} from '@fluentui/react-components';

import { LoginForm } from './LoginForm';

interface LoginFormProps {
  logoImageUrl?: string;
  onLogin: (username: string, password: string) => Promise<void>;
}

export function DialogLogin(props: LoginFormProps) {
  return (
    <Dialog open onOpenChange={() => {}} modalType="non-modal">
      <DialogSurface style={{ maxWidth: 360 }}>
        <DialogBody>
          <DialogContent>
            <LoginForm
              onLogin={props.onLogin}
              logoImageUrl={props.logoImageUrl}
            />
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
