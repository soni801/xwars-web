import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGameComponent } from './pre-game.component';

describe('PreGameComponent', () => {
  let component: PreGameComponent;
  let fixture: ComponentFixture<PreGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
