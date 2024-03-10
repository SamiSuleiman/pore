import { IsNotEmpty, MaxLength } from 'class-validator';

export class DefinitionDto {
  id: string;
  content: string;
}

export class UpsertDefinitionDto {
  @IsNotEmpty()
  @MaxLength(210)
  content: string;
}
