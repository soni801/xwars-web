import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostGameComponent } from './post-game.component';

describe('PostGameComponent', () => {
  let component: PostGameComponent;
  let fixture: ComponentFixture<PostGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
