import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-new-project',
  template: `
    <form fxLayout="column" class="form" [formGroup]="form" (ngSubmit)="onSubmit(form, $event)">
      <h3 matDialogTitle>{{ dialogTitle }}</h3>
      <div matDialogContent>
        <mat-form-field class="full-width">
          <input matInput placeholder="{{'project.name' | translate}}" formControlName="name">
        </mat-form-field>
        <mat-form-field class="full-width">
          <input matInput placeholder="{{'project.description' | translate}}" formControlName="desc">
        </mat-form-field>
        <app-image-list-select [cols]="6" [items]="thumbnails$ | async" formControlName="coverImg">
        </app-image-list-select>
      </div>
      <div matDialogActions>
        <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">{{'save' | translate}}</button>
        <button matDialogClose mat-raised-button type="button">{{'close' | translate}}</button>
      </div>
    </form>
  `,
  styles: [`
    .form {
      margin: 0;
      padding: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewProjectComponent implements OnInit {
  form: FormGroup;
  dialogTitle: string;
  thumbnails$: Observable<string[]>;

  constructor(private fb: FormBuilder,
              private translate: TranslateService,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<NewProjectComponent>) {
    this.thumbnails$ = this.data.thumbnails;
  }

  ngOnInit() {
    if (this.data.project) {
      this.form = this.fb.group({
        name: [this.data.project.name, Validators.compose([Validators.required, Validators.maxLength(20)])],
        desc: [this.data.project.desc, Validators.maxLength(40)],
        coverImg: [this.data.project.coverImg, Validators.required]
      });
      this.dialogTitle = this.translate.instant('project.edit');
    } else {
      this.form = this.fb.group({
        name: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
        desc: ['', Validators.maxLength(40)],
        coverImg: [this.data.img, Validators.required]
      });
      this.dialogTitle = this.translate.instant('project.create');
    }

  }

  onSubmit({value, valid}: FormGroup, event: Event) {
    event.preventDefault();
    if (!valid) {
      return;
    }
    this.dialogRef.close({name: value.name, desc: value.desc ? value.desc : null, coverImg: value.coverImg});
  }

}
