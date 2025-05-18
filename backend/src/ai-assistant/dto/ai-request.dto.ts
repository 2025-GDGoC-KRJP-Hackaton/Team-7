import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AiRequestDto {
  @ApiProperty({ example: 'user123' })
  @IsString()
  userId: string;

  @ApiProperty({ example: '서울 성수동' })
  @IsString()
  location: string;

  @ApiProperty({ example: '사람 많은 곳 말고 조용한 카페 위주로 추천해줘' })
  @IsString()
  preferences: string;
}
