import { Test, TestingModule } from '@nestjs/testing';
import { AuthHandleService } from './auth-handle.service';

describe('AuthHandleService', () => {
  let service: AuthHandleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthHandleService],
    }).compile();

    service = module.get<AuthHandleService>(AuthHandleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
