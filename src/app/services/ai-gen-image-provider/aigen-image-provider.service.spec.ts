import { TestBed } from '@angular/core/testing';

import { AIGenImageProviderService } from './aigen-image-provider.service';

describe('AIGenImageProviderService', () => {
  let service: AIGenImageProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AIGenImageProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
