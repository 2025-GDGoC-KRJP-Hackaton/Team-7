import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RecommendationInputService } from './recommendation-input.service';
import { CreateRecommendationInputDto } from './dto/create-input.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';

interface FirebaseRequest extends Request {
  user: DecodedIdToken;
}

@ApiTags('RecommendationInput')
@Controller('recommendation-input')
export class RecommendationInputController {
  constructor(private readonly inputService: RecommendationInputService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자의 입력 저장 / Save user recommendation input' })
  @ApiResponse({ status: 200, description: '✅ 입력 저장 성공 / Input saved successfully' })
  @ApiResponse({ status: 400, description: '❌ 잘못된 요청 / Bad request' })
  saveInput(@Req() req: FirebaseRequest, @Body() dto: CreateRecommendationInputDto) {
    return this.inputService.saveInput(req.user.uid, dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자의 입력 조회 / Get user recommendation input' })
  @ApiResponse({ status: 200, description: '✅ 입력 조회 성공 / Input retrieved successfully' })
  @ApiResponse({ status: 404, description: '❌ 입력 정보 없음 / Input not found' })
  getInput(@Req() req: FirebaseRequest) {
    return this.inputService.getInput(req.user.uid);
  }
}
