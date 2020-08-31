import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ViewService {
    private readonly cleanSubject: Subject<void>;

    public get clean$(): Observable<void> {
        return this.cleanSubject.asObservable();
    }

    constructor() {
        this.cleanSubject = new Subject();
    }

    public clean(): void {
        this.cleanSubject.next();
    }
}
