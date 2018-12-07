import { TestBed } from '@angular/core/testing';

import { DuedateService } from './duedate.service';

describe('DuedateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DuedateService = TestBed.get(DuedateService);
    expect(service).toBeTruthy();
  });
});
