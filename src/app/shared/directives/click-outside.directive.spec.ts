import { Component, ElementRef, Inject, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClickOutsideDirective } from './click-outside.directive';

// Mock Component to test the directive
@Component({
  template: `<div clickOutside (clickOutside)="onClickOutside()" id="test-element">Test Content</div>`,
  standalone: true,
  imports: [ClickOutsideDirective],
})
class TestComponent {
  onClickOutside = jest.fn();
}

// Another test component for multiple instances
@Component({
  template: `
    <div clickOutside (clickOutside)="onClickOutside1()" id="element1">Element 1</div>
    <div clickOutside (clickOutside)="onClickOutside2()" id="element2">Element 2</div>
  `,
  standalone: true,
  imports: [ClickOutsideDirective],
})
class MultipleTestComponent {
  onClickOutside1 = jest.fn();
  onClickOutside2 = jest.fn();
}

describe('ClickOutsideDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: ClickOutsideDirective;
  let element: HTMLElement;
  let documentRef: Document;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, ClickOutsideDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    documentRef = TestBed.inject(DOCUMENT);
    
    fixture.detectChanges();
    
    directive = fixture.debugElement.children[0].injector.get(ClickOutsideDirective);
    element = fixture.debugElement.children[0].nativeElement;
  });

  afterEach(() => {
    jest.clearAllMocks();
    const elementsToRemove = documentRef.querySelectorAll('.test-outside-element');
    elementsToRemove.forEach(el => el.remove());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  describe('constructor', () => {
    it('should inject ElementRef and DOCUMENT correctly', () => {
      expect(directive['element']).toBeDefined();
      expect(directive['document']).toBeDefined();
      expect(directive['element'].nativeElement).toBe(element);
      expect(directive['document']).toBe(documentRef);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should set up document click subscription', () => {
      expect(directive.documentClickSubscription).toBeDefined();
      expect(directive.documentClickSubscription).not.toBeUndefined();
    });

    it('should handle multiple calls to ngAfterViewInit', () => {
      const existingSubscription = directive.documentClickSubscription;
      directive.ngAfterViewInit();
      expect(directive.documentClickSubscription).toBeDefined();
    });
  });

  describe('click outside functionality', () => {
    it('should emit clickOutside when clicking outside the element', fakeAsync(() => {
      const outsideElement = documentRef.createElement('div');
      outsideElement.className = 'test-outside-element';
      documentRef.body.appendChild(outsideElement);
      
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      Object.defineProperty(clickEvent, 'target', { value: outsideElement });
      
      outsideElement.dispatchEvent(clickEvent);
      tick();
      
      expect(component.onClickOutside).toHaveBeenCalledTimes(1);
    }));

    it('should not emit clickOutside when clicking inside the element', fakeAsync(() => {
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      Object.defineProperty(clickEvent, 'target', { value: element });
      
      element.dispatchEvent(clickEvent);
      tick();
      
      expect(component.onClickOutside).not.toHaveBeenCalled();
    }));

    it('should not emit clickOutside when clicking on child elements', fakeAsync(() => {
      const childElement = documentRef.createElement('span');
      childElement.textContent = 'Child Element';
      element.appendChild(childElement);
      
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      Object.defineProperty(clickEvent, 'target', { value: childElement });
      
      childElement.dispatchEvent(clickEvent);
      tick();
      
      expect(component.onClickOutside).not.toHaveBeenCalled();
    }));

    it('should handle multiple outside clicks', fakeAsync(() => {
      const outsideElement1 = documentRef.createElement('div');
      const outsideElement2 = documentRef.createElement('div');
      outsideElement1.className = 'test-outside-element';
      outsideElement2.className = 'test-outside-element';
      documentRef.body.appendChild(outsideElement1);
      documentRef.body.appendChild(outsideElement2);
      
      const clickEvent1 = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent1, 'target', { value: outsideElement1 });
      outsideElement1.dispatchEvent(clickEvent1);
      tick();
      
      const clickEvent2 = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent2, 'target', { value: outsideElement2 });
      outsideElement2.dispatchEvent(clickEvent2);
      tick();
      
      expect(component.onClickOutside).toHaveBeenCalledTimes(2);
    }));
  });

  describe('isInside method', () => {
    it('should return true when element is the same as nativeElement', () => {
      const result = directive.isInside(element);
      expect(result).toBe(true);
    });

    it('should return true when element is a child of nativeElement', () => {
      const childElement = documentRef.createElement('span');
      element.appendChild(childElement);
      
      const result = directive.isInside(childElement);
      expect(result).toBe(true);
    });

    it('should return true when element is a deep child of nativeElement', () => {
      const childElement = documentRef.createElement('div');
      const grandChildElement = documentRef.createElement('span');
      element.appendChild(childElement);
      childElement.appendChild(grandChildElement);
      
      const result = directive.isInside(grandChildElement);
      expect(result).toBe(true);
    });

    it('should return false when element is outside nativeElement', () => {
      const outsideElement = documentRef.createElement('div');
      documentRef.body.appendChild(outsideElement);
      
      const result = directive.isInside(outsideElement);
      expect(result).toBe(false);
    });

    it('should return false when element is a sibling of nativeElement', () => {
      const siblingElement = documentRef.createElement('div');
      element.parentNode?.appendChild(siblingElement);
      
      const result = directive.isInside(siblingElement);
      expect(result).toBe(false);
    });

    it('should handle null element gracefully', () => {
      expect(() => directive.isInside(null as any)).not.toThrow();
      expect(directive.isInside(null as any)).toBe(false);
    });
  });

  describe('ngOnDestroy', () => {
    

    it('should handle ngOnDestroy when subscription is undefined', () => {
      directive.documentClickSubscription = undefined;
      expect(() => directive.ngOnDestroy()).not.toThrow();
    });

    it('should handle ngOnDestroy when subscription is null', () => {
      directive.documentClickSubscription = null as any;
      expect(() => directive.ngOnDestroy()).not.toThrow();
    });

    it('should handle multiple calls to ngOnDestroy', () => {
      const subscription = directive.documentClickSubscription;
      const unsubscribeSpy = jest.spyOn(subscription!, 'unsubscribe');
      
      directive.ngOnDestroy();
      directive.ngOnDestroy();
      
      expect(unsubscribeSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('complete lifecycle', () => {
    it('should handle complete directive lifecycle without errors', fakeAsync(() => {
      expect(() => {
        directive.ngAfterViewInit();
        const outsideElement = documentRef.createElement('div');
        outsideElement.className = 'test-outside-element';
        documentRef.body.appendChild(outsideElement);
        
        const clickEvent = new MouseEvent('click', { bubbles: true });
        Object.defineProperty(clickEvent, 'target', { value: outsideElement });
        outsideElement.dispatchEvent(clickEvent);
        tick();
        
        directive.ngOnDestroy();
      }).not.toThrow();
      
      expect(component.onClickOutside).toHaveBeenCalledTimes(2);
    }));
  });

  describe('event handling edge cases', () => {
    it('should handle events with different target types', fakeAsync(() => {
      const textNode = documentRef.createTextNode('Test text');
      const container = documentRef.createElement('div');
      container.className = 'test-outside-element';
      container.appendChild(textNode);
      documentRef.body.appendChild(container);
      
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: textNode });
      container.dispatchEvent(clickEvent);
      tick();
      
      expect(component.onClickOutside).toHaveBeenCalledTimes(1);
    }));

    it('should handle events bubbling from deep nested elements', fakeAsync(() => {
      const outsideContainer = documentRef.createElement('div');
      const level1 = documentRef.createElement('div');
      const level2 = documentRef.createElement('span');
      const level3 = documentRef.createElement('button');
      
      outsideContainer.className = 'test-outside-element';
      outsideContainer.appendChild(level1);
      level1.appendChild(level2);
      level2.appendChild(level3);
      documentRef.body.appendChild(outsideContainer);
      
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: level3 });
      level3.dispatchEvent(clickEvent);
      tick();
      
      expect(component.onClickOutside).toHaveBeenCalledTimes(1);
    }));

    it('should not emit when event is not a click event', fakeAsync(() => {
      const outsideElement = documentRef.createElement('div');
      outsideElement.className = 'test-outside-element';
      documentRef.body.appendChild(outsideElement);
      
      const mouseOverEvent = new MouseEvent('mouseover', { bubbles: true });
      Object.defineProperty(mouseOverEvent, 'target', { value: outsideElement });
      outsideElement.dispatchEvent(mouseOverEvent);
      tick();
      
      expect(component.onClickOutside).not.toHaveBeenCalled();
    }));
  });

  

  describe('coverage for all branches and lines', () => {
    it('should cover all code paths in isInside', () => {
      const directive = fixture.debugElement.children[0].injector.get(ClickOutsideDirective);
      
      expect(directive.isInside(element)).toBe(true);
      
      const childElement = documentRef.createElement('span');
      element.appendChild(childElement);
      expect(directive.isInside(childElement)).toBe(true);
      
      const outsideElement = documentRef.createElement('div');
      documentRef.body.appendChild(outsideElement);
      expect(directive.isInside(outsideElement)).toBe(false);
      
      expect(directive.isInside(null as any)).toBe(false);
    });
  });
});