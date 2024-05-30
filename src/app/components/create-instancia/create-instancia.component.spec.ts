import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInstanciaComponent } from './create-instancia.component';

describe('CreateInstanciaComponent', () => {
  let component: CreateInstanciaComponent;
  let fixture: ComponentFixture<CreateInstanciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateInstanciaComponent]
    });
    fixture = TestBed.createComponent(CreateInstanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
