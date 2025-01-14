import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Account } from 'src/account/entities/account.entity';
import { LoginAuthDto } from 'src/auth/dto/login-auth.dto';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() createAuthDto: CreateAuthDto): Promise<Account> {
		return await this.authService.register(createAuthDto);
	}
	@Post('login')
	async login(
		@Body() loginAuthDto: LoginAuthDto,
		@Res({ passthrough: true }) response: Response,
	): Promise<{ token: string }> {
		const data = await this.authService.login(loginAuthDto);
		const expires = new Date();
		expires.setTime(expires.getTime() + 1 * 24 * 60 * 60 * 1000);
		response.cookie('auth', data.token, {
			httpOnly: true,
			sameSite: 'strict',
			expires: expires,
		});
		return { token: data.token };
	}
	@Post('logout')
	async logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie('auth');
		return {
			success: true,
		};
	}
}
