import { Controller, Get, Param } from '@nestjs/common';
import { NoticesService } from './notices.service';

@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Get()
  list() {
    return this.noticesService.list();
  }

  @Get(':noticeId')
  detail(@Param('noticeId') noticeId: string) {
    return this.noticesService.detail(noticeId);
  }
}
