import { IsNotEmpty, MaxLength } from 'class-validator';

export class ExampleDto {
  id: string;
  content: string;
}

export class UpsertExampleDto {
  @IsNotEmpty()
  @MaxLength(210)
  content: string;
}
