/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthUserDto, ResetPasswordDto } from '../../domain/dtos';
import { ChangePasswordDto } from '../../domain/dtos/password/chance-password';
import { AuthGuard, Roles, RolesGuard } from './guards/auth.guard';
import { AuthGuard as GAuthGuard } from '@nestjs/passport';
import { Role } from '../../domain/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { User, Token } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint para login
  @Post('/login')
  @ApiBody({ type: AuthUserDto })
  async loginUser(
    @Body() loginDto: AuthUserDto
  ) /*: Promise<UserDto & { accessToken: string; refreshToken: string }>*/ {
    return await this.authService.loginUser(loginDto);
  }

  // Endpoints para autenticación con Google
  @Get('google/signin')
  @UseGuards(GAuthGuard('google'))
  async googleSignIn(@Req() req) {}

  @Get('google/signin/callback')
  @UseGuards(GAuthGuard('google'))
  async googleSignInCallback(@Req() req) {
    return this.authService.googleSignIn(req);
  }

  // Endpoint para verificar token y generar RefreshToken
  @UseGuards(AuthGuard)
  @Post('verify')
  @ApiBearerAuth('bearerAuth')
  verifyToken(@User() user: CurrentUser, @Token() token: string) {
    return this.authService.generateRefreshToken(token);
  }

  // Endpoint para subir imágenes
  @Post('upload')
  @ApiBearerAuth('bearerAuth')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File
  ): Promise<{ url: string }> {
    const url = await this.authService.uploadImage(file);
    return { url };
  }

  // Endpoint para cambiar contraseña
  @Patch('change-password')
  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @User() user: CurrentUser,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    return await this.authService.changePassword(user.id, changePasswordDto);
  }

  //test endpoint
  @Get('/getUserById')
  async getUserById(@Query('id') id: string) {
    return await this.authService.getUserById(id);
  }

  @Post('forgot-password')
  @ApiQuery({ name: 'email', type: 'string' })
  async forgotPassword(@Query('email') email: string) {
    return await this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
