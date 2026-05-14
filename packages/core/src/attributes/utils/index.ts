import type { AttachmentAttribute } from '../AttachmentAttribute';
import type { Attribute } from '../Attribute';
import type { BooleanAttribute } from '../BooleanAttribute';
import type { ChoiceAttribute, ChoicesAttribute } from '../ChoiceAttribute';
import type { DateAttribute } from '../DateAttribute';
import type { Id, IdAttribute } from '../IdAttribute';
import type { LookupAttribute } from '../LookupAttribute';
import type { MixedAttribute } from '../MixedAttribute';
import type { MoneyAttribute } from '../MoneyAttribute';
import type { NumberAttribute } from '../NumberAttribute';
import type { StringAttribute } from '../StringAttribute';

export function isStringAttribute(
  attribute: Attribute,
): attribute is StringAttribute {
  return attribute.type === 'string';
}

export function isNumberAttribute(
  attribute: Attribute,
): attribute is NumberAttribute {
  return attribute.type === 'number';
}

export function isAttachmentAttribute(
  attribute: Attribute,
): attribute is AttachmentAttribute {
  return attribute.type === 'attachment';
}

export function isBooleanAttribute(
  attribute: Attribute,
): attribute is BooleanAttribute {
  return attribute.type === 'boolean';
}

export function isDateAttribute(
  attribute: Attribute,
): attribute is DateAttribute {
  return attribute.type === 'date';
}

export function isLookupAttribute(
  attribute: Attribute,
): attribute is LookupAttribute {
  return attribute.type === 'lookup';
}

export function isMoneyAttribute(
  attribute: Attribute,
): attribute is MoneyAttribute {
  return attribute.type === 'money';
}

export function isMixedAttribute(
  attribute: Attribute,
): attribute is MixedAttribute {
  return attribute.type === 'mixed';
}

export function isChoiceAttribute(
  attribute: Attribute,
): attribute is ChoiceAttribute<string | number> {
  return attribute.type === 'choice';
}

export function isChoicesAttribute(
  attribute: Attribute,
): attribute is ChoicesAttribute<string | number> {
  return attribute.type === 'choices';
}

export function isIdAttribute(
  attribute: Attribute,
): attribute is IdAttribute<Id> {
  return attribute.type === 'id';
}
