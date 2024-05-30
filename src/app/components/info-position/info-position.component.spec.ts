import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPositionComponent } from './info-position.component';

describe('InfoPositionComponent', () => {
  let component: InfoPositionComponent;
  let fixture: ComponentFixture<InfoPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoPositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
