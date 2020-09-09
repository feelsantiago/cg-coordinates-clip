import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ViewService {
    private readonly cleanSubject: Subject<void>;

    private readonly metadataSubject: Subject<unknown>;

    public get clean$(): Observable<void> {
        return this.cleanSubject.asObservable();
    }

    public get metadata$(): Observable<unknown> {
        return this.metadataSubject.asObservable();
    }

    constructor() {
        this.cleanSubject = new Subject();
        this.metadataSubject = new Subject();
    }

    public clean(): void {
        this.cleanSubject.next();
    }

    public sendMetadata(metadata: unknown): void {
        this.metadataSubject.next(metadata);
    }
}
