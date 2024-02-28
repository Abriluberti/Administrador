import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SplahPage } from './splah.page';

describe('SplahPage', () => {
  let component: SplahPage;
  let fixture: ComponentFixture<SplahPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(SplahPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
