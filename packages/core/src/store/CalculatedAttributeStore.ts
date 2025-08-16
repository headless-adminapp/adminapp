import { SchemaAttributes } from '../schema';
import { CalculatedAttributeInfo } from '../schema/CalculatedAttributeInfo';
import { ICalculatedAttributeStore } from './ICalculatedAttributeStore';

export class CalculatedAttributeStore implements ICalculatedAttributeStore {
  private readonly allCalculatedAttributeInfos: Array<CalculatedAttributeInfo> =
    [];
  private readonly calculatedAttributeInfoListBySchema: Record<
    string,
    CalculatedAttributeInfo[]
  > = {};
  private readonly calculatedAttributeInfoDicBySchema: Record<
    string,
    Record<string, CalculatedAttributeInfo>
  > = {}; // Record<logicalname, Record<attributename, info>> by source
  private readonly calculatedAttributeInfoByDeps: Record<
    string,
    Record<string, Array<CalculatedAttributeInfo>>
  > = {}; // Record<logicalname, Record<attributename, info[]>> by deps (reverse)

  // TODO: No recursive dependencies allowed

  register<
    S extends SchemaAttributes = SchemaAttributes,
    R extends Record<string, SchemaAttributes> = Record<
      string,
      SchemaAttributes
    >
  >(info: CalculatedAttributeInfo<S, R>) {
    const logicalName = info.logicalName;
    const attributeName = info.attributeName as string;

    if (!this.calculatedAttributeInfoDicBySchema[logicalName]) {
      this.calculatedAttributeInfoDicBySchema[logicalName] = {};
    }

    if (!this.calculatedAttributeInfoListBySchema[logicalName]) {
      this.calculatedAttributeInfoListBySchema[logicalName] = [];
    }

    if (this.calculatedAttributeInfoDicBySchema[logicalName][attributeName]) {
      throw new Error(
        `Duplicate registration for ${logicalName}.${attributeName}`
      );
    }

    this.calculatedAttributeInfoListBySchema[logicalName].push(
      info as CalculatedAttributeInfo
    );
    this.allCalculatedAttributeInfos.push(info as CalculatedAttributeInfo);

    this.calculatedAttributeInfoDicBySchema[logicalName][attributeName] =
      info as CalculatedAttributeInfo;

    for (const dep of info.deps as string[]) {
      if (!this.calculatedAttributeInfoByDeps[logicalName]) {
        this.calculatedAttributeInfoByDeps[logicalName] = {};
      }

      if (!this.calculatedAttributeInfoByDeps[logicalName][dep]) {
        this.calculatedAttributeInfoByDeps[logicalName][dep] = [];
      }

      this.calculatedAttributeInfoByDeps[logicalName][dep].push(
        info as CalculatedAttributeInfo
      );
    }

    for (const [relatedLogicalName, relatedInfo] of Object.entries(
      info.relatedDeps || {}
    )) {
      if (!this.calculatedAttributeInfoByDeps[relatedLogicalName]) {
        this.calculatedAttributeInfoByDeps[relatedLogicalName] = {};
      }

      for (const column of relatedInfo.columns) {
        if (!this.calculatedAttributeInfoByDeps[relatedLogicalName][column]) {
          this.calculatedAttributeInfoByDeps[relatedLogicalName][column] = [];
        }

        this.calculatedAttributeInfoByDeps[relatedLogicalName][column].push(
          info as CalculatedAttributeInfo
        );
      }
    }
  }

  getCalculatedAttributeInfos(
    logicalName: string
  ): Record<string, CalculatedAttributeInfo> | undefined {
    return this.calculatedAttributeInfoDicBySchema[logicalName];
  }

  getCalculatedAttributeInfo(
    logicalName: string,
    attributeName: string
  ): CalculatedAttributeInfo | undefined {
    return this.calculatedAttributeInfoDicBySchema[logicalName]?.[
      attributeName
    ];
  }

  getCalculatedAttributeInfosByDeps(
    logicalName: string,
    ...attributeNames: string[]
  ): CalculatedAttributeInfo[] {
    return attributeNames.flatMap(
      (name) => this.calculatedAttributeInfoByDeps[logicalName]?.[name] || []
    );
  }
}
