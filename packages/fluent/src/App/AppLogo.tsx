import { AppExperience } from '@headless-adminapp/core/experience/app';
import { IconPlaceholder } from '@headless-adminapp/icons';
import { FC } from 'react';

interface AppLogoProps {
  logo: AppExperience['logo'];
  title: string;
}

export const AppLogo: FC<AppLogoProps> = ({ logo, title }) => {
  if (logo.Icon) {
    const Icon = logo.Icon ?? IconPlaceholder;

    return <Icon size={24} />;
  }

  if (logo.image) {
    return (
      <img src={logo.image} alt={title} style={{ width: 24, height: 24 }} />
    );
  }

  return null;
};
