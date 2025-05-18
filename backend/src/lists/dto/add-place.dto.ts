import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddPlaceDto {
  @ApiProperty({ example: 'rakushisha', description: '장소 ID / Place ID' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Rakushisha Poet Hut', description: '장소 이름 / Place name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '일본 교토시 우쿄구 사가텐류지스스키노바바초', description: '주소 정보 / Address of the place' })
  @IsString()
  address: string;

  @ApiProperty({ example: '조용하고 시적인 장소입니다.', description: '설명 / Description of the place' })
  @IsString()
  description: string;
}
