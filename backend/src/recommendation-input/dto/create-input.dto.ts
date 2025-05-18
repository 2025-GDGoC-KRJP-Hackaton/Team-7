import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateRecommendationInputDto {
  @ApiProperty({ example: '서울 성수동', description: '사용자가 가고 싶은 장소 / Desired location' })
  @IsString()
  location: string;

  @ApiProperty({
    example: '사람 많은 곳 싫어서 조용한 카페 위주로 추천해줘',
    description: '선호 조건 / Optional preferences',
    required: false,
  })
  @IsOptional()
  @IsString()
  preferences?: string;
}