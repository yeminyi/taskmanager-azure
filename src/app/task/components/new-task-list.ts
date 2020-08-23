import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-new-task-list',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit($event)">
      <h3 matDialogTitle>{{ dialogTitle }}</h3>
      <div matDialogContent>
        <mat-form-field class="full-width">
          <input matInput placeholder="{{'task.listname' | translate}}" formControlName="name">
        </mat-form-field>
      </div>
      <div matDialogActions>
        <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">{{'save' | translate}}</button>
        <button matDialogClose mat-raised-button type="button">{{'close' | translate}}</button>
      </div>
    </form>
  `,
  styles: [`
    :host{
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewTaskListComponent implements OnInit {
  form: FormGroup;
  dialogTitle: string;

  constructor(private fb: FormBuilder,
              private translate:TranslateService,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<NewTaskListComponent>) {
  }

  ngOnInit() {
    if (!this.data.name) {
      this.form = this.fb.group({
        name: ['', Validators.compose([Validators.required, Validators.maxLength(10)])]
      });
      this.dialogTitle =this.translate.instant('task.createlist');
    } else {
      this.form = this.fb.group({
        name: [this.data.name, Validators.compose([Validators.required, Validators.maxLength(10)])],
      });
      this.dialogTitle =this.translate.instant('task.editlist');
    }
  }

  onSubmit(ev: Event) {
    ev.preventDefault();
    if (!this.form.valid) {
      return;
    }
    this.dialogRef.close(this.form.value.name);
  }
}
