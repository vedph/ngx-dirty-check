# NgxDirtyCheck

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.9.

Angular dirty check helper. This was refactored from <https://netbasal.com/detect-unsaved-changes-in-angular-forms-75fd8f5f1fa6>.

Usage:

(1) install: `npm i fast-deep-equal @myrmidon/ngx-dirty-check`.

(2) ensure you have `"allowSyntheticDefaultImports": true` in your `tsconfig.json`.

(3) create a store of some sort representing your form's data, where each control's value is keyed under its string key. The store can be anything being an `Observable<T>`, and is used only for the purpose of dirty checking.

(4) let your component to be checked for dirty state implement `HasDirty` like this:

```ts
export class SettingsComponent implements OnInit, OnDestroy, HasDirty {
  private _sub?: Subscription;
  public isDirty$: Observable<boolean>;

  constructor(formBuilder: FormBuilder) {
    // ... build your form ...
    // the data store can be anything which is an Observable<V>
    // where V is your form's value; here it's named store$
    this.isDirty$ = dirtyCheck(this.form, YOUR_STORE);
  }

  ngOnInit(): void {
    // be sure to unsubscribe to avoid leaks
    // whenever the store emits, call form's patchValue to update the form's values
    this._sub = store$.subscribe((state) => this.form.patchValue(state));
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  submit() {
    // TODO: update your store with form data, e.g.:
    // store.next(this.form.value);
  }
}
```

If your component gets its data from an input property binding, just update the store once it has been set (like in `submit`). This will update the form's controls.
