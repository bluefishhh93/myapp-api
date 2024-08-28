import { AuthService } from '../auth/auth.service';
import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PasswordService } from '../auth/password.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@prisma/client'; // Import Role enum from Prisma
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private authService: AuthService
  ) { }

  updateUser(userId: string, newUserData: UpdateUserInput) {
    return this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput,
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword,
    );

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }
  // Method to create a new user or generate a verification token if the user already exists
  async createUserAndGenerateToken(email: string, password: string, role: Role = Role.USER): Promise<string> {
    // Check if the user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if(existingUser.emailVerified !== null) {
        throw new BadRequestException('Email already registered');
      }
      // If user exists, clear old tokens and generate a new token
      await this.clearOldTokens(existingUser.id);
      return this.generateVerificationToken(existingUser.id);
    }

    // Create a new user if not existing
    const hashedPassword = await this.passwordService.hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Use 'password' instead of 'hashedPassword'
        role,     // Include the role field
      },
    });

    // Generate and return the verification token
    return this.generateVerificationToken(user.id);
  }


  async generateVerificationToken(userId: string): Promise<string> {
    // Optionally clear old tokens
    await this.clearOldTokens(userId);

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 10); // Token expires in 1 hour

    await this.prisma.verifyEmailToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return token;
  }

  async clearOldTokens(userId: string): Promise<void> {
    await this.prisma.verifyEmailToken.deleteMany({
      where: {
        userId,
        expiresAt: { lt: new Date() }, // Delete expired tokens
      },
    });
  }

  async verifyEmail(token: string): Promise<{ success: boolean; accessToken?: string; refreshToken?: string }> {
    console.log(token, 'verifyEmail');
    const tokenEntry = await this.prisma.verifyEmailToken.findUnique({
      where: { token },
    });

    if (!tokenEntry || tokenEntry.expiresAt < new Date()) {
      throw new NotFoundException('Invalid or expired token');
    }

    // Mark the user's email as verified
    const user = await this.prisma.user.update({
      where: { id: tokenEntry.userId },
      data: { emailVerified: new Date() }, // Set emailVerified to the current date and time
    });

    // Optionally, delete the token after successful verification
    await this.prisma.verifyEmailToken.delete({ where: { token } });

    // Generate access and refresh tokens for the user
    const { accessToken, refreshToken } = await this.authService.generateTokens({ userId: user.id });

    return { success: true, accessToken, refreshToken };
  }

  async findAll() {
    return this.prisma.user.findMany();
  }
}
