import type { AttachmentAttribute } from './AttachmentAttribute';
import type { AttachmentsAttribute } from './AttachmentsAttribute';
import type { BooleanAttribute } from './BooleanAttribute';
import type { ChoiceAttribute, ChoicesAttribute } from './ChoiceAttribute';
import type { DateAttribute } from './DateAttribute';
import type { DateRangeAttribute } from './DateRangeAttribute';
import type { IdAttribute } from './IdAttribute';
import type {
  LookupAttribute,
  MultiLookupAttribute,
  RegardingAttribute,
} from './LookupAttribute';
import type { MixedAttribute } from './MixedAttribute';
import type { MoneyAttribute } from './MoneyAttribute';
import type { NumberAttribute } from './NumberAttribute';
import type { StringAttribute } from './StringAttribute';

/**
 * Attribute union
 * @description Represents the union of all possible attribute.
 */
export type Attribute =
  | IdAttribute<string | number>
  | StringAttribute
  | NumberAttribute
  | BooleanAttribute
  | DateAttribute
  | DateRangeAttribute
  | ChoiceAttribute<string | number>
  | ChoicesAttribute<string | number>
  | LookupAttribute
  | MultiLookupAttribute
  | RegardingAttribute
  | MoneyAttribute
  | AttachmentAttribute
  | AttachmentsAttribute
  | MixedAttribute;

/**
 * Attribute type union
 * @description Represents the union of all possible attribute types.
 */
export type AttributeType = Attribute['type'];
