import { Injectable, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { Menu } from '../../../core/constants/menu';
import { MenuItem, SubMenuItem } from '../../../core/models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService implements OnDestroy {
  private _showSidebar = signal(true);
  private _showMobileMenu = signal(false);
  private _pagesMenu = signal<MenuItem[]>([]);
  private _subscription = new Subscription();

  constructor(private router: Router) {
    /** Set dynamic menu */
    this._pagesMenu.set(Menu.pages);

    const sub = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        /** Expand / mark active menu based on exact active route or active descendant */
        this._pagesMenu().forEach((menu) => {
          let activeGroup = false;
          menu.items.forEach((subMenu) => {
            const childActive = subMenu.children ? this.hasActiveChild(subMenu.children) : false;
            const active = this.isActive(subMenu.route) || childActive;

            subMenu.expanded = active;
            subMenu.active = active;

            if (active) activeGroup = true;

            if (subMenu.children) {
              this.expand(subMenu.children);
            }
          });

          menu.active = activeGroup;
        });
      }
    });

    this._subscription.add(sub);
  }

  get showSideBar() {
    return this._showSidebar();
  }
  get showMobileMenu() {
    return this._showMobileMenu();
  }
  get pagesMenu() {
    return this._pagesMenu();
  }

  set showSideBar(value: boolean) {
    this._showSidebar.set(value);
  }
  set showMobileMenu(value: boolean) {
    this._showMobileMenu.set(value);
  }

  public toggleSidebar() {
    this._showSidebar.set(!this._showSidebar());
  }

  public toggleMenu(menu: SubMenuItem) {
    if (!this.showSideBar && menu.children?.length) {
      // Sidebar is collapsed and this menu has children
      this.showSideBar = true; // Expand sidebar

      // Make the clicked menu active & expanded
      const updatedMenu = this._pagesMenu().map((menuGroup) => {
        return {
          ...menuGroup,
          items: menuGroup.items.map((item) => {
            return {
              ...item,
              expanded: item === menu, // only expand clicked
              active: item === menu
            };
          }),
        };
      });

      this._pagesMenu.set(updatedMenu);
      return;
    }

    // Regular behavior when sidebar is already open
    const updatedMenu = this._pagesMenu().map((menuGroup) => {
      return {
        ...menuGroup,
        items: menuGroup.items.map((item) => {
          return {
            ...item,
            expanded: item === menu ? !item.expanded : false,
          };
        }),
      };
    });

    this._pagesMenu.set(updatedMenu);
  }

  public toggleSubMenu(submenu: SubMenuItem) {
    submenu.expanded = !submenu.expanded;
  }

  private expand(items: Array<any>) {
    items.forEach((item) => {
      item.expanded = this.isActive(item.route);
      if (item.children) this.expand(item.children);
    });
  }

  private hasActiveChild(items: Array<any>): boolean {
    return items.some((item) => {
      if (this.isActive(item.route)) return true;
      if (item.children) return this.hasActiveChild(item.children);
      return false;
    });
  }

  public isActive(instruction: any): boolean {
    return this.router.isActive(this.router.createUrlTree([instruction]), {
      paths: 'exact',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}