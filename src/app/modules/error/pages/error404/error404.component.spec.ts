import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AngularSvgIconModule, SvgIconRegistryService } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Error404Component } from './error404.component';

// Mock Router
const mockRouter = {
  navigate: jest.fn()
};

// Mock SvgIconRegistryService
const mockSvgIconRegistryService = {
  addSvg: jest.fn(),
  addSvgSet: jest.fn(),
  getSvgByName: jest.fn(),
  loadSvg: jest.fn()
};

describe('Error404Component', () => {
  let component: Error404Component;
  let fixture: ComponentFixture<Error404Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Error404Component, AngularSvgIconModule, ButtonComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SvgIconRegistryService, useValue: mockSvgIconRegistryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Error404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to dashboard when goToHomePage is called', () => {
    component.goToHomePage();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});