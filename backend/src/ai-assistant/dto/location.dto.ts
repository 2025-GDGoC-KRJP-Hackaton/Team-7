import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class LocationDto {
  @ApiProperty({ example: 'FR' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'Paris' })
  @IsString()
  city: string;

  @ApiProperty({ example: 48.8566 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 2.3522 })
  @IsNumber()
  longitude: number;
}
