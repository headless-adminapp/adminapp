import { type FluentIcon } from '@fluentui/react-icons';
import { IconWrapper } from '@headless-adminapp/icons/IconWrapper';
import { CreateIconFn, IconProps } from '@headless-adminapp/icons/types';

export const createIcon: CreateIconFn<FluentIcon> = (Icon, isLazy) => {
  return function HocIcon(props: IconProps) {
    return (
      <IconWrapper size={props.size} isLazy={isLazy}>
        <Icon
          color={props.color}
          style={{
            opacity: props.opacity,
            width: props.size,
            height: props.size,
            flexShrink: 0,
          }}
          className={props.className}
        />
      </IconWrapper>
    );
  };
};
