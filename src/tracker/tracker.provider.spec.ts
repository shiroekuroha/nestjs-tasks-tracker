import { Test, TestingModule } from '@nestjs/testing';
import { Tracker } from './tracker.provider';

describe('Tracker', () => {
  let provider: Tracker;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Tracker],
    }).compile();

    provider = module.get<Tracker>(Tracker);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
