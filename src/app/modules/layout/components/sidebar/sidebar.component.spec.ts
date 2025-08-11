import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';
import { MenuService } from '../../services/menu.service';
import { Component } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { of } from 'rxjs';

// Mock MenuService
class MockMenuService {
  toggleSidebar = jest.fn();
}

// Mock SidebarMenuComponent
@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  template: '<div>Mock Sidebar Menu</div>',
})
class MockSidebarMenuComponent {}

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

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockMenuService: MockMenuService;

  beforeEach(async () => {
    mockMenuService = new MockMenuService();

    await TestBed.configureTestingModule({
      imports: [
        SidebarComponent,
        MockSidebarMenuComponent,
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

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have appJson property with package.json data', () => {
    expect(component.appJson).toBeDefined();
    expect(typeof component.appJson).toBe('object');
  });

  describe('ngOnInit', () => {
    it('should initialize successfully', () => {
      expect(() => {
        component.ngOnInit();
      }).not.toThrow();
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
        component.toggleSidebar();
        fixture.destroy();
      }).not.toThrow();
    });

    it('should have all public methods working correctly', () => {
      // Test all public methods for 100% function coverage
      component.ngOnInit();
      component.toggleSidebar();
      
      expect(mockMenuService.toggleSidebar).toHaveBeenCalled();
      expect(component.appJson).toBeDefined();
    });
  });
});