import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { Theme } from '../models/theme.model';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    // Ensure html element exists and is clean
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.removeAttribute('class');
      htmlElement.removeAttribute('data-theme');
      htmlElement.removeAttribute('dir');
    }

    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [ThemeService]
    });

    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default theme', () => {
    const defaultTheme: Theme = { mode: 'dark', color: 'base', direction: 'ltr' };
    expect(service.theme()).toEqual(defaultTheme);
  });

  it('should load theme from localStorage if present', fakeAsync(() => {
    const storedTheme: Theme = { mode: 'light', color: 'custom', direction: 'rtl' };
    localStorage.setItem('theme', JSON.stringify(storedTheme));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    const newService = TestBed.inject(ThemeService);
    tick();
    expect(newService.theme()).toEqual(storedTheme);
  }));

 
  it('should return true for isDark when theme mode is dark', fakeAsync(() => {
    service.theme.set({ mode: 'dark', color: 'base', direction: 'ltr' });
    tick();
    expect(service.isDark).toBe(true);
  }));

  it('should return false for isDark when theme mode is not dark', fakeAsync(() => {
    service.theme.set({ mode: 'light', color: 'base', direction: 'ltr' });
    tick();
    expect(service.isDark).toBe(false);
  }));



  it('should handle null html element gracefully', fakeAsync(() => {
    jest.spyOn(document, 'querySelector').mockReturnValue(null);
    expect(() => {
      service.theme.set({ mode: 'dark', color: 'base', direction: 'ltr' });
      tick();
    }).not.toThrow();
  }));


});
