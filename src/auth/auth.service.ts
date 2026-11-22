import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { UserDocument } from "../users/schemas/user.schema";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();

    if (await this.usersService.findByEmail(email)) {
      throw new ConflictException("Email is already in use");
    }

    const saltRounds = Number(
      this.configService.get<string>("BCRYPT_SALT_ROUNDS", "10"),
    );

    const password_hash = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.usersService.create({
      email: email,
      password_hash: password_hash,
      role: "user",
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      const isValidPassword = await bcrypt.compare(dto.password, "dummyHash");
      throw new UnauthorizedException("Invalid Credentials");
    }

    const isValidPassword = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException("Invalid Credentials");
    }

    return this.buildAuthResponse(user);
  }

  private async buildAuthResponse(user: UserDocument) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    };
  }
}
