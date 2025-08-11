import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { MenuService } from '../../services/menu.service';
import { Component, Input } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { of } from 'rxjs';

// Mock MenuService with all required properties and methods
class MockMenuService {
  showMobileMenu = false;
  toggleSidebar = jest.fn();
}

// Mock SvgIconComponent
@Component({
  selector: 'svg-icon',
  standalone: true,
  template: '<div>Mock SVG Icon</div>',
})
class MockSvgIconComponent {
  @Input() name: string | undefined;
}

// Mock ProfileMenuComponent - simplified to avoid routing issues
@Component({
  selector: 'app-profile-menu',
  standalone: true,
  template: '<div>Mock Profile Menu</div>',
})
class MockProfileMenuComponent {}

// Mock NavbarMobileComponent
@Component({
  selector: 'app-navbar-mobile',
  standalone: true,
  template: '<div>Mock Navbar Mobile</div>',
})
class MockNavbarMobileComponent {}

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

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockMenuService: MockMenuService;

  beforeEach(async () => {
    mockMenuService = new MockMenuService();

    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        MockSvgIconComponent,
        MockProfileMenuComponent,
        MockNavbarMobileComponent,
        NoopAnimationsModule,
        RouterTestingModule // Add RouterTestingModule for routing support
      ],
      providers: [
        { provide: MenuService, useValue: mockMenuService },
        { provide: SvgIconRegistryService, useClass: MockSvgIconRegistryService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute } // Provide ActivatedRoute
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
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
      // Test that ngOnInit doesn't throw errors
      expect(() => {
        component.ngOnInit();
      }).not.toThrow();
    });
  });

  describe('toggleMobileMenu', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should set showMobileMenu to true when called', () => {
      // Ensure it starts as false
      mockMenuService.showMobileMenu = false;
      
      component.toggleMobileMenu();
      
      expect(mockMenuService.showMobileMenu).toBe(true);
    });

    it('should always set showMobileMenu to true regardless of current state', () => {
      // Test when it's already true
      mockMenuService.showMobileMenu = true;
      
      component.toggleMobileMenu();
      
      expect(mockMenuService.showMobileMenu).toBe(true);
    });
  });

  describe('toggleSidebar', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call toggleSidebar on MenuService', () => {
      component.toggleSidebar();
      
      expect(mockMenuService.toggleSidebar).toHaveBeenCalled();
      expect(mockMenuService.toggleSidebar).toHaveBeenCalledTimes(1);
    });

    it('should call toggleSidebar multiple times when invoked multiple times', () => {
      component.toggleSidebar();
      component.toggleSidebar();
      component.toggleSidebar();
      
      expect(mockMenuService.toggleSidebar).toHaveBeenCalledTimes(3);
    });
  });

  describe('menuService integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have menuService accessible as public property', () => {
      expect(component.menuService).toBe(mockMenuService);
      expect(component.menuService).toBeDefined();
    });

    it('should interact correctly with menuService', () => {
      // Test the complete flow
      mockMenuService.showMobileMenu = false;
      
      component.toggleMobileMenu();
      expect(mockMenuService.showMobileMenu).toBe(true);
      
      component.toggleSidebar();
      expect(mockMenuService.toggleSidebar).toHaveBeenCalled();
    });
  });

  describe('component lifecycle', () => {
    it('should handle complete component lifecycle without errors', () => {
      expect(() => {
        fixture.detectChanges(); // ngOnInit
        component.toggleMobileMenu();
        component.toggleSidebar();
        fixture.destroy(); // ngOnDestroy if implemented
      }).not.toThrow();
    });
  });

  describe('constructor', () => {
    it('should inject MenuService correctly', () => {
      expect(component.menuService).toBeDefined();
      expect(component.menuService).toBeInstanceOf(MockMenuService);
    });
  });

  describe('component methods coverage', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call ngOnInit explicitly for coverage', () => {
      // Call ngOnInit explicitly to ensure 100% function coverage
      component.ngOnInit();
      // ngOnInit is empty but this ensures it's covered
      expect(component).toBeTruthy();
    });

    it('should test toggleMobileMenu behavior thoroughly', () => {
      // Test initial state
      expect(mockMenuService.showMobileMenu).toBe(false);
      
      // Call method
      component.toggleMobileMenu();
      
      // Verify result
      expect(mockMenuService.showMobileMenu).toBe(true);
      
      // Call again to ensure consistent behavior
      component.toggleMobileMenu();
      expect(mockMenuService.showMobileMenu).toBe(true);
    });

    it('should test toggleSidebar method thoroughly', () => {
      // Reset mock
      mockMenuService.toggleSidebar.mockClear();
      
      // Call method
      component.toggleSidebar();
      
      // Verify service method was called
      expect(mockMenuService.toggleSidebar).toHaveBeenCalledTimes(1);
    });
  });
});