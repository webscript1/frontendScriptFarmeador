import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotInterfazComponent } from './bot-interfaz.component';

describe('BotInterfazComponent', () => {
  let component: BotInterfazComponent;
  let fixture: ComponentFixture<BotInterfazComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotInterfazComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BotInterfazComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
