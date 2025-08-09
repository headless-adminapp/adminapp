import {
  Link,
  Toast,
  ToastBody,
  Toaster,
  ToastFooter,
  ToastTitle,
  useId,
  useToastController,
} from '@fluentui/react-components';
import { useIsMobile } from '@headless-adminapp/app/hooks';
import { ToastNotificationItem } from '@headless-adminapp/app/toast-notification';
import {
  useCloseToastNotification,
  useToastNotificationItems,
} from '@headless-adminapp/app/toast-notification/hooks';
import { useEffect, useRef } from 'react';

export const ToastNotificationContainer = () => {
  const items = useToastNotificationItems();
  const toasterId = useId('toaster');

  return (
    <>
      <Toaster toasterId={toasterId} />
      {items.map((item) => {
        return <Item key={item.id} item={item} toasterId={toasterId} />;
      })}
    </>
  );
};

const Item = ({
  item,
  toasterId,
}: {
  item: ToastNotificationItem;
  toasterId: string;
}) => {
  const { dispatchToast, dismissToast } = useToastController(toasterId);
  const closeToastNotification = useCloseToastNotification();

  const opened = useRef(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!item.isOpen) {
      dismissToast(item.id);
      return;
    }

    if (opened.current) {
      return;
    }

    opened.current = true;

    dispatchToast(
      <Toast>
        <ToastTitle>{item.title}</ToastTitle>
        <ToastBody>{item.text}</ToastBody>
        {!!item.actions?.length && (
          <ToastFooter>
            {item.actions.map((action, index) => (
              <Link key={index} onClick={action.onClick}>
                {action.text}
              </Link>
            ))}
          </ToastFooter>
        )}
      </Toast>,
      {
        timeout: 2000,
        intent: item.type,
        pauseOnHover: true,
        pauseOnWindowBlur: true,
        position: isMobile ? 'bottom' : 'top-end',
        onStatusChange: (event, data) => {
          if (data.status === 'dismissed') {
            closeToastNotification(item.id);
          }
        },
      }
    );
  }, [dispatchToast, closeToastNotification, item, dismissToast, isMobile]);

  return null;
};
