import { Component, ElementRef, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
import { equal } from '../../shared/custom-methods';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../button/button.component";
import * as i3 from "./text-color-tile/text-color-tile.component";
export class TextColorComponent {
    constructor() {
        this.onColorChange = new EventEmitter();
        this.defaultColorName = 'Black';
        this.colors = [];
        this.isOpen = false;
        this.selectedColor = this.colors.find(col => col.colorName === this.defaultColorName);
        this.el = inject(ElementRef);
    }
    ngOnInit() {
        this.colors = this.colors.map(item => {
            if (item.colorName == this.defaultColorName) {
                item.selected = true;
                this.selectedColor = item;
            }
            else {
                item.selected = false;
            }
            return item;
        });
    }
    onHostClick(event) {
        if (this.isOpen) {
            const dropdown = this.el.nativeElement.querySelector('.universal-editor-dropdown-content-text-color');
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
            const dropdown = this.el.nativeElement.querySelector('.universal-editor-dropdown-content-text-color');
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
    onSelect(color) {
        this.setColor(color);
        this.onColorChange.emit(color);
    }
    setColor(color) {
        this.colors = this.colors.map(item => {
            if (equal(item, color)) {
                item.selected = true;
                this.selectedColor = item;
            }
            else {
                item.selected = false;
            }
            return item;
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: TextColorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: TextColorComponent, selector: "text-color", inputs: { defaultColorName: "defaultColorName", colors: "colors" }, outputs: { onColorChange: "onColorChange" }, host: { listeners: { "document:click": "onHostClick($event)" } }, ngImport: i0, template: "\n<div class=\"universal-editor-text-color\">\n\n    <universal-button [showIcon]=\"true\" tooltip=\"Text color\" [isOpen]=\"isOpen\">\n        <div \n        class=\"text-color\"\n        [style.background-color]=\"selectedColor?.colorName !==defaultColorName ? selectedColor?.colorCode : ''\"\n        [style.background-image]=\"selectedColor?.colorName !==defaultColorName ? 'none' : ''\"\n        ></div>A \n    </universal-button>\n\n    <div class=\"universal-editor-dropdown-content-text-color\">\n        <div class=\"universal-editor-dropdown-content-row\">\n            <div *ngFor=\"let color of colors\">\n                <text-color-tile\n                [colorName]=\"color.colorName\" \n                [colorCode]=\"color.colorCode\"\n                [selected]=\"color.selected\"\n                (click)=\"onSelect(color)\">\n                </text-color-tile>\n            </div>\n        </div>\n    </div>\n\n</div>", styles: [".text-color{background-image:linear-gradient(to top,red,#ff0,green,#00f);width:5px;height:15px;margin-right:4px;border-radius:4px}.universal-editor-dropdown-content-text-color{display:none;position:absolute;border-color:#8692a6;border-width:2px;border-style:solid;padding:6px;min-width:224px;max-width:230px}.universal-editor-dropdown-content-row{display:flex;flex-wrap:wrap;justify-content:left;align-items:center;gap:2px}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: i2.ButtonComponent, selector: "universal-button", inputs: ["showIcon", "isOpen", "isSelected", "isDisabled", "tooltip", "tooltipPosition"] }, { kind: "component", type: i3.TextColorTileComponent, selector: "text-color-tile", inputs: ["colorCode", "colorName", "selected"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: TextColorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'text-color', template: "\n<div class=\"universal-editor-text-color\">\n\n    <universal-button [showIcon]=\"true\" tooltip=\"Text color\" [isOpen]=\"isOpen\">\n        <div \n        class=\"text-color\"\n        [style.background-color]=\"selectedColor?.colorName !==defaultColorName ? selectedColor?.colorCode : ''\"\n        [style.background-image]=\"selectedColor?.colorName !==defaultColorName ? 'none' : ''\"\n        ></div>A \n    </universal-button>\n\n    <div class=\"universal-editor-dropdown-content-text-color\">\n        <div class=\"universal-editor-dropdown-content-row\">\n            <div *ngFor=\"let color of colors\">\n                <text-color-tile\n                [colorName]=\"color.colorName\" \n                [colorCode]=\"color.colorCode\"\n                [selected]=\"color.selected\"\n                (click)=\"onSelect(color)\">\n                </text-color-tile>\n            </div>\n        </div>\n    </div>\n\n</div>", styles: [".text-color{background-image:linear-gradient(to top,red,#ff0,green,#00f);width:5px;height:15px;margin-right:4px;border-radius:4px}.universal-editor-dropdown-content-text-color{display:none;position:absolute;border-color:#8692a6;border-width:2px;border-style:solid;padding:6px;min-width:224px;max-width:230px}.universal-editor-dropdown-content-row{display:flex;flex-wrap:wrap;justify-content:left;align-items:center;gap:2px}\n"] }]
        }], propDecorators: { onColorChange: [{
                type: Output
            }], defaultColorName: [{
                type: Input
            }], colors: [{
                type: Input
            }], onHostClick: [{
                type: HostListener,
                args: ['document:click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1jb2xvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtdW5pdmVyc2FsLWVkaXRvci9zcmMvbGliL2NvbXBvbmVudHMvdGV4dC1jb2xvci90ZXh0LWNvbG9yLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC11bml2ZXJzYWwtZWRpdG9yL3NyYy9saWIvY29tcG9uZW50cy90ZXh0LWNvbG9yL3RleHQtY29sb3IuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqSCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7Ozs7O0FBYXBELE1BQU0sT0FBTyxrQkFBa0I7SUFML0I7UUFTWSxrQkFBYSxHQUF3QixJQUFJLFlBQVksRUFBUyxDQUFDO1FBQ2hFLHFCQUFnQixHQUFHLE9BQU8sQ0FBQztRQUMzQixXQUFNLEdBQVcsRUFBRSxDQUFDO1FBRTdCLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZixrQkFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUVqRixPQUFFLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBNEV6QjtJQTFFQyxRQUFRO1FBQ04sSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNuQyxJQUFHLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFDO2dCQUN6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Q0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7YUFDdkI7WUFDRCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzsrR0FwRlUsa0JBQWtCO21HQUFsQixrQkFBa0IscU9DZC9CLDA2QkF3Qk07OzRGRFZPLGtCQUFrQjtrQkFMOUIsU0FBUzsrQkFDRSxZQUFZOzhCQVFaLGFBQWE7c0JBQXRCLE1BQU07Z0JBQ0UsZ0JBQWdCO3NCQUF4QixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFxQnNDLFdBQVc7c0JBQXRELFlBQVk7dUJBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZXF1YWwgfSBmcm9tICcuLi8uLi9zaGFyZWQvY3VzdG9tLW1ldGhvZHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbG9yIHtcbiAgY29sb3JOYW1lOiBzdHJpbmcsXG4gIGNvbG9yQ29kZTogc3RyaW5nLFxuICBzZWxlY3RlZDogYm9vbGVhblxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd0ZXh0LWNvbG9yJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3RleHQtY29sb3IuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi90ZXh0LWNvbG9yLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBUZXh0Q29sb3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXR7XG4gIFxuICBcblxuICBAT3V0cHV0KCkgb25Db2xvckNoYW5nZTogRXZlbnRFbWl0dGVyPENvbG9yPiA9IG5ldyBFdmVudEVtaXR0ZXI8Q29sb3I+KCk7XG4gIEBJbnB1dCgpIGRlZmF1bHRDb2xvck5hbWUgPSAnQmxhY2snO1xuICBASW5wdXQoKSBjb2xvcnM6Q29sb3JbXSA9IFtdO1xuXG4gIGlzT3BlbiA9IGZhbHNlO1xuICBzZWxlY3RlZENvbG9yID0gdGhpcy5jb2xvcnMuZmluZChjb2wgPT4gY29sLmNvbG9yTmFtZSA9PT0gdGhpcy5kZWZhdWx0Q29sb3JOYW1lKTtcblxuICBlbCA9IGluamVjdChFbGVtZW50UmVmKTtcblxuICBuZ09uSW5pdCgpe1xuICAgIHRoaXMuY29sb3JzID0gdGhpcy5jb2xvcnMubWFwKGl0ZW0gPT4ge1xuICAgICAgaWYoaXRlbS5jb2xvck5hbWUgPT0gdGhpcy5kZWZhdWx0Q29sb3JOYW1lKXtcbiAgICAgICAgaXRlbS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRDb2xvciA9IGl0ZW07XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBpdGVtLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlbTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snLCBbJyRldmVudCddKSBvbkhvc3RDbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmKHRoaXMuaXNPcGVuKSB7XG4gICAgICBjb25zdCBkcm9wZG93biA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudW5pdmVyc2FsLWVkaXRvci1kcm9wZG93bi1jb250ZW50LXRleHQtY29sb3InKTtcbiAgICAgIGRyb3Bkb3duLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgIH1cbiAgICBlbHNlIGlmKHRoaXMuZWwubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpKXtcbiAgICAgIHRoaXMub3BlbkRyb3Bkb3duKCk7XG4gICAgfVxuICB9XG5cbiAgb3BlbkRyb3Bkb3duKCl7XG4gICAgaWYoIXRoaXMuaXNPcGVuKXtcbiAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCBidXR0b25YID0gcmVjdC5sZWZ0ICsgd2luZG93LnNjcm9sbFg7XG4gICAgICBjb25zdCBidXR0b25ZID0gcmVjdC50b3AgKyB3aW5kb3cuc2Nyb2xsWTtcblxuICAgICAgY29uc3QgZHJvcGRvd24gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnVuaXZlcnNhbC1lZGl0b3ItZHJvcGRvd24tY29udGVudC10ZXh0LWNvbG9yJyk7XG4gICAgICBkcm9wZG93bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcbiAgICAgIGNvbnN0IGRyb3Bkb3duSGVpZ2h0ID0gZHJvcGRvd24uY2xpZW50SGVpZ2h0O1xuICAgICAgY29uc3QgZHJvcGRvd25XaWR0aCA9IGRyb3Bkb3duLm9mZnNldFdpZHRoO1xuICAgICAgY29uc3QgcmlnaHRXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gYnV0dG9uWDtcblxuICAgICAgaWYoYnV0dG9uWSA+IGRyb3Bkb3duSGVpZ2h0KXtcbiAgICAgICAgZHJvcGRvd24uc3R5bGUudG9wID0gYCR7YnV0dG9uWSAtIDE1IC0gZHJvcGRvd25IZWlnaHR9cHhgO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgZHJvcGRvd24uc3R5bGUudG9wID0gYCR7YnV0dG9uWSArIDMwfXB4YDtcbiAgICAgIH1cbiAgICAgIGlmKHJpZ2h0V2lkdGggPiBkcm9wZG93bldpZHRoKXtcbiAgICAgICAgZHJvcGRvd24uc3R5bGUubGVmdCA9IGAke2J1dHRvblh9cHhgO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgZHJvcGRvd24uc3R5bGUubGVmdCA9IGAke2J1dHRvblggLSAoZHJvcGRvd25XaWR0aCAtIHJpZ2h0V2lkdGgpfXB4YDtcbiAgICAgIH1cbiAgICAgIC8vY29uc29sZS5sb2coYnV0dG9uWCwgYnV0dG9uWSlcbiAgICB9XG4gICAgXG4gIH1cblxuICBvblNlbGVjdChjb2xvcjogQ29sb3Ipe1xuICAgIHRoaXMuc2V0Q29sb3IoY29sb3IpO1xuICAgIHRoaXMub25Db2xvckNoYW5nZS5lbWl0KGNvbG9yKTtcbiAgfVxuXG4gIHNldENvbG9yKGNvbG9yOkNvbG9yKXtcbiAgICB0aGlzLmNvbG9ycyA9IHRoaXMuY29sb3JzLm1hcChpdGVtID0+IHtcbiAgICAgIGlmKGVxdWFsKGl0ZW0sIGNvbG9yKSl7XG4gICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnNlbGVjdGVkQ29sb3IgPSBpdGVtO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgaXRlbS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfSk7XG4gIH1cblxuXG59XG4iLCJcbjxkaXYgY2xhc3M9XCJ1bml2ZXJzYWwtZWRpdG9yLXRleHQtY29sb3JcIj5cblxuICAgIDx1bml2ZXJzYWwtYnV0dG9uIFtzaG93SWNvbl09XCJ0cnVlXCIgdG9vbHRpcD1cIlRleHQgY29sb3JcIiBbaXNPcGVuXT1cImlzT3BlblwiPlxuICAgICAgICA8ZGl2IFxuICAgICAgICBjbGFzcz1cInRleHQtY29sb3JcIlxuICAgICAgICBbc3R5bGUuYmFja2dyb3VuZC1jb2xvcl09XCJzZWxlY3RlZENvbG9yPy5jb2xvck5hbWUgIT09ZGVmYXVsdENvbG9yTmFtZSA/IHNlbGVjdGVkQ29sb3I/LmNvbG9yQ29kZSA6ICcnXCJcbiAgICAgICAgW3N0eWxlLmJhY2tncm91bmQtaW1hZ2VdPVwic2VsZWN0ZWRDb2xvcj8uY29sb3JOYW1lICE9PWRlZmF1bHRDb2xvck5hbWUgPyAnbm9uZScgOiAnJ1wiXG4gICAgICAgID48L2Rpdj5BIFxuICAgIDwvdW5pdmVyc2FsLWJ1dHRvbj5cblxuICAgIDxkaXYgY2xhc3M9XCJ1bml2ZXJzYWwtZWRpdG9yLWRyb3Bkb3duLWNvbnRlbnQtdGV4dC1jb2xvclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwidW5pdmVyc2FsLWVkaXRvci1kcm9wZG93bi1jb250ZW50LXJvd1wiPlxuICAgICAgICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgY29sb3Igb2YgY29sb3JzXCI+XG4gICAgICAgICAgICAgICAgPHRleHQtY29sb3ItdGlsZVxuICAgICAgICAgICAgICAgIFtjb2xvck5hbWVdPVwiY29sb3IuY29sb3JOYW1lXCIgXG4gICAgICAgICAgICAgICAgW2NvbG9yQ29kZV09XCJjb2xvci5jb2xvckNvZGVcIlxuICAgICAgICAgICAgICAgIFtzZWxlY3RlZF09XCJjb2xvci5zZWxlY3RlZFwiXG4gICAgICAgICAgICAgICAgKGNsaWNrKT1cIm9uU2VsZWN0KGNvbG9yKVwiPlxuICAgICAgICAgICAgICAgIDwvdGV4dC1jb2xvci10aWxlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG48L2Rpdj4iXX0=