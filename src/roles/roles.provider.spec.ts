import { Test, TestingModule } from '@nestjs/testing';
import { Roles } from './roles.provider';

describe('Roles', () => {
  let provider: Roles;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Roles],
    }).compile();

    provider = module.get<Roles>(Roles);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
