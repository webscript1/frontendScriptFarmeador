import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedSymbolsComponent } from './activated-symbols.component';

describe('ActivatedSymbolsComponent', () => {
  let component: ActivatedSymbolsComponent;
  let fixture: ComponentFixture<ActivatedSymbolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivatedSymbolsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivatedSymbolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
