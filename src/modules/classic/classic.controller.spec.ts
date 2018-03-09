import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { ClassicController } from './classic.controller';
import { expect } from 'chai';

describe('ClassicController', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      controllers: [
        ClassicController
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let controller: ClassicController;
  beforeEach(() => {
    controller = module.get(ClassicController);
  });

  it('should exist', () => {
    expect(controller).to.exist;
  });
});
