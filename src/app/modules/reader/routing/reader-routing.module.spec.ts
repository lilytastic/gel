import { ReaderRoutingModule } from './reader-routing.module';

describe('ReaderRoutingModule', () => {
  let readerRoutingModule: ReaderRoutingModule;

  beforeEach(() => {
    readerRoutingModule = new ReaderRoutingModule();
  });

  it('should create an instance', () => {
    expect(readerRoutingModule).toBeTruthy();
  });
});
