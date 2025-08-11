import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NgxSonnerToaster } from 'ngx-sonner';
import { ThemeService } from './core/services/theme.service';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

// Mock window.matchMedia to fix TypeError
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('AppComponent', () => {
  let mockThemeService: jest.Mocked<ThemeService>;

  beforeEach(async () => {
    // Create a mock ThemeService
    mockThemeService = {
      toggleTheme: jest.fn(),
      getCurrentTheme: jest.fn().mockReturnValue('light'),
    } as unknown as jest.Mocked<ThemeService>;

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppComponent, NgxSonnerToaster],
      providers: [
        { provide: ThemeService, useValue: mockThemeService },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Angular Tailwind'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Angular Tailwind');
  });

  it('should inject ThemeService', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.themeService).toBe(mockThemeService);
  });

  it('should render NgxSonnerToaster in the template', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const toasterElement = fixture.debugElement.query(By.directive(NgxSonnerToaster));
    expect(toasterElement).toBeTruthy();
  });

  it('should render RouterOutlet in the template', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const routerOutletElement = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutletElement).toBeTruthy();
  });
});
