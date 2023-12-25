import { ElementRef, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class TextStylesComponent {
    onStyleChange: EventEmitter<string>;
    disabled: boolean;
    isOpen: boolean;
    selectedStyle: string;
    pSelected: boolean;
    h1Selected: boolean;
    h2Selected: boolean;
    h3Selected: boolean;
    h4Selected: boolean;
    h5Selected: boolean;
    h6Selected: boolean;
    el: ElementRef<any>;
    onHostClick(event: MouseEvent): void;
    openDropdown(): void;
    onSelect(style: string): void;
    setStyle(style: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TextStylesComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TextStylesComponent, "text-styles", never, { "disabled": { "alias": "disabled"; "required": false; }; }, { "onStyleChange": "onStyleChange"; }, never, never, false, never>;
}
