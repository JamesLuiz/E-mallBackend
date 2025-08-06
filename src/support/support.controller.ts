import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketFilterDto } from './dto/ticket-filter.dto';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('tickets')
  async findAll(@Query() filter: TicketFilterDto) {
    return this.supportService.findAll(filter);
  }

  @Get('tickets/:id')
  async findOne(@Param('id') id: string) {
    return this.supportService.findOne(id);
  }

  @Post('tickets')
  async create(@Body() createTicketDto: CreateTicketDto) {
    return this.supportService.create(createTicketDto);
  }

  @Put('tickets/:id')
  async update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.supportService.update(id, updateTicketDto);
  }

  @Delete('tickets/:id')
  async remove(@Param('id') id: string) {
    await this.supportService.remove(id);
    return { message: 'Ticket deleted' };
  }
}
