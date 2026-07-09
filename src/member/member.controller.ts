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
  ApiProperty,
} from '@nestjs/swagger';

import { AnalyticsInterceptor } from '../analytics/analytics.interceptor';
import { AuthGuard } from '../security/guards/auth.guard';
import { CreateMemberDto } from './dto/create-member.dto';
import { GetMemberDto } from './dto/get-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberService } from './member.service';

export class DefaultReturnResponse {
  @ApiProperty()
  data!: GetMemberDto | GetMemberDto[];

  @ApiProperty()
  meta?: any | null;
}

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
      page ?? def_page,
      limit ?? def_limit,
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
  @ApiNotFoundResponse({ description: 'Member not found.' })
  async updateMemberById(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMemberDto,
  ): Promise<{ data: GetMemberDto }> {
    const result = await this.memberService.updateMemberById(id, data);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Put('username/:username')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Member updated.' })
  @ApiNotFoundResponse({ description: 'Member not found.' })
  async updateMemberByUsername(
    @Param('username') username: string,
    @Body() data: UpdateMemberDto,
  ): Promise<{ data: GetMemberDto }> {
    const result = await this.memberService.updateMemberByUsername(
      username,
      data,
    );

    if (result) return { data: result };

    throw new NotFoundException();
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
  @ApiNotFoundResponse({ description: 'Member not found.' })
  async deleteMemberById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetMemberDto }> {
    const result = await this.memberService.deleteMemberById(id);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Delete('username/:username')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Member deleted.' })
  @ApiNotFoundResponse({ description: 'Member not found.' })
  async deleteMemberByUsername(
    @Param('username') username: string,
  ): Promise<{ data: GetMemberDto }> {
    const result = await this.memberService.deleteMemberByUsername(username);

    if (result) return { data: result };

    throw new NotFoundException();
  }
}
