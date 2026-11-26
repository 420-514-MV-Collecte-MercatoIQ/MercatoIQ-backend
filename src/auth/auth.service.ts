import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './auth.types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly saltRounds: number;
  // Valid bcrypt hash used when the email is unknown, so login always
  // spends the same time whether or not the account exists.
  private dummyHash = '';

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    const rounds = Number(configService.get('BCRYPT_SALT_ROUNDS'));
    this.saltRounds = Number.isInteger(rounds) && rounds >= 4 ? rounds : 10;
  }

  async onModuleInit() {
    this.dummyHash = await bcrypt.hash(
      randomBytes(16).toString('hex'),
      this.saltRounds,
    );
  }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();

    if (await this.usersService.findByEmail(email)) {
      throw new ConflictException('Email is already in use');
    }

    const password_hash = await bcrypt.hash(dto.password, this.saltRounds);

    const user = await this.usersService.create({
      email,
      password_hash,
      role: 'user', // public signups are never admin
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(email);

    // One bcrypt compare in every case, real hash or dummy
    const isValid = await bcrypt.compare(
      dto.password,
      user?.password_hash ?? this.dummyHash,
    );

    if (!user || !isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  private async buildAuthResponse(user: UserDocument) {
    const id = user._id.toString();
    const payload: JwtPayload = { sub: id, email: user.email, role: user.role };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: { id, email: user.email, role: user.role },
    };
  }
}