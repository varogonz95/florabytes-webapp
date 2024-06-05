import { TestBed } from '@angular/core/testing';

import { PgotchiHttpClientService } from './pgotchi-http-client.service';

describe('PgotchiHttpClientService', () => {
  let service: PgotchiHttpClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PgotchiHttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
