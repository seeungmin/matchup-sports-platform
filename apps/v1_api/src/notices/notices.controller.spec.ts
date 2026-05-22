import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';

describe('NoticesController', () => {
  const noticesService = {
    list: jest.fn(),
    detail: jest.fn(),
  };

  let controller: NoticesController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [NoticesController],
      providers: [{ provide: NoticesService, useValue: noticesService }],
    }).compile();

    controller = moduleRef.get(NoticesController);
  });

  it('returns published public notices', async () => {
    noticesService.list.mockResolvedValue({
      notices: [{ noticeId: 'notice-1', title: '공지', body: '내용' }],
      pageInfo: { hasNextPage: false, nextCursor: null },
    });

    await expect(controller.list({})).resolves.toEqual({
      notices: [{ noticeId: 'notice-1', title: '공지', body: '내용' }],
      pageInfo: { hasNextPage: false, nextCursor: null },
    });
  });

  it('returns a notice detail', async () => {
    noticesService.detail.mockResolvedValue({
      notice: { noticeId: 'notice-1', title: '공지', body: '내용' },
    });

    await expect(controller.detail('notice-1')).resolves.toEqual({
      notice: { noticeId: 'notice-1', title: '공지', body: '내용' },
    });
  });

  it('passes through not found errors', async () => {
    noticesService.detail.mockRejectedValue(new NotFoundException('Notice not found'));

    await expect(controller.detail('missing')).rejects.toBeInstanceOf(NotFoundException);
  });
});
