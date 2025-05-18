import { IsString } from 'class-validator';

export class DeletePlaceDto {
  @IsString()
  listId: string;

  @IsString()
  placeId: string;
}
