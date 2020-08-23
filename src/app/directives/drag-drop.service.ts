import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

export interface DragData {
  tag: string; // tag id for different dragging layer
  data: any; // for passing data
}

@Injectable()
export class DragDropService {
  private _dragData = new BehaviorSubject<DragData | null>(null);

  setDragData(data: DragData) {
    this._dragData.next(data);
  }

  getDragData(): Observable<DragData | null> {
    return this._dragData.asObservable();
  }

  clearDragData() {
    this._dragData.next(null);
  }
}
