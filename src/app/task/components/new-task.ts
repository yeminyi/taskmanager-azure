import { ChangeDetectionStrategy, Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { parse } from 'date-fns';
import { User, TaskHistory } from '../../domain';
import { TaskHistoryVM } from '../../vm';
import { getTaskHistoryVMs } from '../../utils/history.util';
import * as fromRoot from '../../reducers';
import * as TaskHistoryActions from '../../actions/task-history.action';
import * as TaskActions from '../../actions/task.action';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-new-task',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit(form, $event)">
      <h2 matDialogTitle>{{ dialogTitle }}</h2>
      <div matDialogContent>
        <mat-form-field class="full-width">
          <input matInput type="text" placeholder="{{'task.taskname' | translate}}" formControlName="desc">
        </mat-form-field>
        <mat-radio-group class="full-width" formControlName="priority">
          <mat-radio-button *ngFor="let priorityItem of priorities" [value]="priorityItem.value">
            {{ priorityItem.label }}
          </mat-radio-button>
        </mat-radio-group>
        <div class="full-width">
          <app-chips-list [label]="labelOwnerTitle" [multiple]="false" formControlName="owner"></app-chips-list>
        </div>
        <mat-form-field class="full-width">
          <input matInput [matDatepicker]="dueDatePicker" placeholder="{{'task.duedate' | translate}}" formControlName="dueDate">
          <mat-datepicker-toggle matSuffix [for]="dueDatePicker"></mat-datepicker-toggle>
        </mat-form-field>
        <mat-datepicker touchUi="true" #dueDatePicker></mat-datepicker>
        <mat-form-field class="full-width">
          <input matInput [matDatepicker]="reminderPicker" placeholder="{{'task.reminderdate' | translate}}" formControlName="reminder">
          <mat-datepicker-toggle matSuffix [for]="reminderPicker"></mat-datepicker-toggle>
        </mat-form-field>
        <mat-datepicker touchUi="true" #reminderPicker></mat-datepicker>
        <div class="full-width">
          <app-chips-list [label]="labelFollowersTitle" formControlName="followers"></app-chips-list>
        </div>
        <mat-form-field class="full-width">
          <textarea matInput placeholder="{{'task.remark' | translate}}" formControlName="remark"></textarea>
        </mat-form-field>
        <mat-list dense>
        <app-task-history-item
          *ngFor="let history of taskHistories"
          [item]="history">
        </app-task-history-item>
        </mat-list>
      </div>
      <div matDialogActions class="full-width">
        <div fxLayout="row" *ngIf="notConfirm else confirm">
          <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
          {{'save' | translate}}
          </button>
          <button matDialogClose mat-raised-button type="button">{{'close' | translate}}</button>
          <span fxFlex>
          </span>
          <button mat-button color="warn" type="button" [disabled]="delInvisible" (click)="onDelClick(false)">{{'delete' | translate}}</button>
        </div>
      </div>
    </form>
    <ng-template #confirm>
      <div fxLayout="row">
        <span class="fill-remaining-space mat-body-2">{{'task.del.content' | translate}}</span>
        <button mat-button color="warn" type="button" (click)="reallyDel()"> {{'confirm' | translate}}</button>
        <button mat-raised-button color="primary" type="button" (click)="onDelClick(true)"> {{'cancel' | translate}}</button>
      </div>
    </ng-template>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewTaskComponent implements OnInit, OnDestroy {

  private taskHistories$: Observable<TaskHistory[]>;
  private _sub: Subscription;
  taskHistories: TaskHistoryVM[] = [];

  form: FormGroup;
  dialogTitle: string;
  labelOwnerTitle: string;
  labelFollowersTitle: string;
  notConfirm = true;
  delInvisible = true;

  priorities: { label: string; value: number }[] = [
    {
      label:  this.translate.instant('task.normal'),
      value: 3
    },
    {
      label:  this.translate.instant('task.important'),
      value: 2
    },
    {
      label:  this.translate.instant('task.urgent'),
      value: 1
    },
  ];

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<NewTaskComponent>,
    private translate:TranslateService,
    private store$: Store<fromRoot.State>) {
    this.taskHistories$ = this.store$.select(fromRoot.getTaskHistories);
  }

  ngOnInit() {
    this.labelOwnerTitle = this.translate.instant('task.owner');
    this.labelFollowersTitle = this.translate.instant('task.followers');
    if (!this.data.task) {
      this.form = this.fb.group({
        desc: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
        priority: [3],
        dueDate: [],
        reminder: [],
        owner: [[this.data.owner]],
        followers: [[]],
        remark: ['', Validators.maxLength(40)]
      });
      this.dialogTitle = this.translate.instant('task.create');
      this.delInvisible = true;
    } else {
      this.form = this.fb.group({
        desc: [this.data.task.desc, Validators.compose([Validators.required, Validators.maxLength(20)])],
        priority: [this.data.task.priority],
        dueDate: [this.data.task.dueDate ? parse(this.data.task.dueDate) : null],
        reminder: [this.data.task.reminder ? parse(this.data.task.reminder) : null],
        owner: [this.data.task.owner ? [this.data.task.owner] : []],
        followers: [this.data.task.participants ? [...this.data.task.participants] : []],
        remark: [this.data.task.remark, Validators.maxLength(40)]
      });
      this.dialogTitle =  this.translate.instant('task.edit');
      this.delInvisible = false;

      this.loadTaskHistories();
    }
  }

  ngOnDestroy() {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  loadTaskHistories() {
    this.store$.dispatch(new TaskHistoryActions.LoadTaskHistoryAction(this.data.task.id));

    this._sub = this.taskHistories$.subscribe(histories => {
      this.taskHistories = getTaskHistoryVMs(histories);
      console.log('<loadTaskHistories>', JSON.stringify(this.taskHistories));
    });
  }

  onSubmit({ value, valid }: FormGroup, ev: Event) {
    ev.preventDefault();
    if (!valid) {
      return;
    }

    this.store$.dispatch(new TaskActions.UpdatingTaskAction({
      ...this.data.task,
      desc: value.desc,
      owner: value.owner.length > 0 ? value.owner[0] : null,
      participants: value.followers,
      dueDate: value.dueDate,
      priority: value.priority,
      remark: value.remark,
      reminder: value.reminder,
    }));

    this.dialogRef.close({
      type: 'addOrUpdate', task: {
        desc: value.desc,
        participantIds: value.followers.map((u: User) => u.id),
        ownerId: value.owner.length > 0 ? value.owner[0].id : null,
        dueDate: value.dueDate,
        reminder: value.reminder,
        priority: value.priority,
        remark: value.remark
      }
    });
  }

  onDelClick(confirm: boolean) {
    this.notConfirm = confirm;
  }

  reallyDel() {
    this.dialogRef.close({ type: 'delete', task: this.data.task });
  }
}
