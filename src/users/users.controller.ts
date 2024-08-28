import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from '@prisma/client'; // Import Role enum from Prisma

@Controller('user')
export class UserController {
  constructor(private userService: UsersService) {}

  // Endpoint to create a new user and generate a verification token
  @Post('create-and-verify')
  async createUserAndGenerateToken(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: Role = Role.USER // Default to USER role if not provided
  ) {
    console.log(email, password, role, 'create-and-verify');
    const token = await this.userService.createUserAndGenerateToken(email, password, role);
    console.log(token);
    return { token };
  }

  // Endpoint to generate a verification token for an existing user
  @Post('generate-verification-token')
  async generateVerificationToken(@Body('userId') userId: string) {
    const token = await this.userService.generateVerificationToken(userId);
    return { token };
  }

  // Endpoint to verify email using the token
  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    const result = await this.userService.verifyEmail(token);
    return { success: result };
  }
}
