import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { map, Observable, of, switchMap, take, tap } from 'rxjs';

/**
 * Interface to be implemented by dirty-checked components.
 */
export interface HasDirty {
  isDirty$: Observable<boolean>;
}

/**
 * Dirty check guard.
 */
@Injectable({ providedIn: 'root' })
export class DirtyCheckGuard implements CanDeactivate<HasDirty> {
  constructor(private _dialogService: DialogService) {}

  canDeactivate(
    component: HasDirty,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot | undefined
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return component.isDirty$.pipe(
      switchMap((dirty) => {
        if (!dirty) {
          return of(true);
        }
        return this._dialogService
          .confirm(
            'Warning',
            'There are unsaved changes. Do you want to leave?'
          )
          .pipe(
            take(1),
            map((yes) => (yes ? true : false))
          );
      })
    );
  }
}
