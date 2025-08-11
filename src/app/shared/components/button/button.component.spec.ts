
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <app-button
      [impact]="impact"
      [size]="size"
      [shape]="shape"
      [tone]="tone"
      [shadow]="shadow"
      [type]="type"
      [full]="full"
      [disabled]="disabled"
      (buttonClick)="onButtonClick()"
    >Click Me</app-button>
  `,
  standalone: true,
  imports: [ButtonComponent],
})
class TestHostComponent {
  impact: 'bold' | 'light' | 'none' = 'none';
  size: 'small' | 'medium' | 'large' = 'medium';
  shape: 'square' | 'rounded' | 'pill' = 'rounded';
  tone: 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'light' = 'primary';
  shadow: 'none' | 'small' | 'medium' | 'large' = 'none';
  type: 'button' | 'submit' | 'reset' = 'submit';
  full: boolean | string = false;
  disabled: boolean | string = false;

  onButtonClick = jest.fn();
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let buttonElement: DebugElement;
  let buttonComponent: ButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent, TestHostComponent, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    buttonElement = hostFixture.debugElement.query(By.css('button'));
    buttonComponent = hostFixture.debugElement.query(By.directive(ButtonComponent)).componentInstance;
    fixture.detectChanges();
    hostFixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(buttonComponent).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize classes with default inputs', () => {
      hostFixture.detectChanges();
      expect(buttonComponent.classes).toContain('font-semibold');
      expect(buttonComponent.classes).toContain('bg-transparent text-primary');
      expect(buttonComponent.classes).toContain('px-5 py-2 text-sm');
      expect(buttonComponent.classes).toContain('rounded-lg');
      expect(buttonComponent.classes).not.toContain('w-full');
      expect(buttonComponent.classes).not.toContain('shadow-');
    });

    it('should handle all tone and impact combinations', () => {
      const toneImpactPairs: [
        'primary' | 'danger' | 'success' | 'warning' | 'info' | 'light',
        'bold' | 'light' | 'none'
      ][] = [
        ['primary', 'bold'], ['primary', 'light'], ['primary', 'none'],
        ['danger', 'bold'], ['danger', 'light'], ['danger', 'none'],
        ['success', 'bold'], ['success', 'light'], ['success', 'none'],
        ['warning', 'bold'], ['warning', 'light'], ['warning', 'none'],
        ['info', 'bold'], ['info', 'light'], ['info', 'none'],
        ['light', 'bold'], ['light', 'light'], ['light', 'none'],
      ];

      toneImpactPairs.forEach(([tone, impact]) => {
        hostComponent.tone = tone;
        hostComponent.impact = impact;
        hostFixture.detectChanges();
        expect(buttonComponent.classes)
      });
    });

    

    it('should handle all shape classes', () => {
      const shapes: ['square', 'rounded', 'pill'] = ['square', 'rounded', 'pill'];
      shapes.forEach(shape => {
        hostComponent.shape = shape;
        hostFixture.detectChanges();
        expect(buttonComponent.classes)
      });
    });

    it('should handle all shadow classes', () => {
      const shadows: ['none', 'small', 'medium', 'large'] = ['none', 'small', 'medium', 'large'];
      shadows.forEach(shadow => {
        hostComponent.shadow = shadow;
        hostFixture.detectChanges();
        expect(buttonComponent.classes)
      });
    });

    it('should apply full class when full is true', () => {
      hostComponent.full = true;
      hostFixture.detectChanges();
      expect(buttonComponent.classes);
    });

    it('should not apply full class when full is false', () => {
      hostComponent.full = false;
      hostFixture.detectChanges();
      expect(buttonComponent.classes).not.toContain('w-full');
    });
  });

  describe('input transformations', () => {
    it('should transform full string to boolean', () => {
      hostComponent.full = '';
      hostFixture.detectChanges();
      expect(buttonComponent.full()).toBe(true);

      hostComponent.full = 'false';
      hostFixture.detectChanges();
      expect(buttonComponent.full()).toBe(false);
    });

    it('should transform disabled string to boolean', () => {
      hostComponent.disabled = '';
      hostFixture.detectChanges();
      expect(buttonComponent.disabled()).toBe(true);

      hostComponent.disabled = 'false';
      hostFixture.detectChanges();
      expect(buttonComponent.disabled()).toBe(false);
    });
  });

  describe('buttonClick event', () => {
    it('should emit buttonClick event on click', () => {
      hostComponent.disabled = false;
      hostFixture.detectChanges();
      buttonElement.triggerEventHandler('click', null);
      expect(hostComponent.onButtonClick).toHaveBeenCalledTimes(1);
    });
  });



  describe('disabled state', () => {
    it('should apply disabled attribute and classes when disabled is true', () => {
      hostComponent.disabled = true;
      hostFixture.detectChanges();
      expect(buttonElement.nativeElement.disabled).toBe(true);
      expect(buttonComponent.classes).toContain('disabled:opacity-50');
      expect(buttonComponent.classes).toContain('disabled:pointer-events-none');
    });

    it('should not apply disabled attribute when disabled is false', () => {
      hostComponent.disabled = false;
      hostFixture.detectChanges();
      expect(buttonElement.nativeElement.disabled).toBe(false);
    });
  });


});
