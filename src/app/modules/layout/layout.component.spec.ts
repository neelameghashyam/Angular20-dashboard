import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Subject, of } from 'rxjs';
import { LayoutComponent } from './layout.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SvgIconRegistryService } from 'angular-svg-icon';

// Mock SvgIconRegistryService with all required methods
class MockSvgIconRegistryService {
  registerIcon() {}
  getIcon() {}
  loadSvg() {
    return of('<svg></svg>'); // Return observable for loadSvg
  }
}

// Mock MenuService (common dependency in SidebarComponent)
class MockMenuService {
  getMenuItems() { return []; }
}

// Mock SidebarComponent - completely isolated
@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: '<div>Mock Sidebar</div>',
})
class MockSidebarComponent {}

// Mock NavbarComponent - completely isolated
@Component({
  selector: 'app-navbar',
  standalone: true,
  template: '<div>Mock Navbar</div>',
})
class MockNavbarComponent {}

// Mock Router for testing
class MockRouter {
  events = new Subject<Event>();
}

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let mockRouter: MockRouter;
  let mockElement: Partial<HTMLElement>;

  beforeEach(async () => {
    mockRouter = new MockRouter();
    mockElement = { scrollTop: 0 };

    // Mock document.getElementById
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      return id === 'main-content' ? mockElement as HTMLElement : null;
    });

    await TestBed.configureTestingModule({
      imports: [LayoutComponent, RouterOutlet, MockSidebarComponent, MockNavbarComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SvgIconRegistryService, useClass: MockSvgIconRegistryService },
        { provide: 'MenuService', useClass: MockMenuService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should subscribe to router events', () => {
      const spy = jest.spyOn(mockRouter.events, 'subscribe');
      
      // Create a new instance to test constructor
      const testComponent = new LayoutComponent(mockRouter as any);
      
      expect(spy).toHaveBeenCalled();
    });

    it('should scroll mainContent to top on NavigationEnd event when mainContent exists', () => {
      // Set up mainContent before triggering the event
      component.ngOnInit();
      mockElement.scrollTop = 100; // Set initial scroll position
      
      // Trigger NavigationEnd event
      mockRouter.events.next(new NavigationEnd(1, '/test', '/test'));

      expect(mockElement.scrollTop).toBe(0);
    });

    it('should not attempt to scroll if mainContent is null on NavigationEnd event', () => {
      // Don't call ngOnInit, so mainContent remains null
      mockElement.scrollTop = 100; // Set initial scroll position
      
      // Trigger NavigationEnd event
      mockRouter.events.next(new NavigationEnd(1, '/test', '/test'));

      // scrollTop should remain unchanged
      expect(mockElement.scrollTop).toBe(100);
    });

    it('should not scroll on non-NavigationEnd events', () => {
      component.ngOnInit();
      mockElement.scrollTop = 100; // Set initial scroll position
      
      // Trigger a non-NavigationEnd event
      mockRouter.events.next({} as Event);

      expect(mockElement.scrollTop).toBe(100); // Unchanged
    });
  });

  describe('ngOnInit', () => {
    it('should initialize mainContent with element having id main-content', () => {
      component.ngOnInit();
      
      expect(document.getElementById).toHaveBeenCalledWith('main-content');
      expect(component['mainContent']).toBe(mockElement as HTMLElement);
    });

    it('should set mainContent to null if element is not found', () => {
      jest.spyOn(document, 'getElementById').mockReturnValue(null);
      
      component.ngOnInit();
      
      expect(component['mainContent']).toBeNull();
    });
  });

  
});