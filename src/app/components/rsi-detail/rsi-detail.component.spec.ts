import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsiDetailComponent } from './rsi-detail.component';

describe('RsiDetailComponent', () => {
  let component: RsiDetailComponent;
  let fixture: ComponentFixture<RsiDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RsiDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RsiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
