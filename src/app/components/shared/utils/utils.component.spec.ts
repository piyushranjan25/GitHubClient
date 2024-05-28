import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtilsComponent } from './utils.component';

describe('UtilsComponent', () => {
  let component: UtilsComponent;
  let fixture: ComponentFixture<UtilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial values', () => {
    expect(component.showLoading).toBe(true);
    expect(component.userToken).toBe('');
    expect(component.itemsPerPage).toBe(10);
    expect(component.dataTouched).toBe(false);
  });

  it('should return an empty string for getUserToken', () => {
    expect(component.getUserToken()).toBe('');
  });

  it('should set showLoading to true when startLoader is called', () => {
    component.startLoader();
    expect(component.showLoading).toBe(true);
  });

  it('should set showLoading to false when stopLoader is called', () => {
    component.stopLoader();
    expect(component.showLoading).toBe(false);
  });
});


