import { TestBed } from '@angular/core/testing';

import { OutageCategoryService } from './outage-category.service';

describe('OutageCategoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OutageCategoryService = TestBed.get(OutageCategoryService);
    expect(service).toBeTruthy();
  });
});
