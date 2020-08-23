import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from '../../reducers';
import {
  MatSlideToggleModule,
  MatToolbarModule,
  MatIconModule
} from '@angular/material';
import { HeaderComponent } from './header';

describe('Test for HeaderComponent：HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        StoreModule.forRoot(reducers, { metaReducers: metaReducers }),
        MatIconModule,
        MatToolbarModule,
        MatSlideToggleModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('The component should be created', () => {
    expect(component).toBeTruthy();
  });

  it('The element should be created in the component', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('span').innerText).toContain('Task Manager');
  });
});
