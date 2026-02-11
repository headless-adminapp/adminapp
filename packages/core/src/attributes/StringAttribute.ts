import { AttributeBase } from './AttributeBase';

export type SuggestionOptions =
  | {
      // static list of suggestions
      type: 'static';
      values: string[];
    }
  | {
      // fetch suggestions from another entity's field
      type: 'dynamic';
      entity: string;
      field: string;
    };

export type StringTextAttributeOptions = {
  format: 'text';
  // regex pattern for validation
  pattern?: string;
  autoNumber?: boolean;
  // suggestions for autocomplete
  suggestions?: SuggestionOptions;
};

export type StringTextAreaAttributeOptions = {
  // textarea format
  format: 'textarea';
};

export type StringTextEmailAttributeOptions = {
  // email format
  format: 'email';
  // suggestions for autocomplete
  suggestions?: SuggestionOptions;
};

export type StringTextPhoneAttributeOptions = {
  // phone number format
  format: 'phone';
  // suggestions for autocomplete
  suggestions?: SuggestionOptions;
};

export type StringTextUrlAttributeOptions = {
  // url format
  format: 'url';
  // suggestions for autocomplete
  suggestions?: SuggestionOptions;
};

export type StringTextRichTextAttributeOptions = {
  // rich text editor
  format: 'richtext';
};

export type StringAttributeOptions = {
  minLength?: number;
  maxLength?: number;
  textTransform?: 'capitalize' | 'uppercase' | 'lowercase' | 'none';
} & (
  | StringTextAttributeOptions
  | StringTextAreaAttributeOptions
  | StringTextEmailAttributeOptions
  | StringTextPhoneAttributeOptions
  | StringTextUrlAttributeOptions
  | StringTextRichTextAttributeOptions
);

/**
 * String attribute type
 * @description Represents a string attribute with various formatting and validation options.
 * */
export type StringAttribute = AttributeBase<string> & {
  type: 'string';
} & StringAttributeOptions;
