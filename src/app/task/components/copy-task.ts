import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs';
import {TaskList} from '../../domain';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-copy-task',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit(form, $event)">
      <span matDialogTitle>{{ dialogTitle }}</span>
      <div matDialogContent>
        <mat-form-field>
          <mat-select placeholder="{{'task.copy_target' | translate}}" formControlName="targetList" class="full-width">
            <mat-option *ngFor="let list of lists$ | async" [value]="list.id">
              {{ list.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <div matDialogActions>
          <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">{{'confirm' | translate}}</button>
          <button matDialogClose mat-raised-button type="button">{{'close' | translate}}</button>
        </div>
      </div>
    </form>
    `,
  styles: [``]
})
export class CopyTaskComponent implements OnInit {
  form: FormGroup;
  dialogTitle: string;
  lists$: Observable<TaskList>;

  constructor(private fb: FormBuilder,
              private translate:TranslateService,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<CopyTaskComponent>) {
  }

  ngOnInit() {
    this.lists$ = this.data.lists;
    this.dialogTitle = this.translate.instant('task.moveall');
    this.form = this.fb.group({
      targetList: ['', Validators.required]
    });
  }

  onSubmit({value, valid}: FormGroup, ev: Event) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    this.dialogRef.close({srcListId: this.data.srcListId, targetListId: value.targetList});
  }
}
