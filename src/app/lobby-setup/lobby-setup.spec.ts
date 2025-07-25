import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbySetup } from './lobby-setup';

describe('LobbySetup', () => {
  let component: LobbySetup;
  let fixture: ComponentFixture<LobbySetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LobbySetup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LobbySetup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
