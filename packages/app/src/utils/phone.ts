import { type CountryCode, parsePhoneNumberWithError } from 'libphonenumber-js';

export function parsePhoneNumber(input: string, defaultCountry?: string) {
  try {
    const phoneNumber = parsePhoneNumberWithError(
      input,
      defaultCountry as CountryCode
    );

    let rawValue = String(phoneNumber.number);

    if (phoneNumber.ext) {
      rawValue += ';ext=' + phoneNumber.ext;
    }

    let formattedNational = phoneNumber.formatInternational();

    if (defaultCountry && defaultCountry === phoneNumber.country) {
      formattedNational = phoneNumber.formatNational();
    }

    return {
      formattedInternationalValue: phoneNumber.formatInternational(),
      formattedNationalValue: formattedNational,
      rawValue: rawValue,
      isValid: phoneNumber.isPossible(),
      uri: phoneNumber.getURI(),
    };
  } catch {
    return {
      formattedInternationalValue: input,
      formattedNationalValue: input,
      rawValue: input,
      isValid: false,
      uri: null,
    };
  }
}
