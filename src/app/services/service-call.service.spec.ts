import { TestBed } from '@angular/core/testing';

import { ServiceCallService } from './service-call.service';

describe('ServiceCallService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceCallService = TestBed.get(ServiceCallService);
    expect(service).toBeTruthy();
  });
});
