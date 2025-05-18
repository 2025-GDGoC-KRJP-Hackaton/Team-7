import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Patch,
  Get,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { UpdateNameDto } from './dto/update-name.dto';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입 / Sign up' })
  @ApiResponse({ status: 201, description: '회원가입 성공 / Sign up successful' })
  @ApiResponse({
    status: 400,
    description: '이메일 형식 오류 또는 이미 존재하는 이메일 / Invalid email format or email already exists',
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        summary: '기본 예시 / Basic example',
        value: {
          email: 'test@example.com',
          password: 'password1234',
          name: '홍길동',
        },
      },
    },
  })
  signUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인 (토큰 검증) / Login (Verify token)' })
  @ApiResponse({ status: 200, description: '로그인 성공 / Login successful' })
  @ApiResponse({ status: 401, description: '유효하지 않은 토큰 / Invalid token' })
  @ApiBody({
    type: LoginDto,
    examples: {
      example1: {
        summary: '로그인 예시 / Login example',
        value: {
          idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2ZGY...'
        },
      },
    },
  })
  login(@Body() dto: LoginDto) {
    return this.authService.signIn(dto);
  }

  @Post('google-login')
  @ApiOperation({ summary: 'Google OAuth 로그인 / Google OAuth Login' })
  @ApiResponse({ status: 200, description: '로그인 성공 / Login successful' })
  @ApiResponse({ status: 401, description: '유효하지 않은 Firebase ID Token / Invalid Firebase ID Token' })
  @ApiBody({
    type: GoogleLoginDto,
    examples: {
      example1: {
        summary: 'Google OAuth 로그인 예시 / Google OAuth login example',
        value: {
          idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2ZGY...'
        },
      },
    },
  })
  googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.googleLogin(dto);
  }

  @Post('test-login')
  @ApiOperation({ summary: '테스트용 로그인 (idToken 발급) / Test login (issue idToken)' })
  @ApiResponse({ status: 200, description: 'idToken 반환 / idToken returned' })
  @ApiResponse({ status: 401, description: '이메일 또는 비밀번호 오류 / Email or password error' })
  @ApiBody({
    schema: {
      example: {
        email: 'test@example.com',
        password: 'password1234',
      },
    },
  })
  testLogin(@Body() dto: { email: string; password: string }) {
    return this.authService.loginWithEmail(dto);
  }

  @UseGuards(AuthGuard)
  @Patch('password')
  @ApiBearerAuth()
  @ApiOperation({ summary: '비밀번호 변경 / Change password' })
  @ApiResponse({ status: 200, description: '비밀번호 변경 성공 / Password changed successfully' })
  @ApiResponse({ status: 400, description: '비밀번호 변경 실패 / Password change failed' })
  @ApiBody({
    type: UpdatePasswordDto,
    examples: {
      example1: {
        summary: '비밀번호 변경 예시 / Change password example',
        value: {
          newPassword: 'newSecurePassword123!',
        },
      },
    },
  })
  updatePassword(@Req() req: Request, @Body() dto: UpdatePasswordDto) {
    return this.authService.updatePassword(req.user!, dto);
  }

  @UseGuards(AuthGuard)
  @Patch('name')
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 이름 변경 / Update display name' })
  @ApiResponse({ status: 200, description: '이름 변경 성공 / Name updated successfully' })
  @ApiResponse({ status: 400, description: '이름 변경 실패 / Name update failed' })
  @ApiBody({
    type: UpdateNameDto,
    examples: {
      example1: {
        summary: '이름 변경 예시 / Update name example',
        value: {
          name: '홍길동',
        },
      },
    },
  })
  updateName(@Req() req: Request, @Body() dto: UpdateNameDto) {
    return this.authService.updateName(req.user!, dto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그인된 유저 정보 조회 / Get current user info' })
  @ApiResponse({ status: 200, description: '유저 정보 반환 성공 / User info returned' })
  @ApiResponse({ status: 401, description: '인증 실패 / Authentication failed' })
  getMe(@Req() req: Request) {
    return this.authService.getMe(req.user!);
  }

  @UseGuards(AuthGuard)
  @Delete('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '회원 탈퇴 / Delete account' })
  @ApiResponse({ status: 200, description: '회원 탈퇴 완료 / Account deletion successful' })
  @ApiResponse({ status: 400, description: '회원 탈퇴 실패 / Account deletion failed' })
  deleteAccount(@Req() req: Request) {
    return this.authService.deleteAccount(req.user!.uid);
  }
}
