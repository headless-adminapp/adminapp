import { CalculatedAttributeInfo } from '../schema/CalculatedAttributeInfo';

export interface ICalculatedAttributeStore {
  getCalculatedAttributeInfos(
    logicalName: string
  ): Record<string, CalculatedAttributeInfo> | undefined; // list of calculated fields for given logicalName
  getCalculatedAttributeInfo(
    logicalName: string,
    attributeName: string
  ): CalculatedAttributeInfo | undefined; // calculated field info for given input
  getCalculatedAttributeInfosByDeps(
    logicalName: string,
    ...attributeNames: string[]
  ): CalculatedAttributeInfo[]; // List of calculated fields based on deps. Used in server side to know which fields to recalculate
}
