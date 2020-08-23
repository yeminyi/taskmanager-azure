import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/project.action';
import { NewProjectComponent } from '../components/new-project';
import { InviteComponent } from '../components/invite';
import { ConfirmDialogComponent } from '../../shared';
import { defaultRouteAnim, listAnimation } from '../../anim';
import { Project, User } from '../../domain';
import { map, take, switchMap, reduce, filter } from 'rxjs/operators';
import { range } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-project-list',
  template: `
    <div fxLayout="row"  fxLayout.xs="column" [@listAnim]="listAnim$ | async">
      <app-project-item
        fxFlex="0 0 360px"
        fxFlex.xs="1 1 auto"
        fxLayout="row"
        class="card"
        *ngFor="let project of (projects$ | async)"
        [item]="project"
        (itemSelected)="selectProject(project)"
        (launchUpdateDialog)="openUpdateDialog(project)"
        (launchInviteDailog)="openInviteDialog(project)"
        (launchDeleteDailog)="openDeleteDialog(project)">
      </app-project-item>
    </div>
    <button mat-fab (click)="openNewProjectDialog()" type="button" class="fab-button">
      <mat-icon>add</mat-icon>
    </button>
  `,
  styles: [
    `
      .card {
        margin: 10px;
      }
      .fab-button {
        position: fixed;
        right: 32px;
        bottom: 96px;
        z-index: 998;
      }
    `
  ],
  animations: [defaultRouteAnim, listAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent {
  @HostBinding('@routeAnim')
  state: string;
  projects$: Observable<Project[]>;
  listAnim$: Observable<number>;

  constructor(
    private store$: Store<fromRoot.State>,
    private dialog: MatDialog,
    public translate: TranslateService
  ) {
    this.store$.dispatch(new actions.LoadProjectsAction());
    this.projects$ = this.store$.pipe(select(fromRoot.getProjects));
    this.listAnim$ = this.projects$.pipe(map(p => p.length));
  }

  selectProject(project: Project) {
    this.store$.dispatch(new actions.SelectProjectAction(project));
  }

  openNewProjectDialog() {
    const img = `./assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;
    const thumbnails$ = this.getThumbnailsObs();
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: { thumbnails: thumbnails$, img: img }
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(val => {
        if (val) {
          const converImg = this.buildImgSrc(val.coverImg);
          this.store$.dispatch(
            new actions.AddProjectAction({ ...val, coverImg: converImg })
          );
        }
      });
  }

  openUpdateDialog(project: Project) {
    const thumbnails$ = this.getThumbnailsObs();
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: { project: project, thumbnails: thumbnails$ }
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(val => {
        if (val) {
          const converImg = this.buildImgSrc(val.coverImg);
          this.store$.dispatch(
            new actions.UpdateProjectAction({
              ...val,
              id: project.id,
              coverImg: converImg
            })
          );
        }
      });
  }

  openInviteDialog(project: Project) {
    this.store$
      .pipe(
        select(fromRoot.getProjectMembers(<string>project.id)),
        take(1),
        map(members =>
          this.dialog.open(InviteComponent, { data: { members: members } })
        ),
        switchMap(dialogRef =>
          dialogRef.afterClosed().pipe(
            take(1),
            filter(n => n)
          )
        )
      )
      .subscribe(val => {
        this.store$.dispatch(
          new actions.InviteMembersAction({
            projectId: <string>project.id,
            members: <User[]>val
          })
        );
      });
  }

  openDeleteDialog(project: Project) {
    const confirm = {
      title: this.translate.instant('project.delete.title')+project.name,
      content:this.translate.instant('project.del.content'),
      confirmAction: this.translate.instant('project.del.confirm'),
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { dialog: confirm }
    });

    // 使用 take(1) 来自动销毁订阅，因为 take(1) 意味着接收到 1 个数据后就完成了
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(val => {
        if (val) {
          this.store$.dispatch(new actions.DeleteProjectAction(project));
        }
      });
  }

  private getThumbnailsObs(): Observable<string[]> {
    return range(0, 40).pipe(
      map(i => `./assets/img/covers/${i}_tn.jpg`),
      reduce((r: string[], x: string) => {
        return [...r, x];
      }, [])
    );
  }

  private buildImgSrc(img: string): string {
    return img.indexOf('_') > -1 ? img.split('_', 1)[0] + '.jpg' : img;
  }
}
