import { AttributeBase } from './AttributeBase';

export type SuggestionOptions =
  | {
      type: 'static';
      values: string[];
    }
  | {
      type: 'dynamic';
      entity: string;
      field: string;
    };

export type StringTextAttributeOptions = {
  format: 'text';
  pattern?: string;
  autoNumber?: boolean;
  suggestions?: SuggestionOptions;
};

export type StringTextAreaAttributeOptions = {
  format: 'textarea';
};

export type StringTextEmailAttributeOptions = {
  format: 'email';
  suggestions?: SuggestionOptions;
};

export type StringTextPhoneAttributeOptions = {
  format: 'phone';
  suggestions?: SuggestionOptions;
};

export type StringTextUrlAttributeOptions = {
  format: 'url';
  suggestions?: SuggestionOptions;
};

export type StringTextRichTextAttributeOptions = {
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

export type StringAttribute = AttributeBase<string> & {
  type: 'string';
} & StringAttributeOptions;
