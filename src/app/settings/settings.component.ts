import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  dirtyCheck,
  HasDirty,
} from 'projects/myrmidon/ngx-dirty-check/src/public-api';
import { Observable, Subscription } from 'rxjs';
import { store, store$ } from '../services/store';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit, OnDestroy, HasDirty {
  private _sub?: Subscription;
  public settingOne: FormControl<string | null>;
  public settingTwo: FormControl<string | null>;
  public settingThree: FormControl<boolean>;
  public form: FormGroup;
  public isDirty$: Observable<boolean>;

  constructor(formBuilder: FormBuilder) {
    this.settingOne = formBuilder.control(null);
    this.settingTwo = formBuilder.control(null);
    this.settingThree = formBuilder.control(false, { nonNullable: true });
    this.form = formBuilder.group({
      settingOne: this.settingOne,
      settingTwo: this.settingTwo,
      settingThree: this.settingThree,
    });
    this.isDirty$ = dirtyCheck(this.form, store$);
  }

  ngOnInit(): void {
    this._sub = store$.subscribe((state) => this.form.patchValue(state));
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  submit() {
    console.log(JSON.stringify(this.form.value));
    store.next(this.form.value);
  }
}
