import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BugComponent } from './bugs.component';

describe('BugComponent', () => {
  let component: BugComponent;
  let fixture: ComponentFixture<BugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugComponent], // Changed from 'declarations' to 'imports' for standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(BugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
