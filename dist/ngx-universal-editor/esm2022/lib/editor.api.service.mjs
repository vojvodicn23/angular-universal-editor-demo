import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class EditorApiService {
    constructor() {
        this.clearFormattingSubject = new Subject();
        this.boldSubject = new Subject();
        this.italicSubject = new Subject();
        this.underlineSubject = new Subject();
        this.strikethroughSubject = new Subject();
        this.subscriptSubject = new Subject();
        this.superscriptSubject = new Subject();
        this.mentionSubject = new Subject();
        this.textStyleSubject = new Subject();
        this.textColorSubject = new Subject();
        this.innerHTMLSubject = new Subject();
        this.bulletListSubject = new Subject();
        this.numberedListSubject = new Subject();
        this.clearFormatting$ = this.clearFormattingSubject.asObservable();
        this.bold$ = this.boldSubject.asObservable();
        this.italic$ = this.italicSubject.asObservable();
        this.underline$ = this.underlineSubject.asObservable();
        this.strikethrough$ = this.strikethroughSubject.asObservable();
        this.subscript$ = this.subscriptSubject.asObservable();
        this.superscript$ = this.superscriptSubject.asObservable();
        this.mention$ = this.mentionSubject.asObservable();
        this.textStyle$ = this.textStyleSubject.asObservable();
        this.textColor$ = this.textColorSubject.asObservable();
        this.innerHTML$ = this.innerHTMLSubject.asObservable();
        this.bulletList$ = this.bulletListSubject.asObservable();
        this.numberedList$ = this.numberedListSubject.asObservable();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: EditorApiService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: EditorApiService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: EditorApiService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmFwaS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXVuaXZlcnNhbC1lZGl0b3Ivc3JjL2xpYi9lZGl0b3IuYXBpLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUkvQixNQUFNLE9BQU8sZ0JBQWdCO0lBRDdCO1FBR0UsMkJBQXNCLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUM3QyxnQkFBVyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFDbEMsa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQ3BDLHFCQUFnQixHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFDdkMseUJBQW9CLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUMzQyxxQkFBZ0IsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQ3ZDLHVCQUFrQixHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFDekMsbUJBQWMsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQ3JDLHFCQUFnQixHQUFHLElBQUksT0FBTyxFQUFVLENBQUM7UUFDekMscUJBQWdCLEdBQUcsSUFBSSxPQUFPLEVBQVMsQ0FBQztRQUN4QyxxQkFBZ0IsR0FBRyxJQUFJLE9BQU8sRUFBcUIsQ0FBQztRQUNwRCxzQkFBaUIsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQ3hDLHdCQUFtQixHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFMUMscUJBQWdCLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzlELFVBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hDLFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzVDLGVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbEQsbUJBQWMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDMUQsZUFBVSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNsRCxpQkFBWSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0RCxhQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM5QyxlQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2xELGVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbEQsZUFBVSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNsRCxnQkFBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwRCxrQkFBYSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztLQUN6RDsrR0E3QlksZ0JBQWdCO21IQUFoQixnQkFBZ0I7OzRGQUFoQixnQkFBZ0I7a0JBRDVCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ29sb3IgfSBmcm9tICcuL2NvbXBvbmVudHMvdGV4dC1jb2xvci90ZXh0LWNvbG9yLmNvbXBvbmVudCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFZGl0b3JBcGlTZXJ2aWNlIHtcblxuICBjbGVhckZvcm1hdHRpbmdTdWJqZWN0ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgYm9sZFN1YmplY3QgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBpdGFsaWNTdWJqZWN0ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgdW5kZXJsaW5lU3ViamVjdCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHN0cmlrZXRocm91Z2hTdWJqZWN0ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgc3Vic2NyaXB0U3ViamVjdCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHN1cGVyc2NyaXB0U3ViamVjdCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIG1lbnRpb25TdWJqZWN0ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgdGV4dFN0eWxlU3ViamVjdCA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgdGV4dENvbG9yU3ViamVjdCA9IG5ldyBTdWJqZWN0PENvbG9yPigpO1xuICBpbm5lckhUTUxTdWJqZWN0ID0gbmV3IFN1YmplY3Q8c3RyaW5nIHwgU2FmZUh0bWw+KCk7XG4gIGJ1bGxldExpc3RTdWJqZWN0ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgbnVtYmVyZWRMaXN0U3ViamVjdCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY2xlYXJGb3JtYXR0aW5nJCA9IHRoaXMuY2xlYXJGb3JtYXR0aW5nU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgYm9sZCQgPSB0aGlzLmJvbGRTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICBpdGFsaWMkID0gdGhpcy5pdGFsaWNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICB1bmRlcmxpbmUkID0gdGhpcy51bmRlcmxpbmVTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICBzdHJpa2V0aHJvdWdoJCA9IHRoaXMuc3RyaWtldGhyb3VnaFN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIHN1YnNjcmlwdCQgPSB0aGlzLnN1YnNjcmlwdFN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIHN1cGVyc2NyaXB0JCA9IHRoaXMuc3VwZXJzY3JpcHRTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICBtZW50aW9uJCA9IHRoaXMubWVudGlvblN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIHRleHRTdHlsZSQgPSB0aGlzLnRleHRTdHlsZVN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIHRleHRDb2xvciQgPSB0aGlzLnRleHRDb2xvclN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIGlubmVySFRNTCQgPSB0aGlzLmlubmVySFRNTFN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIGJ1bGxldExpc3QkID0gdGhpcy5idWxsZXRMaXN0U3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgbnVtYmVyZWRMaXN0JCA9IHRoaXMubnVtYmVyZWRMaXN0U3ViamVjdC5hc09ic2VydmFibGUoKTtcbn1cbiJdfQ==