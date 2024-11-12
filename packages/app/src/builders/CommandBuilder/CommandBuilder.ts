import { DefaultCommandBuilder } from './DefaultCommandBuilder';
import { FormCommandBuilder } from './FormCommandBuilder';
import { SubgridCommandBuilder } from './SubgridCommandBuilder';
import { ViewCommandBuilder } from './ViewCommandBuilder';

export namespace CommandBuilder {
  export const View = ViewCommandBuilder;
  export const Form = FormCommandBuilder;
  export const Subgrid = SubgridCommandBuilder;
  export const Default = DefaultCommandBuilder;
}
