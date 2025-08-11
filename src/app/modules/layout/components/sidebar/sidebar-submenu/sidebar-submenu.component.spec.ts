import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgClass, NgFor, NgTemplateOutlet } from '@angular/common';
import { AngularSvgIconModule, SvgIconRegistryService } from 'angular-svg-icon';
import { of } from 'rxjs';
import { SidebarSubmenuComponent } from './sidebar-submenu.component';
import { MenuService } from '../../../services/menu.service';
import { SubMenuItem } from '../../../../../core/models/menu.model';

// Mock MenuService
class MockMenuService {
  toggleSubMenu = jest.fn();
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

describe('SidebarSubmenuComponent', () => {
  let component: SidebarSubmenuComponent;
  let fixture: ComponentFixture<SidebarSubmenuComponent>;
  let mockMenuService: MockMenuService;

  beforeEach(async () => {
    mockMenuService = new MockMenuService();

    await TestBed.configureTestingModule({
      imports: [
        SidebarSubmenuComponent,
        NoopAnimationsModule,
        RouterTestingModule,
        NgClass,
        NgFor,
        NgTemplateOutlet,
        AngularSvgIconModule,
      ],
      providers: [
        { provide: MenuService, useValue: mockMenuService },
        { provide: SvgIconRegistryService, useClass: MockSvgIconRegistryService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarSubmenuComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should inject MenuService correctly', () => {
      expect(component.menuService).toBeDefined();
      expect(component.menuService).toBeInstanceOf(MockMenuService);
    });
  });

  describe('ngOnInit', () => {
    it('should initialize successfully', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('toggleMenu', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call toggleSubMenu on MenuService with correct parameter', () => {
      const menu: SubMenuItem = {  label: 'Test', expanded: false };
      component.toggleMenu(menu);
      expect(mockMenuService.toggleSubMenu).toHaveBeenCalledWith(menu);
      expect(mockMenuService.toggleSubMenu).toHaveBeenCalledTimes(1);
    });

    it('should call toggleSubMenu multiple times with different parameters', () => {
      const menu1: SubMenuItem = {  label: 'Test1', expanded: false };
      const menu2: SubMenuItem = {  label: 'Test2', expanded: false };
      component.toggleMenu(menu1);
      component.toggleMenu(menu2);
      expect(mockMenuService.toggleSubMenu).toHaveBeenCalledTimes(2);
      expect(mockMenuService.toggleSubMenu).toHaveBeenNthCalledWith(1, menu1);
      expect(mockMenuService.toggleSubMenu).toHaveBeenNthCalledWith(2, menu2);
    });
  });

  describe('collapse (private method)', () => {
    it('should collapse all items and their children', () => {
      const items = [
        { expanded: true, children: [{ expanded: true }, { expanded: true, children: [{ expanded: true }] }] },
        { expanded: true },
      ];
      (component as any).collapse(items);
      items.forEach(item => {
        expect(item.expanded).toBe(false);
        if (item.children) {
          item.children.forEach(child => {
            expect(child.expanded).toBe(false);
            if (child.children) {
              child.children.forEach(grandchild => expect(grandchild.expanded).toBe(false));
            }
          });
        }
      });
    });

    it('should handle empty items array', () => {
      expect(() => (component as any).collapse([])).not.toThrow();
    });
  });

  describe('component lifecycle and coverage', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle complete component lifecycle without errors', () => {
      expect(() => {
        fixture.detectChanges();
        component.ngOnInit();
        component.toggleMenu({  label: 'Test', expanded: false });
        fixture.destroy();
      }).not.toThrow();
    });

  
  });
});