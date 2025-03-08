import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  AuthUserDto } from '../../domain/dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard, Roles } from './guards/auth.guard';
import { Role } from '../../domain/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { User, Token } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('/login')
  // async loginUser(@Body() loginDto: AuthUserDto): Promise<UserDto & { accessToken: string/*; refreshToken: string*/ }> {
  //   return await this.authService.loginUser(loginDto);
  // }
  @Post('/login')
  async loginUser(@Body() loginDto: AuthUserDto)/*: Promise<UserDto & { accessToken: string; refreshToken: string }>*/ {
    return await this.authService.loginUser(loginDto);
  }

  @UseGuards( AuthGuard )
  @Post('verify')
  @ApiBearerAuth('bearerAuth')
  verifyToken( @User() user: CurrentUser, @Token() token: string) {
    return this.authService.generateRefreshToken(token);
  }
  
  @Post('/create')
  @Roles(Role.ADMIN)
  async createAdmin(@Body() createUserDto: AuthUserDto) {
    return this.authService.createAdmin(createUserDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
    const url = await this.authService.uploadImage(file);
    return { url };
  }

}