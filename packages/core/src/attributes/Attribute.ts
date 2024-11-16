import { AttachmentAttribute, FileObject } from './AttachmentAttribute';
import { AttachmentsAttribute } from './AttachmentsAttribute';
import { BooleanAttribute } from './BooleanAttribute';
import { ChoiceAttribute, ChoicesAttribute } from './ChoiceAttribute';
import { DateAttribute } from './DateAttribute';
import { DateRangeAttribute } from './DateRangeAttribute';
import { IdAttribute } from './IdAttribute';
import { LookupAttribute, MultiLookupAttribute } from './LookupAttribute';
import { MixedAttribute } from './MixedAttribute';
import { MoneyAttribute } from './MoneyAttribute';
import { NumberAttribute } from './NumberAttribute';
import { StringAttribute } from './StringAttribute';

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
  | MoneyAttribute
  | AttachmentAttribute
  | AttachmentsAttribute
  | MixedAttribute;

export type AttributeType = Attribute['type'];
