import { type AvatarNamedColor } from '@fluentui/react-components';

const avatarColors: AvatarNamedColor[] = [
  'dark-red',
  'cranberry',
  'red',
  'pumpkin',
  'peach',
  'marigold',
  'gold',
  'brass',
  'brown',
  'forest',
  'seafoam',
  'dark-green',
  'light-teal',
  'teal',
  'steel',
  'blue',
  'royal-blue',
  'cornflower',
  'navy',
  'lavender',
  'purple',
  'grape',
  'lilac',
  'pink',
  'magenta',
  'plum',
  'beige',
  'mink',
  'platinum',
  'anchor',
];

export function getAvatarColor(
  name: string | null | undefined
): AvatarNamedColor | undefined {
  if (!name) {
    return;
  }

  const index = name
    .split('')
    .map((char) => char.charCodeAt(0))
    .reduce((acc, val) => acc + val, 0);

  return avatarColors[index % avatarColors.length];
}
