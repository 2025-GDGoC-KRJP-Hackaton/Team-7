import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateNameDto {
  @ApiProperty({ example: '홍길동', description: '새 사용자 이름 / New display name' })
  @IsString()
  name: string;
}