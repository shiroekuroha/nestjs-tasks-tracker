import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/guards/auth.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('details')
  @UseGuards(AuthGuard)
  getUserDetails(@Request() req: Request) {
    return this.usersService.find(req['user'].username);
  }

  @Post()
  @ApiOperation({ summary: "Create new user using Body's JSON" })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete existing user using Param's id" })
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}