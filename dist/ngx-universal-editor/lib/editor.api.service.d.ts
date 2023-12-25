import { SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { Color } from './components/text-color/text-color.component';
import * as i0 from "@angular/core";
export declare class EditorApiService {
    clearFormattingSubject: Subject<void>;
    boldSubject: Subject<void>;
    italicSubject: Subject<void>;
    underlineSubject: Subject<void>;
    strikethroughSubject: Subject<void>;
    subscriptSubject: Subject<void>;
    superscriptSubject: Subject<void>;
    mentionSubject: Subject<void>;
    textStyleSubject: Subject<string>;
    textColorSubject: Subject<Color>;
    innerHTMLSubject: Subject<string | SafeHtml>;
    bulletListSubject: Subject<void>;
    numberedListSubject: Subject<void>;
    clearFormatting$: import("rxjs").Observable<void>;
    bold$: import("rxjs").Observable<void>;
    italic$: import("rxjs").Observable<void>;
    underline$: import("rxjs").Observable<void>;
    strikethrough$: import("rxjs").Observable<void>;
    subscript$: import("rxjs").Observable<void>;
    superscript$: import("rxjs").Observable<void>;
    mention$: import("rxjs").Observable<void>;
    textStyle$: import("rxjs").Observable<string>;
    textColor$: import("rxjs").Observable<Color>;
    innerHTML$: import("rxjs").Observable<string | SafeHtml>;
    bulletList$: import("rxjs").Observable<void>;
    numberedList$: import("rxjs").Observable<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EditorApiService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EditorApiService>;
}
