import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd, Event } from '@angular/router';
import { MenuService } from './menu.service';
import { Menu } from '../../../core/constants/menu';
import { MenuItem, SubMenuItem } from '../../../core/models/menu.model';
import { Subject } from 'rxjs';

// Mock Router for testing
class MockRouter {
  events = new Subject<Event>();
  createUrlTree = jest.fn();
  isActive = jest.fn();
}

describe('MenuService', () => {
  let service: MenuService;
  let mockRouter: MockRouter;

  // Sample menu data for testing
  const mockMenu: MenuItem[] = [
    {
      group: 'Group 1',
      active: false,
      items: [
        {
          label: 'Item 1',
          route: '/item1',
          expanded: false,
          active: false,
        },
        {
          label: 'Item 2',
          route: '/item2',
          expanded: false,
          active: false,
          children: [
            {
              label: 'Subitem 2.1',
              route: '/item2/sub1',
              expanded: false,
              active: false,
            },
          ],
        },
      ],
    },
  ];

  let originalPages: MenuItem[];

  beforeAll(() => {
    originalPages = Menu.pages;
  });

  beforeEach(() => {
    mockRouter = new MockRouter();
    // Mock createUrlTree to return an object with toString
    mockRouter.createUrlTree.mockImplementation((routes: any[]) => ({
      toString: () => routes[0] || '',
    }));

    // Deep copy mockMenu to avoid mutation issues
    const menuCopy = JSON.parse(JSON.stringify(mockMenu));
    (Menu as any).pages = menuCopy;

    TestBed.configureTestingModule({
      providers: [
        MenuService,
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(MenuService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    (Menu as any).pages = originalPages;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    it('should initialize signals and set pages menu', () => {
      expect(service.pagesMenu).toEqual(mockMenu);
      expect(service.showSideBar).toBe(true);
      expect(service.showMobileMenu).toBe(false);
    });

    it('should subscribe to router events and update menu on NavigationEnd with active child', () => {
      mockRouter.isActive.mockImplementation((tree) => tree.toString() === '/item2/sub1');
      mockRouter.events.next(new NavigationEnd(1, '/item2/sub1', '/item2/sub1'));

      const pagesMenu = service.pagesMenu;
      expect(pagesMenu[0].items[1].expanded).toBe(true);
      expect(pagesMenu[0].items[1].active).toBe(true);
      expect(pagesMenu[0].active).toBe(true);
      expect(pagesMenu[0].items[0].expanded).toBe(false);
      expect(pagesMenu[0].items[0].active).toBe(false);
    });

    it('should set menu inactive if no active route', () => {
      mockRouter.isActive.mockReturnValue(false);
      mockRouter.events.next(new NavigationEnd(1, '/', '/'));

      const pagesMenu = service.pagesMenu;
      expect(pagesMenu[0].items[1].expanded).toBe(false);
      expect(pagesMenu[0].items[1].active).toBe(false);
      expect(pagesMenu[0].active).toBe(false);
    });

    it('should not update menu on non-NavigationEnd events', () => {
      mockRouter.isActive.mockReturnValue(false);
      const pagesMenu = service.pagesMenu;
      pagesMenu[0].items[1].expanded = true; // Set to see if changes
      mockRouter.events.next({} as Event);

      expect(pagesMenu[0].items[1].expanded).toBe(true); // Unchanged
    });
  });

  describe('getters', () => {
    it('should get showSideBar value', () => {
      expect(service.showSideBar).toBe(true);
    });

    it('should get showMobileMenu value', () => {
      expect(service.showMobileMenu).toBe(false);
    });

    it('should get pagesMenu value', () => {
      expect(service.pagesMenu).toEqual(mockMenu);
    });
  });

  describe('setters', () => {
    it('should set showSideBar value', () => {
      service.showSideBar = false;
      expect(service.showSideBar).toBe(false);
    });

    it('should set showMobileMenu value', () => {
      service.showMobileMenu = true;
      expect(service.showMobileMenu).toBe(true);
    });
  });

  describe('toggleSidebar', () => {
    it('should toggle showSideBar value', () => {
      service.toggleSidebar();
      expect(service.showSideBar).toBe(false);
      service.toggleSidebar();
      expect(service.showSideBar).toBe(true);
    });
  });

  describe('toggleMenu', () => {
    it('should expand sidebar and set clicked menu as active and expanded when sidebar is collapsed and menu has children', () => {
      service.showSideBar = false;
      const menuItem = service.pagesMenu[0].items[1];
      service.toggleMenu(menuItem);

      expect(service.showSideBar).toBe(true);
      expect(service.pagesMenu[0].items[1].expanded).toBe(true);
      expect(service.pagesMenu[0].items[1].active).toBe(true);
      expect(service.pagesMenu[0].items[0].expanded).toBe(false);
      expect(service.pagesMenu[0].items[0].active).toBe(false);
    });

    it('should not expand sidebar when collapsed and menu has no children', () => {
      service.showSideBar = false;
      const menuItem = service.pagesMenu[0].items[0];
      service.toggleMenu(menuItem);

      expect(service.showSideBar).toBe(false);
      expect(service.pagesMenu[0].items[0].expanded).toBe(true);
      expect(service.pagesMenu[0].items[1].expanded).toBe(false);
    });

    it('should toggle menu expanded state when sidebar is open', () => {
      const menuItem = service.pagesMenu[0].items[1];
      service.toggleMenu(menuItem);

      expect(service.pagesMenu[0].items[1].expanded).toBe(true);
      expect(service.pagesMenu[0].items[0].expanded).toBe(false);

      service.toggleMenu(menuItem);
      expect(service.pagesMenu[0].items[1].expanded).toBe(false);
      expect(service.pagesMenu[0].items[0].expanded).toBe(false);
    });
  });

  describe('toggleSubMenu', () => {
    it('should toggle submenu expanded state', () => {
      const submenu = service.pagesMenu[0].items[1].children![0];
      service.toggleSubMenu(submenu);

      expect(service.pagesMenu[0].items[1].children![0].expanded).toBe(true);
      service.toggleSubMenu(submenu);
      expect(service.pagesMenu[0].items[1].children![0].expanded).toBe(false);
    });
  });

  describe('isActive', () => {
    it('should call router.isActive with correct parameters', () => {
      const route = '/test';
      mockRouter.createUrlTree.mockReturnValue({ toString: () => route });
      service.isActive(route);

      expect(mockRouter.createUrlTree).toHaveBeenCalledWith([route]);
      expect(mockRouter.isActive).toHaveBeenCalledWith(
        expect.objectContaining({ toString: expect.any(Function) }),
        {
          paths: 'exact',
          queryParams: 'subset',
          fragment: 'ignored',
          matrixParams: 'ignored',
        }
      );
    });

    it('should return true when route is active', () => {
      mockRouter.isActive.mockReturnValue(true);
      expect(service.isActive('/test')).toBe(true);
    });

    it('should return false when route is not active', () => {
      mockRouter.isActive.mockReturnValue(false);
      expect(service.isActive('/test')).toBe(false);
    });
  });

  describe('hasActiveChild', () => {
    it('should return true if any child is active', () => {
      mockRouter.isActive.mockReturnValue(true);
      const result = (service as any).hasActiveChild(service.pagesMenu[0].items[1].children!);
      expect(result).toBe(true);
    });

    it('should return false if no child is active', () => {
      mockRouter.isActive.mockReturnValue(false);
      const result = (service as any).hasActiveChild(service.pagesMenu[0].items[1].children!);
      expect(result).toBe(false);
    });

    it('should check nested children', () => {
      const nestedChild = { route: '/nested', children: [{ route: '/nested/child', children: [], expanded: false, active: false }] };
      service.pagesMenu[0].items[1].children!.push(nestedChild as any);
      mockRouter.createUrlTree.mockImplementation((routes: any[]) => ({
        toString: () => routes[0] || '',
      }));
      mockRouter.isActive.mockImplementation((tree) => tree.toString() === '/nested/child');

      const result = (service as any).hasActiveChild(service.pagesMenu[0].items[1].children!);
      expect(result).toBe(true);
    });
  });

  describe('expand', () => {
    it('should expand items if route is active', () => {
      mockRouter.isActive.mockReturnValue(true);
      const items = [{ route: '/test', expanded: false, children: [] }];
      (service as any).expand(items);
      expect(items[0].expanded).toBe(true);
    });

    it('should not expand items if route is not active', () => {
      mockRouter.isActive.mockReturnValue(false);
      const items = [{ route: '/test', expanded: true, children: [] }];
      (service as any).expand(items);
      expect(items[0].expanded).toBe(false);
    });

    it('should handle nested children', () => {
      mockRouter.isActive.mockReturnValue(true);
      const items = [{ route: '/test', expanded: false, children: [{ route: '/nested', expanded: false, children: [] }] }];
      (service as any).expand(items);
      expect(items[0].expanded).toBe(true);
      expect(items[0].children[0].expanded).toBe(true);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from router events', () => {
      const unsubscribeSpy = jest.spyOn((service as any)._subscription, 'unsubscribe');
      service.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});