import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiraChatbot } from './aira-chatbot';

describe('AiraChatbot', () => {
  let component: AiraChatbot;
  let fixture: ComponentFixture<AiraChatbot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiraChatbot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiraChatbot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
