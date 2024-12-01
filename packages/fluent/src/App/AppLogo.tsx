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

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
        }}
      >
        <Icon size={24} />
      </div>
    );
  }

  if (logo.image) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
        }}
      >
        <img src={logo.image} alt={title} style={{ width: 24, height: 24 }} />
      </div>
    );
  }

  return null;
};
