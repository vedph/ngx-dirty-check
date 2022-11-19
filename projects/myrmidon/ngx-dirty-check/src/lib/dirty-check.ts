import { AbstractControl } from '@angular/forms';
import {
  Observable,
  concat,
  defer,
  of,
  debounceTime,
  distinctUntilChanged,
  Subscription,
  combineLatest,
  map,
  finalize,
  startWith,
  shareReplay,
  fromEvent,
  withLatestFrom,
} from 'rxjs';

// note: this requires "allowSyntheticDefaultImports": true
// in tsconfig!
import equal from 'fast-deep-equal';

/**
 * Check if the specified control is dirty.
 *
 * @param control The control (usually a form) to check.
 * @param source The data source with pristine state value.
 * @returns True if dirty.
 */
export function dirtyCheck<V>(control: AbstractControl, source: Observable<V>) {
  const valueChanges$ = concat(
    defer(() => of(control.value)),
    control.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
  );

  let subscription: Subscription;
  let isDirty = false;

  const isDirty$ = combineLatest([source, valueChanges$]).pipe(
    map(([a, b]) => (isDirty = equal(a, b) === false)),
    finalize(() => subscription.unsubscribe()),
    startWith(false),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  subscription = fromEvent(window, 'beforeunload')
    .pipe(withLatestFrom(isDirty$))
    .subscribe(([event, isDirty]) => isDirty && event.preventDefault());

  return isDirty$;
}
