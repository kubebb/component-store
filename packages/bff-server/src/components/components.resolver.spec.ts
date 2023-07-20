import { Test, TestingModule } from '@nestjs/testing';
import { ComponentsResolver } from './components.resolver';

describe('ComponentsResolver', () => {
  let resolver: ComponentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComponentsResolver],
    }).compile();

    resolver = module.get<ComponentsResolver>(ComponentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
