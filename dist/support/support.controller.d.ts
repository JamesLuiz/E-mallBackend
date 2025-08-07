import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketFilterDto } from './dto/ticket-filter.dto';
export declare class SupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
    findAll(filter: TicketFilterDto): Promise<import("./schemas/ticket.schema").Ticket[]>;
    findOne(id: string): Promise<import("./schemas/ticket.schema").Ticket>;
    create(createTicketDto: CreateTicketDto): Promise<import("./schemas/ticket.schema").Ticket>;
    update(id: string, updateTicketDto: UpdateTicketDto): Promise<import("./schemas/ticket.schema").Ticket>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
