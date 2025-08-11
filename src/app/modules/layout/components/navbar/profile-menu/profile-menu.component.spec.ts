import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgClass } from '@angular/common';
import { AngularSvgIconModule, SvgIconRegistryService } from 'angular-svg-icon';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ProfileMenuComponent } from './profile-menu.component';
import { ThemeService } from '../../../../../core/services/theme.service';
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive';

// Mock ThemeService
class MockThemeService {
  theme = signal({ mode: 'light', color: '#e11d48', direction: 'ltr' });
  isDark = false;
}

// Mock SvgIconRegistryService
class MockSvgIconRegistryService {
  registerIcon() {}
  getIcon() {}
  loadSvg() {
    return of('<svg></svg>');
  }
}

// Mock ActivatedRoute
class MockActivatedRoute {
  snapshot = { params: {}, queryParams: {} };
  params = of({});
  queryParams = of({});
}

// Mock ClickOutsideDirective
import { Directive, EventEmitter, Output } from '@angular/core';
@Directive({
  selector: '[clickOutside]',
  standalone: true,
})
class MockClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();
}

describe('ProfileMenuComponent', () => {
  let component: ProfileMenuComponent;
  let fixture: ComponentFixture<ProfileMenuComponent>;
  let mockThemeService: MockThemeService;

  beforeEach(async () => {
    mockThemeService = new MockThemeService();

    await TestBed.configureTestingModule({
      imports: [
        ProfileMenuComponent,
        NoopAnimationsModule,
        RouterTestingModule,
        NgClass,
        AngularSvgIconModule,
        MockClickOutsideDirective,
      ],
      providers: [
        { provide: ThemeService, useValue: mockThemeService },
        { provide: SvgIconRegistryService, useClass: MockSvgIconRegistryService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should inject ThemeService correctly', () => {
      expect(component.themeService).toBeDefined();
      expect(component.themeService).toBeInstanceOf(MockThemeService);
    });
  });

  describe('ngOnInit', () => {
    it('should initialize successfully', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('toggleMenu', () => {
    it('should toggle isOpen from false to true', () => {
      component.isOpen = false;
      component.toggleMenu();
      expect(component.isOpen).toBe(true);
    });

    it('should toggle isOpen from true to false', () => {
      component.isOpen = true;
      component.toggleMenu();
      expect(component.isOpen).toBe(false);
    });
  });

  describe('toggleThemeMode', () => {
    it('should toggle theme mode to dark when isDark is false', () => {
      const updateSpy = jest.spyOn(mockThemeService.theme, 'update');
      mockThemeService.isDark = false;
      component.toggleThemeMode();
      expect(updateSpy).toHaveBeenCalledWith(expect.any(Function));
      expect(mockThemeService.theme().mode).toBe('dark');
    });

    it('should toggle theme mode to light when isDark is true', () => {
      const updateSpy = jest.spyOn(mockThemeService.theme, 'update');
      mockThemeService.isDark = true;
      component.toggleThemeMode();
      expect(updateSpy).toHaveBeenCalledWith(expect.any(Function));
      expect(mockThemeService.theme().mode).toBe('light');
    });
  });

  describe('toggleThemeColor', () => {
    it('should update theme color', () => {
      const updateSpy = jest.spyOn(mockThemeService.theme, 'update');
      const color = '#e11d48';
      component.toggleThemeColor(color);
      expect(updateSpy).toHaveBeenCalledWith(expect.any(Function));
      expect(mockThemeService.theme().color).toBe(color);
    });
  });

  describe('setDirection', () => {
    it('should update theme direction to ltr', () => {
      const updateSpy = jest.spyOn(mockThemeService.theme, 'update');
      component.setDirection('ltr');
      expect(updateSpy).toHaveBeenCalledWith(expect.any(Function));
      expect(mockThemeService.theme().direction).toBe('ltr');
    });

    it('should update theme direction to rtl', () => {
      const updateSpy = jest.spyOn(mockThemeService.theme, 'update');
      component.setDirection('rtl');
      expect(updateSpy).toHaveBeenCalledWith(expect.any(Function));
      expect(mockThemeService.theme().direction).toBe('rtl');
    });
  });

  describe('component lifecycle and coverage', () => {
   

    it('should cover all public properties and methods', () => {
      expect(component.profileMenu).toBeDefined();
      expect(component.profileMenu.length).toBe(3);
      expect(component.themeColors).toBeDefined();
      expect(component.themeColors.length).toBe(7);
      expect(component.themeMode).toEqual(['light', 'dark']);
      expect(component.themeDirection).toEqual(['ltr', 'rtl']);

      component.toggleMenu();
      expect(component.isOpen).toBe(true);

      const updateSpy = jest.spyOn(mockThemeService.theme, 'update');
      component.toggleThemeMode();
      expect(updateSpy).toHaveBeenCalled();
      expect(mockThemeService.theme().mode).toBe('dark');

      component.toggleThemeColor('#e11d48');
      expect(updateSpy).toHaveBeenCalled();
      expect(mockThemeService.theme().color).toBe('#e11d48');

      component.setDirection('rtl');
      expect(updateSpy).toHaveBeenCalled();
      expect(mockThemeService.theme().direction).toBe('rtl');
    });
  });
});