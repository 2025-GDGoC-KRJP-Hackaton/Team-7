import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AiAssistantService } from './ai-assistant.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AiRequestDto } from './dto/ai-request.dto';

@ApiTags('AI Assistant')
@Controller('ai-assistant')
export class AiAssistantController {
  constructor(private readonly aiService: AiAssistantService) {}

  @Post('recommend')
  @ApiOperation({ summary: '여행지 추천 받기' })
  @ApiResponse({
    status: 200,
    description: '추천 성공',
    schema: {
      example: {
        message: '전체 추천 메시지',
        suggestions: [
          {
            id: 'abc123',
            name: '조용한 카페',
            address: '서울 성수동 123',
            description: '사람이 적고 분위기 좋은 카페입니다.',
            timestamp: '2025-05-18T05:00:00.000Z'
          },
        ],
      },
    },
  })
  @ApiBody({
    type: AiRequestDto,
    examples: {
      example1: {
        summary: '기본 예시',
        value: {
          userId: 'user123',
          location: '서울 성수동',
          preferences: '사람 많은 곳 말고 조용한 카페 위주로 추천해줘',
        },
      },
    },
  })
  async recommend(@Body() body: AiRequestDto) {
    const { userId, location, preferences } = body;
    return this.aiService.generateRecommendation(userId, location, preferences);
  }

  @Get('recommendations/:userId')
  @ApiOperation({ summary: '추천된 여행지 목록 조회 (최신순 5개)' })
  @ApiResponse({
    status: 200,
    description: '추천 결과 조회 성공',
    schema: {
        example: [
            {
                id: 'xyz789',
                name: '성수동 갤러리',
                address: '서울 성동구 아차산로 23길 5',
                description: '조용하고 예술적인 공간입니다.',
            },
        ],
    },
})
async getRecommendations(@Param('userId') userId: string) {
    return this.aiService.getRecommendationsByUser(userId);
}
}
