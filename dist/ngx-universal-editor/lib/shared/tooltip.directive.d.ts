import { ElementRef, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
export declare class TooltipDirective {
    private el;
    private renderer;
    tooltipText: string;
    tooltipPostition: string;
    tooltipElementPosition: 'relative' | 'absolute';
    tooltipElement: HTMLElement | undefined;
    timeoutId: any;
    hideTimeoutId: any;
    constructor(el: ElementRef, renderer: Renderer2);
    onMouseEnter(): void;
    onMouseLeave(): void;
    createTooltip(): void;
    destroyTooltip(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TooltipDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<TooltipDirective, "[tooltipText]", never, { "tooltipText": { "alias": "tooltipText"; "required": false; }; "tooltipPostition": { "alias": "tooltipPostition"; "required": false; }; "tooltipElementPosition": { "alias": "tooltipElementPosition"; "required": false; }; }, {}, never, never, false, never>;
}
