import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateListDto {
  @ApiProperty({ example: '봄 교토 여행', description: '리스트 이름 / Name of the list' })
  @IsString()
  name: string;
}