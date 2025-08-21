export function isColorDark(color: string) {
  let hexColor = getColorHexCode(color);

  if (!hexColor) {
    return false;
  }

  hexColor = hexColor.substring(1);

  const rgb = parseInt(hexColor, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128;
}

function getColorHexCode(color: string) {
  if (color.startsWith('#')) {
    return color;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  const tempDiv = document.createElement('div');
  tempDiv.style.color = color; // Accepts color name, rgb(), hsl(), etc.
  document.body.appendChild(tempDiv);

  const computedColor = getComputedStyle(tempDiv).color;

  document.body.removeChild(tempDiv);

  // Convert rgb(a) string to hex
  const rgb = computedColor.match(/\d+/g); // Extract numbers

  if (!rgb) return null;

  // rgb might have 3 or 4 values (ignore alpha)
  const hex = rgb
    .slice(0, 3)
    .map((x) => {
      const hexPart = Number(x).toString(16);
      return hexPart.length === 1 ? '0' + hexPart : hexPart;
    })
    .join('');

  return '#' + hex;
}
