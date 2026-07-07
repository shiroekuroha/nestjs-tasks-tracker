import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/guards/auth.guard';
import { GetUserDto } from './dto/get-user.dto';
import { plainToInstance } from 'class-transformer';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('details')
  @UseGuards(AuthGuard)
  getUserDetails(@Request() req: Request): GetUserDto {
    return plainToInstance(
      GetUserDto,
      this.usersService.find(req['user'].username),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @Post()
  @ApiOperation({ summary: "Create new user using Body's JSON" })
  createUser(@Body() createUserDto: CreateUserDto) {
    return (
      plainToInstance(GetUserDto, this.usersService.create(createUserDto)),
      {
        excludeExtraneousValues: true,
      }
    );
    return;
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete existing user using Param's id" })
  deleteUser(@Param('id') id: string) {
    return (
      plainToInstance(GetUserDto, this.usersService.delete(id)),
      {
        excludeExtraneousValues: true,
      }
    );
  }
}
