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
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { AnalyticsInterceptor } from '../analytics/analytics.interceptor';
import { GetProjectDto } from '../project/dto/get-project.dto';
import { AuthGuard } from '../security/guards/auth.guard';
import { CreateMemberDto } from './dto/create-member.dto';
import { GetMemberDto } from './dto/get-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberService } from './member.service';

@Controller('members')
@UseGuards(AuthGuard)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @UseInterceptors(AnalyticsInterceptor)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Members found.',
  })
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
    const result = await this.memberService.getMembers(
      (page ?? def_page > 0) ? (page ?? def_page) : def_page,
      (limit ?? def_limit > 0) ? (limit ?? def_limit) : def_limit,
    );
    const count = await this.memberService.getMemberCount();

    return {
      data: result,
      meta: {
        page: page ?? def_page,
        item: result.length,
        total_pages: Math.ceil(count / (limit ?? def_limit)),
        total_items: count,
      },
    };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Get('id/:id/projects')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Member found.' })
  @ApiNotFoundResponse({ description: 'Member not found.' })
  async getMemberProjects(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetProjectDto[] }> {
    return { data: await this.memberService.getMemberProjects(id) };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Member found.' })
  @ApiNotFoundResponse({ description: 'Member not found.' })
  async getMemberById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetMemberDto }> {
    const result = await this.memberService.getMemberById(id);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Get('username/:username')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Member found.' })
  @ApiNotFoundResponse({ description: 'Member not found.' })
  async getMemberByUsername(
    @Param('username') username: string,
  ): Promise<{ data: GetMemberDto }> {
    const result = await this.memberService.getMemberByUsername(username);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Put('id/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Member updated.' })
  async updateMemberById(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMemberDto,
  ): Promise<{ data: GetMemberDto }> {
    return { data: await this.memberService.updateMemberById(id, data) };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Put('username/:username')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Member updated.' })
  async updateMemberByUsername(
    @Param('username') username: string,
    @Body() data: UpdateMemberDto,
  ): Promise<{ data: GetMemberDto }> {
    return {
      data: await this.memberService.updateMemberByUsername(username, data),
    };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Member created.' })
  async createMember(
    @Body() data: CreateMemberDto,
  ): Promise<{ data: GetMemberDto }> {
    return { data: await this.memberService.createMember(data) };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Delete('id/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Member deleted.' })
  async deleteMemberById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetMemberDto }> {
    return { data: await this.memberService.deleteMemberById(id) };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Delete('username/:username')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Member deleted.' })
  async deleteMemberByUsername(
    @Param('username') username: string,
  ): Promise<{ data: GetMemberDto }> {
    return { data: await this.memberService.deleteMemberByUsername(username) };
  }
}
