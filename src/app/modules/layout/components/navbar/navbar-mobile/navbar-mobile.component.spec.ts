import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarMobileComponent } from './navbar-mobilecomponent';
import { MenuService } from '../../../services/menu.service';
import { Component } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { of } from 'rxjs';

// Mock MenuService
class MockMenuService {
  toggleSidebar = jest.fn();
  showMobileMenu: boolean = true; // Initialize directly
}

// Mock SvgIconComponent
@Component({
  selector: 'svg-icon',
  standalone: true,
  template: '<div>Mock SVG Icon</div>',
})
class MockSvgIconComponent {}

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
  snapshot = { params: {}, queryparams: {} };
  params = of({});
  queryParams = of({});
}

// Mock NavbarMobileMenuComponent
@Component({
  selector: 'app-navbar-mobile-menu',
  standalone: true,
  template: '<div>Mock Navbar Mobile Menu</div>',
})
class MockNavbarMobileMenuComponent {}

describe('NavbarMobileComponent', () => {
  let component: NavbarMobileComponent;
  let fixture: ComponentFixture<NavbarMobileComponent>;
  let mockMenuService: MockMenuService;

  beforeEach(async () => {
    mockMenuService = new MockMenuService();
    mockMenuService.showMobileMenu = true;

    await TestBed.configureTestingModule({
      imports: [
        NavbarMobileComponent,
        MockNavbarMobileMenuComponent,
        MockSvgIconComponent,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: MenuService, useValue: mockMenuService },
        { provide: SvgIconRegistryService, useClass: MockSvgIconRegistryService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarMobileComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize successfully', () => {
      expect(() => {
        component.ngOnInit();
      }).not.toThrow();
    });
  });

  describe('toggleMobileMenu', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should set showMobileMenu to false when called', () => {
      mockMenuService.showMobileMenu = true;
      
      component.toggleMobileMenu();
      
      expect(mockMenuService.showMobileMenu).toBe(false);
    });

    it('should always set showMobileMenu to false regardless of current state', () => {
      mockMenuService.showMobileMenu = false;
      
      component.toggleMobileMenu();
      
      expect(mockMenuService.showMobileMenu).toBe(false);
    });
  });

  describe('constructor', () => {
    it('should inject MenuService correctly', () => {
      expect(component.menuService).toBeDefined();
      expect(component.menuService).toBeInstanceOf(MockMenuService);
    });
  });

  describe('complete component coverage', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle complete component lifecycle without errors', () => {
      expect(() => {
        fixture.detectChanges();
        component.ngOnInit();
        component.toggleMobileMenu();
        fixture.destroy();
      }).not.toThrow();
    });

    it('should have all public methods working correctly', () => {
      // Test all public methods for 100% function coverage
      component.ngOnInit();
      
      mockMenuService.showMobileMenu = true;
      component.toggleMobileMenu();
      expect(mockMenuService.showMobileMenu).toBe(false);
    });
  });
});