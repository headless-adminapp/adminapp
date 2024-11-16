import { AttachmentAttribute, FileObject } from '../AttachmentAttribute';
import { Attribute } from '../Attribute';
import { BooleanAttribute } from '../BooleanAttribute';
import { ChoiceAttribute, ChoicesAttribute } from '../ChoiceAttribute';
import { DateAttribute } from '../DateAttribute';
import { Id, IdAttribute } from '../IdAttribute';
import { LookupAttribute } from '../LookupAttribute';
import { MixedAttribute } from '../MixedAttribute';
import { MoneyAttribute } from '../MoneyAttribute';
import { NumberAttribute } from '../NumberAttribute';
import { StringAttribute } from '../StringAttribute';

export function isStringAttribute(
  attribute: Attribute
): attribute is StringAttribute {
  return attribute.type === 'string';
}

export function isNumberAttribute(
  attribute: Attribute
): attribute is NumberAttribute {
  return attribute.type === 'number';
}

export function isAttachmentAttribute<
  T extends FileObject | string = FileObject | string
>(attribute: Attribute): attribute is AttachmentAttribute<T> {
  return attribute.type === 'attachment';
}

export function isBooleanAttribute(
  attribute: Attribute
): attribute is BooleanAttribute {
  return attribute.type === 'boolean';
}

export function isDateAttribute(
  attribute: Attribute
): attribute is DateAttribute {
  return attribute.type === 'date';
}

export function isLookupAttribute(
  attribute: Attribute
): attribute is LookupAttribute {
  return attribute.type === 'lookup';
}

export function isMoneyAttribute(
  attribute: Attribute
): attribute is MoneyAttribute {
  return attribute.type === 'money';
}

export function isMixedAttribute(
  attribute: Attribute
): attribute is MixedAttribute {
  return attribute.type === 'mixed';
}

export function isChoiceAttribute(
  attribute: Attribute
): attribute is ChoiceAttribute<string | number> {
  return attribute.type === 'choice';
}

export function isChoicesAttribute(
  attribute: Attribute
): attribute is ChoicesAttribute<string | number> {
  return attribute.type === 'choices';
}

export function isIdAttribute(
  attribute: Attribute
): attribute is IdAttribute<Id> {
  return attribute.type === 'id';
}
