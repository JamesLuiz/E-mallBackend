import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({ description: 'User message to the AI assistant' })
  @IsString()
  message: string;

  @ApiProperty({ required: false, description: 'Existing chat session ID' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({ required: false, description: 'Message context or metadata' })
  @IsOptional()
  context?: Record<string, any>;
}