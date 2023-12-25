import { Component, ElementRef, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../button/button.component";
export class TextStylesComponent {
    constructor() {
        this.onStyleChange = new EventEmitter();
        this.disabled = false;
        this.isOpen = false;
        this.selectedStyle = 'Normal text';
        this.pSelected = true;
        this.h1Selected = false;
        this.h2Selected = false;
        this.h3Selected = false;
        this.h4Selected = false;
        this.h5Selected = false;
        this.h6Selected = false;
        this.el = inject(ElementRef);
    }
    onHostClick(event) {
        if (this.isOpen) {
            const dropdown = this.el.nativeElement.querySelector('.universal-editor-dropdown-content-text-styles');
            dropdown.style.display = 'none';
            this.isOpen = false;
        }
        else if (this.el.nativeElement.contains(event.target)) {
            this.openDropdown();
        }
    }
    openDropdown() {
        if (!this.isOpen) {
            const rect = this.el.nativeElement.getBoundingClientRect();
            const buttonX = rect.left + window.scrollX;
            const buttonY = rect.top + window.scrollY;
            const dropdown = this.el.nativeElement.querySelector('.universal-editor-dropdown-content-text-styles');
            dropdown.style.display = 'block';
            this.isOpen = true;
            const dropdownHeight = dropdown.clientHeight;
            const dropdownWidth = dropdown.offsetWidth;
            const rightWidth = window.innerWidth - buttonX;
            if (buttonY > dropdownHeight) {
                dropdown.style.top = `${buttonY - 15 - dropdownHeight}px`;
            }
            else {
                dropdown.style.top = `${buttonY + 30}px`;
            }
            if (rightWidth > dropdownWidth) {
                dropdown.style.left = `${buttonX}px`;
            }
            else {
                dropdown.style.left = `${buttonX - (dropdownWidth - rightWidth)}px`;
            }
            //console.log(buttonX, buttonY)
        }
    }
    onSelect(style) {
        this.setStyle(style);
        this.onStyleChange.emit(style);
    }
    setStyle(style) {
        this.pSelected = false;
        this.h1Selected = false;
        this.h2Selected = false;
        this.h3Selected = false;
        this.h4Selected = false;
        this.h5Selected = false;
        this.h6Selected = false;
        if (style === 'p') {
            this.pSelected = true;
            this.selectedStyle = 'Normal text';
        }
        else if (style === 'h1') {
            this.h1Selected = true;
            this.selectedStyle = 'Heading 1';
        }
        else if (style === 'h2') {
            this.h2Selected = true;
            this.selectedStyle = 'Heading 2';
        }
        else if (style === 'h3') {
            this.h3Selected = true;
            this.selectedStyle = 'Heading 3';
        }
        else if (style === 'h4') {
            this.h4Selected = true;
            this.selectedStyle = 'Heading 4';
        }
        else if (style === 'h5') {
            this.h5Selected = true;
            this.selectedStyle = 'Heading 5';
        }
        else if (style === 'h6') {
            this.h6Selected = true;
            this.selectedStyle = 'Heading 6';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: TextStylesComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: TextStylesComponent, selector: "text-styles", inputs: { disabled: "disabled" }, outputs: { onStyleChange: "onStyleChange" }, host: { listeners: { "document:click": "onHostClick($event)" } }, ngImport: i0, template: "\n<div class=\"universal-editor-text-styles\">\n\n    <universal-button [showIcon]=\"true\" tooltip=\"Text styles\" [isOpen]=\"isOpen\" [isDisabled]=\"disabled\">\n        {{selectedStyle}}\n    </universal-button>\n\n    <div class=\"universal-editor-dropdown-content-text-styles\">\n        <div class=\"universal-editor-style\" (click)=\"onSelect('p')\" \n        [class.universal-editor-style-selected]=\"pSelected\">\n            <p style=\"margin-bottom: 0px;\">Normal text</p>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h1')\" \n        [class.universal-editor-style-selected]=\"h1Selected\">\n            <h1 style=\"margin-bottom: 0px;\">Heading 1</h1>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h2')\" \n        [class.universal-editor-style-selected]=\"h2Selected\">\n            <h2 style=\"margin-bottom: 0px;\">Heading 2</h2>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h3')\" \n        [class.universal-editor-style-selected]=\"h3Selected\">\n            <h3 style=\"margin-bottom: 0px;\">Heading 3</h3>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h4')\" \n        [class.universal-editor-style-selected]=\"h4Selected\">\n            <h4 style=\"margin-bottom: 0px;\">Heading 4</h4>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h5')\" \n        [class.universal-editor-style-selected]=\"h5Selected\">\n            <h5 style=\"margin-bottom: 0px;\">Heading 5</h5>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h6')\" \n        [class.universal-editor-style-selected]=\"h6Selected\">\n            <h6 style=\"margin-bottom: 0px;\">Heading 6</h6>\n        </div>\n    </div>\n\n</div>", styles: [".universal-editor-dropdown-content-text-styles{display:none;position:absolute;border-color:#8692a6;border-width:2px;border-style:solid}.universal-editor-style{padding:5px 14px;height:40px;display:flex;align-items:center}.universal-editor-style:hover{background-color:#d3d3d3}.universal-editor-style-selected{background-color:#add8e6}\n"], dependencies: [{ kind: "component", type: i1.ButtonComponent, selector: "universal-button", inputs: ["showIcon", "isOpen", "isSelected", "isDisabled", "tooltip", "tooltipPosition"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: TextStylesComponent, decorators: [{
            type: Component,
            args: [{ selector: 'text-styles', template: "\n<div class=\"universal-editor-text-styles\">\n\n    <universal-button [showIcon]=\"true\" tooltip=\"Text styles\" [isOpen]=\"isOpen\" [isDisabled]=\"disabled\">\n        {{selectedStyle}}\n    </universal-button>\n\n    <div class=\"universal-editor-dropdown-content-text-styles\">\n        <div class=\"universal-editor-style\" (click)=\"onSelect('p')\" \n        [class.universal-editor-style-selected]=\"pSelected\">\n            <p style=\"margin-bottom: 0px;\">Normal text</p>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h1')\" \n        [class.universal-editor-style-selected]=\"h1Selected\">\n            <h1 style=\"margin-bottom: 0px;\">Heading 1</h1>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h2')\" \n        [class.universal-editor-style-selected]=\"h2Selected\">\n            <h2 style=\"margin-bottom: 0px;\">Heading 2</h2>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h3')\" \n        [class.universal-editor-style-selected]=\"h3Selected\">\n            <h3 style=\"margin-bottom: 0px;\">Heading 3</h3>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h4')\" \n        [class.universal-editor-style-selected]=\"h4Selected\">\n            <h4 style=\"margin-bottom: 0px;\">Heading 4</h4>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h5')\" \n        [class.universal-editor-style-selected]=\"h5Selected\">\n            <h5 style=\"margin-bottom: 0px;\">Heading 5</h5>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h6')\" \n        [class.universal-editor-style-selected]=\"h6Selected\">\n            <h6 style=\"margin-bottom: 0px;\">Heading 6</h6>\n        </div>\n    </div>\n\n</div>", styles: [".universal-editor-dropdown-content-text-styles{display:none;position:absolute;border-color:#8692a6;border-width:2px;border-style:solid}.universal-editor-style{padding:5px 14px;height:40px;display:flex;align-items:center}.universal-editor-style:hover{background-color:#d3d3d3}.universal-editor-style-selected{background-color:#add8e6}\n"] }]
        }], propDecorators: { onStyleChange: [{
                type: Output
            }], disabled: [{
                type: Input
            }], onHostClick: [{
                type: HostListener,
                args: ['document:click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1zdHlsZXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXVuaXZlcnNhbC1lZGl0b3Ivc3JjL2xpYi9jb21wb25lbnRzL3RleHQtc3R5bGVzL3RleHQtc3R5bGVzLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC11bml2ZXJzYWwtZWRpdG9yL3NyYy9saWIvY29tcG9uZW50cy90ZXh0LXN0eWxlcy90ZXh0LXN0eWxlcy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQWEsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFPcEgsTUFBTSxPQUFPLG1CQUFtQjtJQUxoQztRQU9ZLGtCQUFhLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFDbEUsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUUxQixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2Ysa0JBQWEsR0FBRSxhQUFhLENBQUM7UUFDN0IsY0FBUyxHQUFHLElBQUksQ0FBQztRQUNqQixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ25CLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ25CLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixPQUFFLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBd0Z6QjtJQXJGNkMsV0FBVyxDQUFDLEtBQWlCO1FBQ3ZFLElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNkLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FB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QUksRUFBQztZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQztTQUNsQzthQUNJLElBQUcsS0FBSyxLQUFLLElBQUksRUFBQztZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQztTQUNsQzthQUNJLElBQUcsS0FBSyxLQUFLLElBQUksRUFBQztZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQztTQUNsQzthQUNJLElBQUcsS0FBSyxLQUFLLElBQUksRUFBQztZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQztTQUNsQzthQUNJLElBQUcsS0FBSyxLQUFLLElBQUksRUFBQztZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQztTQUNsQztJQUNILENBQUM7K0dBcEdVLG1CQUFtQjttR0FBbkIsbUJBQW1CLG9NQ1BoQyx1eURBc0NNOzs0RkQvQk8sbUJBQW1CO2tCQUwvQixTQUFTOytCQUNFLGFBQWE7OEJBTWIsYUFBYTtzQkFBdEIsTUFBTTtnQkFDRSxRQUFRO3NCQUFoQixLQUFLO2dCQWNzQyxXQUFXO3NCQUF0RCxZQUFZO3VCQUFDLGdCQUFnQixFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE91dHB1dCwgVmlld0NoaWxkLCBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAndGV4dC1zdHlsZXMnLFxuICB0ZW1wbGF0ZVVybDogJy4vdGV4dC1zdHlsZXMuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi90ZXh0LXN0eWxlcy5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgVGV4dFN0eWxlc0NvbXBvbmVudCB7XG5cbiAgQE91dHB1dCgpIG9uU3R5bGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG4gIEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgaXNPcGVuID0gZmFsc2U7XG4gIHNlbGVjdGVkU3R5bGUgPSdOb3JtYWwgdGV4dCc7XG4gIHBTZWxlY3RlZCA9IHRydWU7XG4gIGgxU2VsZWN0ZWQgPSBmYWxzZTtcbiAgaDJTZWxlY3RlZCA9IGZhbHNlO1xuICBoM1NlbGVjdGVkID0gZmFsc2U7XG4gIGg0U2VsZWN0ZWQgPSBmYWxzZTtcbiAgaDVTZWxlY3RlZCA9IGZhbHNlO1xuICBoNlNlbGVjdGVkID0gZmFsc2U7XG4gIGVsID0gaW5qZWN0KEVsZW1lbnRSZWYpO1xuXG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snLCBbJyRldmVudCddKSBvbkhvc3RDbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmKHRoaXMuaXNPcGVuKSB7XG4gICAgICBjb25zdCBkcm9wZG93biA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudW5pdmVyc2FsLWVkaXRvci1kcm9wZG93bi1jb250ZW50LXRleHQtc3R5bGVzJyk7XG4gICAgICBkcm9wZG93bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgICB9XG4gICAgZWxzZSBpZih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSl7XG4gICAgICB0aGlzLm9wZW5Ecm9wZG93bigpO1xuICAgIH1cbiAgfVxuXG5cbiAgb3BlbkRyb3Bkb3duKCl7XG4gICAgaWYoIXRoaXMuaXNPcGVuKXtcbiAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCBidXR0b25YID0gcmVjdC5sZWZ0ICsgd2luZG93LnNjcm9sbFg7XG4gICAgICBjb25zdCBidXR0b25ZID0gcmVjdC50b3AgKyB3aW5kb3cuc2Nyb2xsWTtcblxuICAgICAgY29uc3QgZHJvcGRvd24gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnVuaXZlcnNhbC1lZGl0b3ItZHJvcGRvd24tY29udGVudC10ZXh0LXN0eWxlcycpO1xuICAgICAgZHJvcGRvd24uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gICAgICBjb25zdCBkcm9wZG93bkhlaWdodCA9IGRyb3Bkb3duLmNsaWVudEhlaWdodDtcbiAgICAgIGNvbnN0IGRyb3Bkb3duV2lkdGggPSBkcm9wZG93bi5vZmZzZXRXaWR0aDtcbiAgICAgIGNvbnN0IHJpZ2h0V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAtIGJ1dHRvblg7XG5cbiAgICAgIGlmKGJ1dHRvblkgPiBkcm9wZG93bkhlaWdodCl7XG4gICAgICAgIGRyb3Bkb3duLnN0eWxlLnRvcCA9IGAke2J1dHRvblkgLSAxNSAtIGRyb3Bkb3duSGVpZ2h0fXB4YDtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIGRyb3Bkb3duLnN0eWxlLnRvcCA9IGAke2J1dHRvblkgKyAzMH1weGA7XG4gICAgICB9XG4gICAgICBpZihyaWdodFdpZHRoID4gZHJvcGRvd25XaWR0aCl7XG4gICAgICAgIGRyb3Bkb3duLnN0eWxlLmxlZnQgPSBgJHtidXR0b25YfXB4YDtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIGRyb3Bkb3duLnN0eWxlLmxlZnQgPSBgJHtidXR0b25YIC0gKGRyb3Bkb3duV2lkdGggLSByaWdodFdpZHRoKX1weGA7XG4gICAgICB9XG4gICAgICAvL2NvbnNvbGUubG9nKGJ1dHRvblgsIGJ1dHRvblkpXG4gICAgfVxuICAgIFxuICB9XG5cbiAgb25TZWxlY3Qoc3R5bGU6IHN0cmluZyl7XG4gICAgdGhpcy5zZXRTdHlsZShzdHlsZSk7XG4gICAgdGhpcy5vblN0eWxlQ2hhbmdlLmVtaXQoc3R5bGUpO1xuICB9XG5cbiAgc2V0U3R5bGUoc3R5bGU6c3RyaW5nKXtcbiAgICB0aGlzLnBTZWxlY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuaDFTZWxlY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuaDJTZWxlY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuaDNTZWxlY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuaDRTZWxlY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuaDVTZWxlY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuaDZTZWxlY3RlZCA9IGZhbHNlO1xuICAgIGlmKHN0eWxlID09PSAncCcpe1xuICAgICAgdGhpcy5wU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5zZWxlY3RlZFN0eWxlID0gJ05vcm1hbCB0ZXh0JztcbiAgICB9XG4gICAgZWxzZSBpZihzdHlsZSA9PT0gJ2gxJyl7XG4gICAgICB0aGlzLmgxU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5zZWxlY3RlZFN0eWxlID0gJ0hlYWRpbmcgMSc7XG4gICAgfVxuICAgIGVsc2UgaWYoc3R5bGUgPT09ICdoMicpe1xuICAgICAgdGhpcy5oMlNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRTdHlsZSA9ICdIZWFkaW5nIDInO1xuICAgIH1cbiAgICBlbHNlIGlmKHN0eWxlID09PSAnaDMnKXtcbiAgICAgIHRoaXMuaDNTZWxlY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLnNlbGVjdGVkU3R5bGUgPSAnSGVhZGluZyAzJztcbiAgICB9XG4gICAgZWxzZSBpZihzdHlsZSA9PT0gJ2g0Jyl7XG4gICAgICB0aGlzLmg0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5zZWxlY3RlZFN0eWxlID0gJ0hlYWRpbmcgNCc7XG4gICAgfVxuICAgIGVsc2UgaWYoc3R5bGUgPT09ICdoNScpe1xuICAgICAgdGhpcy5oNVNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRTdHlsZSA9ICdIZWFkaW5nIDUnO1xuICAgIH1cbiAgICBlbHNlIGlmKHN0eWxlID09PSAnaDYnKXtcbiAgICAgIHRoaXMuaDZTZWxlY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLnNlbGVjdGVkU3R5bGUgPSAnSGVhZGluZyA2JztcbiAgICB9XG4gIH1cblxufVxuIiwiXG48ZGl2IGNsYXNzPVwidW5pdmVyc2FsLWVkaXRvci10ZXh0LXN0eWxlc1wiPlxuXG4gICAgPHVuaXZlcnNhbC1idXR0b24gW3Nob3dJY29uXT1cInRydWVcIiB0b29sdGlwPVwiVGV4dCBzdHlsZXNcIiBbaXNPcGVuXT1cImlzT3BlblwiIFtpc0Rpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICAgIHt7c2VsZWN0ZWRTdHlsZX19XG4gICAgPC91bml2ZXJzYWwtYnV0dG9uPlxuXG4gICAgPGRpdiBjbGFzcz1cInVuaXZlcnNhbC1lZGl0b3ItZHJvcGRvd24tY29udGVudC10ZXh0LXN0eWxlc1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwidW5pdmVyc2FsLWVkaXRvci1zdHlsZVwiIChjbGljayk9XCJvblNlbGVjdCgncCcpXCIgXG4gICAgICAgIFtjbGFzcy51bml2ZXJzYWwtZWRpdG9yLXN0eWxlLXNlbGVjdGVkXT1cInBTZWxlY3RlZFwiPlxuICAgICAgICAgICAgPHAgc3R5bGU9XCJtYXJnaW4tYm90dG9tOiAwcHg7XCI+Tm9ybWFsIHRleHQ8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwidW5pdmVyc2FsLWVkaXRvci1zdHlsZVwiIChjbGljayk9XCJvblNlbGVjdCgnaDEnKVwiIFxuICAgICAgICBbY2xhc3MudW5pdmVyc2FsLWVkaXRvci1zdHlsZS1zZWxlY3RlZF09XCJoMVNlbGVjdGVkXCI+XG4gICAgICAgICAgICA8aDEgc3R5bGU9XCJtYXJnaW4tYm90dG9tOiAwcHg7XCI+SGVhZGluZyAxPC9oMT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ1bml2ZXJzYWwtZWRpdG9yLXN0eWxlXCIgKGNsaWNrKT1cIm9uU2VsZWN0KCdoMicpXCIgXG4gICAgICAgIFtjbGFzcy51bml2ZXJzYWwtZWRpdG9yLXN0eWxlLXNlbGVjdGVkXT1cImgyU2VsZWN0ZWRcIj5cbiAgICAgICAgICAgIDxoMiBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDBweDtcIj5IZWFkaW5nIDI8L2gyPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInVuaXZlcnNhbC1lZGl0b3Itc3R5bGVcIiAoY2xpY2spPVwib25TZWxlY3QoJ2gzJylcIiBcbiAgICAgICAgW2NsYXNzLnVuaXZlcnNhbC1lZGl0b3Itc3R5bGUtc2VsZWN0ZWRdPVwiaDNTZWxlY3RlZFwiPlxuICAgICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMHB4O1wiPkhlYWRpbmcgMzwvaDM+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwidW5pdmVyc2FsLWVkaXRvci1zdHlsZVwiIChjbGljayk9XCJvblNlbGVjdCgnaDQnKVwiIFxuICAgICAgICBbY2xhc3MudW5pdmVyc2FsLWVkaXRvci1zdHlsZS1zZWxlY3RlZF09XCJoNFNlbGVjdGVkXCI+XG4gICAgICAgICAgICA8aDQgc3R5bGU9XCJtYXJnaW4tYm90dG9tOiAwcHg7XCI+SGVhZGluZyA0PC9oND5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ1bml2ZXJzYWwtZWRpdG9yLXN0eWxlXCIgKGNsaWNrKT1cIm9uU2VsZWN0KCdoNScpXCIgXG4gICAgICAgIFtjbGFzcy51bml2ZXJzYWwtZWRpdG9yLXN0eWxlLXNlbGVjdGVkXT1cImg1U2VsZWN0ZWRcIj5cbiAgICAgICAgICAgIDxoNSBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDBweDtcIj5IZWFkaW5nIDU8L2g1PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInVuaXZlcnNhbC1lZGl0b3Itc3R5bGVcIiAoY2xpY2spPVwib25TZWxlY3QoJ2g2JylcIiBcbiAgICAgICAgW2NsYXNzLnVuaXZlcnNhbC1lZGl0b3Itc3R5bGUtc2VsZWN0ZWRdPVwiaDZTZWxlY3RlZFwiPlxuICAgICAgICAgICAgPGg2IHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMHB4O1wiPkhlYWRpbmcgNjwvaDY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG48L2Rpdj4iXX0=