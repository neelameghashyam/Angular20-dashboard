import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarMenuComponent } from './sidebar-menu.component';
import { MenuService } from '../../../services/menu.service';
import { Component } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { of } from 'rxjs';

// Mock SvgIconComponent
@Component({
  selector: 'svg-icon',
  standalone: true,
  template: 'Mock SVG Icon',
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
  label: 'Test Sidebar Menu',
  icon: 'test-icon',
  expanded: false
};

// Mock SidebarSubmenuComponent
@Component({
  selector: 'app-sidebar-submenu',
  standalone: true,
  template: '<div>Mock Sidebar Submenu</div>',
})
class MockSidebarSubmenuComponent {}

describe('SidebarMenuComponent', () => {
  let component: SidebarMenuComponent;
  let fixture: ComponentFixture<SidebarMenuComponent>;
  let mockMenuService: any;

  beforeEach(async () => {
    mockMenuService = {
      toggleMenu: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        SidebarMenuComponent,
        MockSidebarSubmenuComponent,
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

    fixture = TestBed.createComponent(SidebarMenuComponent);
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
      const mockSubMenuItem2 = { ...mockSubMenuItem, id: 2, label: 'Test Sidebar Menu 2' };
      
      component.toggleMenu(mockSubMenuItem);
      component.toggleMenu(mockSubMenuItem2);
      
      expect(mockMenuService.toggleMenu).toHaveBeenCalledTimes(2);
      expect(mockMenuService.toggleMenu).toHaveBeenNthCalledWith(1, mockSubMenuItem);
      expect(mockMenuService.toggleMenu).toHaveBeenNthCalledWith(2, mockSubMenuItem2);
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
        fixture.destroy();
      }).not.toThrow();
    });

    it('should have all public methods working correctly', () => {
      // Test all public methods for 100% function coverage
      component.ngOnInit();
      
      component.toggleMenu(mockSubMenuItem);
      expect(mockMenuService.toggleMenu).toHaveBeenCalledWith(mockSubMenuItem);
    });
  });
});