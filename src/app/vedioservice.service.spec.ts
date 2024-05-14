import { TestBed } from '@angular/core/testing';

import { VedioserviceService } from './vedioservice.service';

describe('VedioserviceService', () => {
  let service: VedioserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VedioserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
