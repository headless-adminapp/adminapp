import { AttributeBase } from './AttributeBase';

export type StringAttribute = AttributeBase<string> & {
  type: 'string';
  format: 'text' | 'textarea' | 'email' | 'phone' | 'url';
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  textTransform?: 'capitalize' | 'uppercase' | 'lowercase' | 'none';
  autoNumber?: boolean;
};
