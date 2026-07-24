import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';

import { GetProjectDto } from '../project/dto/get-project.dto';
import { AuthGuard } from '../security/guards/auth.guard';
import { MemberGuard } from '../security/guards/member.guard';
import { CreateMemberDto } from './dto/create-member.dto';
import { GetMemberDto } from './dto/get-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberService } from './member.service';

@Controller('members')
@UseGuards(AuthGuard, MemberGuard)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMembers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{
    data: GetMemberDto[];
    meta: {
      page: number;
      item: number;
      total_pages: number;
      total_items: number;
    };
  }> {
    const def_page: number = 1;
    const def_limit: number = 10;

    page = (page ?? def_page > 0) ? (page ?? def_page) : def_page;
    limit = (limit ?? def_limit > 0) ? (limit ?? def_limit) : def_limit;

    const result = await this.memberService.getMembers(page, limit);
    const count = await this.memberService.getMemberCount();

    return {
      data: result,
      meta: {
        page: (page ?? def_page > 0) ? (page ?? def_page) : def_page,
        item: result.length,
        total_pages: Math.ceil(
          count / ((limit ?? def_limit > 0) ? (limit ?? def_limit) : def_limit),
        ),
        total_items: count,
      },
    };
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getMemberById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetMemberDto> {
    const result = await this.memberService.getMemberById(id);

    if (result) return result;

    throw new NotFoundException();
  }

  @Get('username/:username')
  @HttpCode(HttpStatus.OK)
  async getMemberByUsername(
    @Param('username') username: string,
  ): Promise<GetMemberDto> {
    const result = await this.memberService.getMemberByUsername(username);

    if (result) return result;

    throw new NotFoundException();
  }

  @Get('id/:id/projects')
  @HttpCode(HttpStatus.OK)
  async getMemberProjectsById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetProjectDto[]> {
    return await this.memberService.getMemberProjectsById(id);
  }

  @Get('username/:username/projects')
  @HttpCode(HttpStatus.OK)
  async getMemberProjectsByUsername(
    @Param('username') username: string,
  ): Promise<GetProjectDto[]> {
    return await this.memberService.getMemberProjectsByUsername(username);
  }

  @Put('id/:id')
  @HttpCode(HttpStatus.OK)
  async updateMemberById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateMemberDto,
  ): Promise<GetMemberDto> {
    return await this.memberService.updateMemberById(id, data);
  }

  @Put('username/:username')
  @HttpCode(HttpStatus.OK)
  async updateMemberByUsername(
    @Param('username') username: string,
    @Body() data: UpdateMemberDto,
  ): Promise<GetMemberDto> {
    return await this.memberService.updateMemberByUsername(username, data);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Member created.' })
  async createMember(@Body() data: CreateMemberDto): Promise<GetMemberDto> {
    return await this.memberService.createMember(data);
  }

  @Post('id/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Member restored.' })
  async restoreMember(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetMemberDto> {
    return await this.memberService.restoreMember(id);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMemberById(
    @Param('id', ParseUUIDPipe)
    id: string,
  ): Promise<GetMemberDto> {
    return await this.memberService.deleteMemberById(id);
  }

  @Delete('username/:username')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMemberByUsername(
    @Param('id')
    username: string,
  ): Promise<GetMemberDto> {
    return await this.memberService.deleteMemberByUsername(username);
  }
}
