import { Model } from 'mongoose';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketFilterDto } from './dto/ticket-filter.dto';
export declare class SupportService {
    private ticketModel;
    constructor(ticketModel: Model<TicketDocument>);
    create(createTicketDto: CreateTicketDto): Promise<Ticket>;
    findAll(filter: TicketFilterDto): Promise<Ticket[]>;
    findOne(id: string): Promise<Ticket>;
    update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket>;
    remove(id: string): Promise<void>;
}
