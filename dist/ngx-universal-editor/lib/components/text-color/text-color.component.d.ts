import { ElementRef, EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export interface Color {
    colorName: string;
    colorCode: string;
    selected: boolean;
}
export declare class TextColorComponent implements OnInit {
    onColorChange: EventEmitter<Color>;
    defaultColorName: string;
    colors: Color[];
    isOpen: boolean;
    selectedColor: Color | undefined;
    el: ElementRef<any>;
    ngOnInit(): void;
    onHostClick(event: MouseEvent): void;
    openDropdown(): void;
    onSelect(color: Color): void;
    setColor(color: Color): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TextColorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TextColorComponent, "text-color", never, { "defaultColorName": { "alias": "defaultColorName"; "required": false; }; "colors": { "alias": "colors"; "required": false; }; }, { "onColorChange": "onColorChange"; }, never, never, false, never>;
}
