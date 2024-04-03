import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculadoraGestionComponent } from './calculadora-gestion.component';

describe('CalculadoraGestionComponent', () => {
  let component: CalculadoraGestionComponent;
  let fixture: ComponentFixture<CalculadoraGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculadoraGestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalculadoraGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
