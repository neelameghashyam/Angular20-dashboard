import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarMobileMenuComponent } from './navbar-mobile-menu.component';
import { MenuService } from '../../../../services/menu.service';
import { Component } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { of } from 'rxjs';

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
  snapshot = { params: {}, queryParams: {} };
  params = of({});
  queryParams = of({});
}

// Mock SubMenuItem interface
const mockSubMenuItem = {
  id: 1,
  label: 'Test Menu',
  icon: 'test-icon',
  expanded: false
};

// Mock NavbarMobileSubmenuComponent
@Component({
  selector: 'app-navbar-mobile-submenu',
  standalone: true,
  template: '<div>Mock Navbar Mobile Submenu</div>',
})
class MockNavbarMobileSubmenuComponent {}

describe('NavbarMobileMenuComponent', () => {
  let component: NavbarMobileMenuComponent;
  let fixture: ComponentFixture<NavbarMobileMenuComponent>;
  let mockMenuService: any;

  beforeEach(async () => {
    mockMenuService = {
      showMobileMenu: true,
      toggleMenu: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        NavbarMobileMenuComponent,
        MockNavbarMobileSubmenuComponent,
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

    fixture = TestBed.createComponent(NavbarMobileMenuComponent);
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

  describe('toggleMenu', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call toggleMenu on MenuService with correct parameter', () => {
      component.toggleMenu(mockSubMenuItem);
      
      expect(mockMenuService.toggleMenu).toHaveBeenCalledWith(mockSubMenuItem);
      expect(mockMenuService.toggleMenu).toHaveBeenCalledTimes(1);
    });

    it('should call toggleMenu multiple times with different parameters', () => {
      const mockSubMenuItem2 = { ...mockSubMenuItem, id: 2, label: 'Test Menu 2' };
      
      component.toggleMenu(mockSubMenuItem);
      component.toggleMenu(mockSubMenuItem2);
      
      expect(mockMenuService.toggleMenu).toHaveBeenCalledTimes(2);
      expect(mockMenuService.toggleMenu).toHaveBeenNthCalledWith(1, mockSubMenuItem);
      expect(mockMenuService.toggleMenu).toHaveBeenNthCalledWith(2, mockSubMenuItem2);
    });
  });

  describe('closeMenu', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should set showMobileMenu to false when called', () => {
      mockMenuService.showMobileMenu = true;
      
      component.closeMenu();
      
      expect(mockMenuService.showMobileMenu).toBe(false);
    });

    it('should always set showMobileMenu to false regardless of current state', () => {
      mockMenuService.showMobileMenu = false;
      
      component.closeMenu();
      
      expect(mockMenuService.showMobileMenu).toBe(false);
    });
  });

  describe('constructor', () => {
    it('should inject MenuService correctly', () => {
      expect(component.menuService).toBeDefined();
      expect(component.menuService).toBe(mockMenuService);
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
        component.toggleMenu(mockSubMenuItem);
        component.closeMenu();
        fixture.destroy();
      }).not.toThrow();
    });

    it('should have all public methods working correctly', () => {
      // Test all public methods for 100% function coverage
      component.ngOnInit();
      
      component.toggleMenu(mockSubMenuItem);
      expect(mockMenuService.toggleMenu).toHaveBeenCalledWith(mockSubMenuItem);
      
      component.closeMenu();
      expect(mockMenuService.showMobileMenu).toBe(false);
    });
  });
});