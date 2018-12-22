import { TestBed } from '@angular/core/testing';

import { ServicecallOutageService } from './servicecall-outage.service';

describe('ServicecallOutageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServicecallOutageService = TestBed.get(ServicecallOutageService);
    expect(service).toBeTruthy();
  });
});
