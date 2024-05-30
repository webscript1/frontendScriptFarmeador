import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanciasAutoComponent } from './instancias-auto.component';

describe('InstanciasAutoComponent', () => {
  let component: InstanciasAutoComponent;
  let fixture: ComponentFixture<InstanciasAutoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstanciasAutoComponent]
    });
    fixture = TestBed.createComponent(InstanciasAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
