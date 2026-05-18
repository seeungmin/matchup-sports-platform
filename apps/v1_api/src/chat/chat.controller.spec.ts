import { Test } from '@nestjs/testing';
import { V1AuthGuard } from '../auth/v1-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

const user = {
  id: 'user-1',
  email: 'host@teameet.v1',
  accountStatus: 'active' as const,
  onboardingStatus: 'completed' as const,
};

describe('ChatController', () => {
  const chatService = {
    rooms: jest.fn(),
    resolve: jest.fn(),
    detail: jest.fn(),
    messages: jest.fn(),
    sendMessage: jest.fn(),
    updateMe: jest.fn(),
    leave: jest.fn(),
  };

  let controller: ChatController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        { provide: ChatService, useValue: chatService },
        { provide: PrismaService, useValue: {} },
        { provide: V1AuthGuard, useValue: { canActivate: jest.fn(() => true) } },
      ],
    }).compile();
    controller = moduleRef.get(ChatController);
  });

  it('returns rooms', async () => {
    chatService.rooms.mockResolvedValue({ items: [{ roomId: 'room-1' }] });
    await expect(controller.rooms(user, { roomType: 'match' })).resolves.toEqual({
      items: [{ roomId: 'room-1' }],
    });
  });

  it('resolves a room', async () => {
    chatService.resolve.mockResolvedValue({ roomId: 'room-1', created: false });
    await expect(controller.resolve(user, { targetType: 'match', targetId: 'match-1' })).resolves.toEqual({
      roomId: 'room-1',
      created: false,
    });
  });

  it('returns room detail', async () => {
    chatService.detail.mockResolvedValue({ roomId: 'room-1', title: '채팅' });
    await expect(controller.detail(user, 'room-1')).resolves.toEqual({ roomId: 'room-1', title: '채팅' });
  });

  it('returns messages', async () => {
    chatService.messages.mockResolvedValue({ items: [{ messageId: 'message-1' }] });
    await expect(controller.messages(user, 'room-1', { limit: 30 })).resolves.toEqual({
      items: [{ messageId: 'message-1' }],
    });
  });

  it('sends message', async () => {
    chatService.sendMessage.mockResolvedValue({ messageId: 'message-1', status: 'sent' });
    await expect(controller.sendMessage(user, 'room-1', { content: '안녕하세요' })).resolves.toEqual({
      messageId: 'message-1',
      status: 'sent',
    });
  });

  it('updates my room settings', async () => {
    chatService.updateMe.mockResolvedValue({ roomId: 'room-1', pinned: true });
    await expect(controller.updateMe(user, 'room-1', { pinned: true })).resolves.toEqual({
      roomId: 'room-1',
      pinned: true,
    });
  });

  it('leaves room', async () => {
    chatService.leave.mockResolvedValue({ roomId: 'room-1', status: 'left' });
    await expect(controller.leave(user, 'room-1', { reason: '정리' })).resolves.toEqual({
      roomId: 'room-1',
      status: 'left',
    });
  });
});
