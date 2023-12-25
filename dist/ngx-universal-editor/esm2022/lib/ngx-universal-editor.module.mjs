import { NgModule } from '@angular/core';
import { NgxUniversalEditorComponent } from './ngx-universal-editor.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { MentionUserComponent } from './components/mention-user/mention-user.component';
import { TextStylesComponent } from './components/text-styles/text-styles.component';
import { TooltipDirective } from './shared/tooltip.directive';
import { VerticalLineComponent } from './components/vertical-line/vertical-line.component';
import { TextColorComponent } from './components/text-color/text-color.component';
import { TextColorTileComponent } from './components/text-color/text-color-tile/text-color-tile.component';
import * as i0 from "@angular/core";
export class NgxUniversalEditorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxUniversalEditorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: NgxUniversalEditorModule, declarations: [NgxUniversalEditorComponent,
            MentionUserComponent,
            TextStylesComponent,
            ButtonComponent,
            TooltipDirective,
            VerticalLineComponent,
            TextColorComponent,
            TextColorTileComponent], imports: [CommonModule], exports: [NgxUniversalEditorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxUniversalEditorModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxUniversalEditorModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        NgxUniversalEditorComponent,
                        MentionUserComponent,
                        TextStylesComponent,
                        ButtonComponent,
                        TooltipDirective,
                        VerticalLineComponent,
                        TextColorComponent,
                        TextColorTileComponent,
                    ],
                    imports: [
                        CommonModule
                    ],
                    exports: [
                        NgxUniversalEditorComponent
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXVuaXZlcnNhbC1lZGl0b3IubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXVuaXZlcnNhbC1lZGl0b3Ivc3JjL2xpYi9uZ3gtdW5pdmVyc2FsLWVkaXRvci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzlELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQzNGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLG1FQUFtRSxDQUFDOztBQXNCM0csTUFBTSxPQUFPLHdCQUF3QjsrR0FBeEIsd0JBQXdCO2dIQUF4Qix3QkFBd0IsaUJBaEJqQywyQkFBMkI7WUFDM0Isb0JBQW9CO1lBQ3BCLG1CQUFtQjtZQUNuQixlQUFlO1lBQ2YsZ0JBQWdCO1lBQ2hCLHFCQUFxQjtZQUNyQixrQkFBa0I7WUFDbEIsc0JBQXNCLGFBR3RCLFlBQVksYUFHWiwyQkFBMkI7Z0hBR2xCLHdCQUF3QixZQU5qQyxZQUFZOzs0RkFNSCx3QkFBd0I7a0JBbEJwQyxRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRTt3QkFDWiwyQkFBMkI7d0JBQzNCLG9CQUFvQjt3QkFDcEIsbUJBQW1CO3dCQUNuQixlQUFlO3dCQUNmLGdCQUFnQjt3QkFDaEIscUJBQXFCO3dCQUNyQixrQkFBa0I7d0JBQ2xCLHNCQUFzQjtxQkFDdkI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLFlBQVk7cUJBQ2I7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLDJCQUEyQjtxQkFDNUI7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBOZ3hVbml2ZXJzYWxFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL25neC11bml2ZXJzYWwtZWRpdG9yLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEJ1dHRvbkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9idXR0b24vYnV0dG9uLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE1lbnRpb25Vc2VyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL21lbnRpb24tdXNlci9tZW50aW9uLXVzZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgVGV4dFN0eWxlc0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90ZXh0LXN0eWxlcy90ZXh0LXN0eWxlcy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBUb29sdGlwRGlyZWN0aXZlIH0gZnJvbSAnLi9zaGFyZWQvdG9vbHRpcC5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBWZXJ0aWNhbExpbmVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdmVydGljYWwtbGluZS92ZXJ0aWNhbC1saW5lLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRleHRDb2xvckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90ZXh0LWNvbG9yL3RleHQtY29sb3IuY29tcG9uZW50JztcclxuaW1wb3J0IHsgVGV4dENvbG9yVGlsZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90ZXh0LWNvbG9yL3RleHQtY29sb3ItdGlsZS90ZXh0LWNvbG9yLXRpbGUuY29tcG9uZW50JztcclxuXHJcblxyXG5cclxuQE5nTW9kdWxlKHtcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIE5neFVuaXZlcnNhbEVkaXRvckNvbXBvbmVudCxcclxuICAgIE1lbnRpb25Vc2VyQ29tcG9uZW50LFxyXG4gICAgVGV4dFN0eWxlc0NvbXBvbmVudCxcclxuICAgIEJ1dHRvbkNvbXBvbmVudCxcclxuICAgIFRvb2x0aXBEaXJlY3RpdmUsXHJcbiAgICBWZXJ0aWNhbExpbmVDb21wb25lbnQsXHJcbiAgICBUZXh0Q29sb3JDb21wb25lbnQsXHJcbiAgICBUZXh0Q29sb3JUaWxlQ29tcG9uZW50LFxyXG4gIF0sXHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBOZ3hVbml2ZXJzYWxFZGl0b3JDb21wb25lbnRcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hVbml2ZXJzYWxFZGl0b3JNb2R1bGUgeyB9XHJcbiJdfQ==