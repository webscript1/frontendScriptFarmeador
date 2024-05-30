import { TestBed } from '@angular/core/testing';

import { SuperTrendService } from './super-trend.service';

describe('SuperTrendService', () => {
  let service: SuperTrendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperTrendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
