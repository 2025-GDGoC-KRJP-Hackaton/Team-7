import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LikeService } from './like.service';
import { ToggleLikePlaceDto } from './dto/toggle-like-place.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';

interface FirebaseRequest extends Request {
  user: DecodedIdToken;
}

@ApiTags('Likes')
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '장소 좋아요 토글 / Toggle like for a place' })
  @ApiResponse({ status: 200, description: '✅ 좋아요 상태가 변경되었습니다. / Like status toggled.' })
  @ApiResponse({ status: 400, description: '❌ 잘못된 요청입니다. / Invalid request.' })
  async toggleLike(@Body() dto: ToggleLikePlaceDto, @Req() req: FirebaseRequest) {
    return this.likeService.toggleLikePlace(req.user.uid, dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '좋아요한 장소 리스트 조회 / Get liked places for the user' })
  @ApiResponse({ status: 200, description: '✅ 좋아요한 장소들을 반환했습니다. / Liked places retrieved.' })
  async getLiked(@Req() req: FirebaseRequest) {
    return this.likeService.getLikedPlaces(req.user.uid);
  }
}
