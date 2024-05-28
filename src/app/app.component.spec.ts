
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { UtilsComponent } from './components/shared/utils/utils.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

// Mock Header Component
@Component({
  selector: 'app-header',
  template: '<div>Mock Header</div>'
})
class MockHeaderComponent {}

// Mock HomePage Component
@Component({
  selector: 'app-home-page',
  template: '<div>Mock Home Page</div>'
})
class MockHomePageComponent {}

// Mock Utils Component
class MockUtilsComponent {
  showLoading: boolean = true;
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let utils: MockUtilsComponent;
  let snackBar: MatSnackBar;
  let cdRef: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockHeaderComponent,
        MockHomePageComponent
      ],
      providers: [
        { provide: UtilsComponent, useClass: MockUtilsComponent },
        MatSnackBar,
        ChangeDetectorRef
      ],
      imports: [MatSnackBarModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    utils = TestBed.inject(UtilsComponent);
    snackBar = TestBed.inject(MatSnackBar);
    cdRef = TestBed.inject(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the skeleton loader when utils.showLoading is true', () => {
    utils.showLoading = true;
    fixture.detectChanges();
    const loadingElement = fixture.debugElement.query(By.css('.skeletonLoader'));
    expect(loadingElement).toBeTruthy();
  });

  it('should not display the skeleton loader when utils.showLoading is false', () => {
    utils.showLoading = false;
    fixture.detectChanges();
    const loadingElement = fixture.debugElement.query(By.css('.skeletonLoader'));
    expect(loadingElement).toBeNull();
  });

  it('should contain the app-header component', () => {
    const headerElement = fixture.debugElement.query(By.css('app-header'));
    expect(headerElement).toBeTruthy();
  });

  it('should contain the app-home-page component', () => {
    const homePageElement = fixture.debugElement.query(By.css('app-home-page'));
    expect(homePageElement).toBeTruthy();
  });

  it('should dismiss the snackbar on click', () => {
    spyOn(snackBar, 'dismiss');
    const event = new Event('click');
    component.handleKeyDown(event as any);
    expect(snackBar.dismiss).toHaveBeenCalled();
  });
});



