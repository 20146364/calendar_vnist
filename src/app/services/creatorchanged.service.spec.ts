import { TestBed } from '@angular/core/testing';

import { CreatorchangedService } from './creatorchanged.service';

describe('CreatorchangedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreatorchangedService = TestBed.get(CreatorchangedService);
    expect(service).toBeTruthy();
  });
});
