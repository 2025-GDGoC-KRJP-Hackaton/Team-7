import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list-dto';
import { AddPlaceDto } from './dto/add-place.dto';
import { DeletePlaceDto } from './dto/delete-place.dto';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { DecodedIdToken } from 'firebase-admin/auth';

interface FirebaseRequest extends Request {
  user: DecodedIdToken;
}

@ApiTags('Lists')
@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '리스트 생성 / Create a new list' })
  @ApiResponse({ status: 201, description: '✅ 리스트가 성공적으로 생성되었습니다. / List created successfully.' })
  @ApiResponse({ status: 400, description: '❌ 유효하지 않은 요청입니다. / Invalid request.' })
  createList(@Req() req: FirebaseRequest, @Body() createListDto: CreateListDto) {
    return this.listService.createList(req.user.uid, createListDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '모든 리스트 조회 / Get all lists for current user (only list names)' })
  @ApiResponse({ status: 200, description: '✅ 리스트 목록을 성공적으로 조회했습니다. / Lists retrieved successfully.' })
  getLists(@Req() req: FirebaseRequest) {
    return this.listService.getLists(req.user.uid);
  }

  @Get('shared/:shareId')
  @ApiOperation({ summary: '공유 ID로 리스트 조회 / Get shared list by shareId' })
  @ApiResponse({ status: 200, description: '✅ 공유 리스트를 조회했습니다. / Shared list retrieved successfully.' })
  @ApiResponse({ status: 404, description: '❌ 공유 리스트를 찾을 수 없습니다. / Shared list not found.' })
  getListByShareId(@Param('shareId') shareId: string) {
    return this.listService.getListByShareId(shareId);
  }

  @UseGuards(AuthGuard)
  @Get(':listId/share')
  @ApiBearerAuth()
  @ApiOperation({ summary: '리스트 공유 링크 반환 / Get shareable URL for list' })
  @ApiResponse({ status: 200, description: '✅ 공유 링크를 반환했습니다. / Shareable link returned.' })
  @ApiResponse({ status: 404, description: '❌ 리스트를 찾을 수 없습니다. / List not found.' })
  getShareLink(@Req() req: FirebaseRequest, @Param('listId') listId: string) {
    return this.listService.getShareLink(req.user.uid, listId);
  }

  @UseGuards(AuthGuard)
  @Post(':listId/places')
  @ApiBearerAuth()
  @ApiOperation({ summary: '리스트에 장소 추가 / Add a place to a list' })
  @ApiResponse({ status: 200, description: '✅ 장소가 리스트에 추가되었습니다. / Place added to list.' })
  @ApiResponse({ status: 404, description: '❌ 리스트를 찾을 수 없습니다. / List not found.' })
  addPlaceToList(@Req() req: FirebaseRequest, @Param('listId') listId: string, @Body() addPlaceDto: AddPlaceDto) {
    return this.listService.addPlaceToList(req.user.uid, listId, addPlaceDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':listId/places/:placeId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '리스트에서 장소 삭제 / Remove a place from a list' })
  @ApiResponse({ status: 200, description: '✅ 장소가 삭제되었습니다. / Place removed from list.' })
  @ApiResponse({ status: 404, description: '❌ 리스트 또는 장소를 찾을 수 없습니다. / List or place not found.' })
  removePlaceFromList(@Req() req: FirebaseRequest, @Param('listId') listId: string, @Param('placeId') placeId: string) {
    return this.listService.removePlaceFromList(req.user.uid, listId, placeId);
  }

  @UseGuards(AuthGuard)
  @Delete(':listId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '리스트 삭제 / Delete a list' })
  @ApiResponse({ status: 200, description: '✅ 리스트가 삭제되었습니다. / List deleted successfully.' })
  @ApiResponse({ status: 404, description: '❌ 리스트를 찾을 수 없습니다. / List not found.' })
  deleteList(@Req() req: FirebaseRequest, @Param('listId') listId: string) {
    return this.listService.deleteList(req.user.uid, listId);
  }

  @UseGuards(AuthGuard)
  @Get(':listId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '특정 리스트 상세 조회 / Get a list with full places array' })
  @ApiResponse({ status: 200, description: '✅ 리스트 상세 정보를 조회했습니다. / List details retrieved successfully.' })
  @ApiResponse({ status: 404, description: '❌ 리스트를 찾을 수 없습니다. / List not found.' })
  getListById(@Req() req: FirebaseRequest, @Param('listId') listId: string) {
    return this.listService.getListById(req.user.uid, listId);
  }
}
