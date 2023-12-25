import * as i0 from '@angular/core';
import { Injectable, Component, Input, Directive, HostListener, EventEmitter, inject, ElementRef, Output, ViewChild, NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';

class UniversalEditorConfig {
    constructor(config = {}) {
        this.placeholderText = config.placeholderText ?? '';
        this.enableClearFormatting = config.enableClearFormatting ?? true;
        this.enableBold = config.enableBold ?? true;
        this.enableItalic = config.enableItalic ?? true;
        this.enableUnderline = config.enableUnderline ?? true;
        this.enableStrikethrough = config.enableStrikethrough ?? true;
        this.enableSubscript = config.enableSubscript ?? true;
        this.enableSuperscript = config.enableSuperscript ?? true;
        this.enableMention = config.enableMention ?? true;
        this.enableTextStyles = config.enableTextStyles ?? true;
        this.enableTextColor = config.enableTextColor ?? true;
        this.showToolbar = config.showToolbar ?? true;
        this.contenteditable = config.contenteditable ?? true;
        this.mentionPosition = config.mentionPosition ?? 'auto';
        this.initialInnerHTML = config.initialInnerHTML ?? '';
        this.defaultTextColor = config.defaultTextColor ?? 'Black';
        this.enableBulletList = config.enableBulletList ?? true;
        this.enableNumberedList = config.enableNumberedList ?? true;
    }
}

const Const = {
    colors: [
        { colorName: 'Black', colorCode: '#000000', selected: false },
        { colorName: 'White', colorCode: '#FFFFFF', selected: false },
        { colorName: 'Red', colorCode: '#FF0000', selected: false },
        { colorName: 'Green', colorCode: '#008000', selected: false },
        { colorName: 'Blue', colorCode: '#0000FF', selected: false },
        { colorName: 'Yellow', colorCode: '#FFFF00', selected: false },
        { colorName: 'Cyan', colorCode: '#00FFFF', selected: false },
        { colorName: 'Magenta', colorCode: '#FF00FF', selected: false },
        { colorName: 'Silver', colorCode: '#C0C0C0', selected: false },
        { colorName: 'Gray', colorCode: '#808080', selected: false },
        { colorName: 'Maroon', colorCode: '#800000', selected: false },
        { colorName: 'Olive', colorCode: '#808000', selected: false },
        { colorName: 'Purple', colorCode: '#800080', selected: false },
        { colorName: 'Teal', colorCode: '#008080', selected: false },
        { colorName: 'Navy', colorCode: '#000080', selected: false },
        { colorName: 'Coral', colorCode: '#FF7F50', selected: false },
        { colorName: 'Turquoise', colorCode: '#40E0D0', selected: false },
        { colorName: 'Salmon', colorCode: '#FA8072', selected: false },
        { colorName: 'Lime', colorCode: '#00FF00', selected: false },
        { colorName: 'Gold', colorCode: '#FFD700', selected: false },
        { colorName: 'Orchid', colorCode: '#DA70D6', selected: false }
    ],
};

class EditorApi {
    constructor(service) {
        this.service = service;
    }
    clearFormatting() {
        this.service.clearFormattingSubject.next();
    }
    triggerBold() {
        this.service.boldSubject.next();
    }
    triggerItalic() {
        this.service.italicSubject.next();
    }
    triggerUnderline() {
        this.service.underlineSubject.next();
    }
    triggerStrikethrough() {
        this.service.strikethroughSubject.next();
    }
    triggerSubscript() {
        this.service.subscriptSubject.next();
    }
    triggerSuperscript() {
        this.service.superscriptSubject.next();
    }
    triggerMention() {
        this.service.mentionSubject.next();
    }
    setTextStyle(style) {
        this.service.textStyleSubject.next(style);
    }
    setTextColor(color) {
        const item = Const.colors.find(col => col.colorName === color);
        if (item) {
            this.service.textColorSubject.next(item);
        }
    }
    setInnerHTML(html) {
        this.service.innerHTMLSubject.next(html);
    }
    triggerBulletList() {
        this.service.bulletListSubject.next();
    }
    triggerNumberedList() {
        this.service.numberedListSubject.next();
    }
}

class EditorApiService {
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

function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function equal(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

class MentionUserComponent {
    get initials() {
        const firstNameInitial = this.user ? this.user.firstName.charAt(0).toUpperCase() : '';
        const lastNameInitial = this.user ? this.user.lastName.charAt(0).toUpperCase() : '';
        return `${firstNameInitial}${lastNameInitial}`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: MentionUserComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: MentionUserComponent, selector: "mention-user", inputs: { user: "user" }, ngImport: i0, template: "\n<div class=\"universal-editor-user\"  [class.selected]=\"user?.isMouseEntered\">\n    <div class=\"universal-editor-user-image\">\n\n        <div class=\"universal-editor-user-avatar-image\" *ngIf=\"user?.imageUrl\">\n            <img [src]=\"user.imageUrl\" alt=\"Random Unsplash Image\" width=\"32\" height=\"32\" style=\"border-radius: 50%;\">\n        </div>\n\n        <div class=\"universal-editor-user-avatar\" *ngIf=\"!user?.imageUrl\">\n            {{initials}}\n        </div>\n    </div>\n    <div class=\"universal-editor-user-info\">\n        <div class=\"universal-editor-user-fullname\">{{user?.firstName}} {{user?.lastName}}</div>\n        <div class=\"universal-editor-user-email\">{{user?.email}}</div>\n    </div>\n</div>", styles: [".universal-editor-user{display:flex;flex-direction:row;justify-content:left;align-items:center;background-color:#fff;cursor:pointer;padding:5px}.selected{background-color:#d3d3d3}.universal-editor-user-image{width:40px;height:40px;display:flex;align-items:center;justify-content:center}.universal-editor-user-avatar{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background-color:#7fffd4;color:#000;font-size:16px;line-height:1;text-align:center}.universal-editor-user-avatar-image{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: MentionUserComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mention-user', template: "\n<div class=\"universal-editor-user\"  [class.selected]=\"user?.isMouseEntered\">\n    <div class=\"universal-editor-user-image\">\n\n        <div class=\"universal-editor-user-avatar-image\" *ngIf=\"user?.imageUrl\">\n            <img [src]=\"user.imageUrl\" alt=\"Random Unsplash Image\" width=\"32\" height=\"32\" style=\"border-radius: 50%;\">\n        </div>\n\n        <div class=\"universal-editor-user-avatar\" *ngIf=\"!user?.imageUrl\">\n            {{initials}}\n        </div>\n    </div>\n    <div class=\"universal-editor-user-info\">\n        <div class=\"universal-editor-user-fullname\">{{user?.firstName}} {{user?.lastName}}</div>\n        <div class=\"universal-editor-user-email\">{{user?.email}}</div>\n    </div>\n</div>", styles: [".universal-editor-user{display:flex;flex-direction:row;justify-content:left;align-items:center;background-color:#fff;cursor:pointer;padding:5px}.selected{background-color:#d3d3d3}.universal-editor-user-image{width:40px;height:40px;display:flex;align-items:center;justify-content:center}.universal-editor-user-avatar{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background-color:#7fffd4;color:#000;font-size:16px;line-height:1;text-align:center}.universal-editor-user-avatar-image{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%}\n"] }]
        }], propDecorators: { user: [{
                type: Input
            }] } });

class TooltipDirective {
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.tooltipText = '';
        this.tooltipPostition = 'above';
        this.tooltipElementPosition = 'relative';
    }
    onMouseEnter() {
        if (this.hideTimeoutId) {
            clearTimeout(this.hideTimeoutId);
        }
        this.createTooltip();
    }
    onMouseLeave() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.destroyTooltip();
    }
    createTooltip() {
        this.timeoutId = setTimeout(() => {
            if (!this.tooltipElement) {
                this.tooltipElement = this.renderer.createElement('div');
                this.renderer.addClass(this.tooltipElement, 'tooltip');
                if (this.tooltipElement) {
                    this.tooltipElement.textContent = this.tooltipText;
                    this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);
                    const hostPos = this.el.nativeElement.getBoundingClientRect();
                    const tooltipPos = this.tooltipElement.getBoundingClientRect();
                    let top = hostPos.top - tooltipPos.height - 5;
                    if (this.tooltipPostition === 'bellow') {
                        top = hostPos.top + tooltipPos.height + 10;
                    }
                    let left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
                    if (this.tooltipElementPosition === 'absolute') {
                        top = tooltipPos.height + 10;
                        left = (hostPos.width - tooltipPos.width) / 2;
                    }
                    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
                    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
                    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
                }
            }
        }, 400);
    }
    destroyTooltip() {
        if (this.hideTimeoutId) {
            clearTimeout(this.hideTimeoutId);
        }
        this.hideTimeoutId = setTimeout(() => {
            if (this.tooltipElement) {
                this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
                this.tooltipElement = undefined;
            }
        }, 400);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: TooltipDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.12", type: TooltipDirective, selector: "[tooltipText]", inputs: { tooltipText: "tooltipText", tooltipPostition: "tooltipPostition", tooltipElementPosition: "tooltipElementPosition" }, host: { listeners: { "mouseenter": "onMouseEnter()", "mouseleave": "onMouseLeave()" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: TooltipDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tooltipText]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { tooltipText: [{
                type: Input
            }], tooltipPostition: [{
                type: Input
            }], tooltipElementPosition: [{
                type: Input
            }], onMouseEnter: [{
                type: HostListener,
                args: ['mouseenter']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }] } });

class ButtonComponent {
    constructor() {
        this.showIcon = false;
        this.isOpen = false;
        this.isSelected = false;
        this.isDisabled = false;
        this.tooltip = '';
        this.tooltipPosition = 'above';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: ButtonComponent, selector: "universal-button", inputs: { showIcon: "showIcon", isOpen: "isOpen", isSelected: "isSelected", isDisabled: "isDisabled", tooltip: "tooltip", tooltipPosition: "tooltipPosition" }, ngImport: i0, template: "<button \n    class=\"universal-editor-button\"\n    [class.selected]=\"isSelected\"    \n    [tooltipText]=\"tooltip\"\n    [tooltipPostition]=\"tooltipPosition\"\n    [disabled]=\"isDisabled\"\n    >\n    <ng-content></ng-content>\n    <span\n    class=\"universal-editor-button-icon\"\n    *ngIf=\"showIcon\"\n    [class.universal-editor-button-icon-expanded]=\"isOpen\"\n    >\n    </span>\n</button>", styles: [".universal-editor-button{align-items:center;border-radius:3px;border:none;background-color:transparent;font-weight:500;text-align:center;cursor:pointer;display:inline-flex;font-size:inherit;padding:0 4px;height:30px;transition:.5s}.universal-editor-button:not(:disabled):hover{background-color:#d3d3d3}.selected{font-weight:700;color:#00f;background-color:#add8e6}.universal-editor-button-icon{background-size:22px;background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2224%22 viewBox%3D%220 -960 960 960%22 width%3D%2224%22%3E%3Cpath d%3D%22M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z%22%2F%3E%3C%2Fsvg%3E\");background-position:center center;background-repeat:no-repeat;width:22px;height:22px;display:inline-block;position:relative;vertical-align:middle;margin-left:2px;top:1px}.universal-editor-button-icon-expanded{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2224%22 viewBox%3D%220 -960 960 960%22 width%3D%2224%22%3E%3Cpath d%3D%22m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z%22%2F%3E%3C%2Fsvg%3E\")}.universal-editor-button:disabled{color:#d3d3d3;cursor:not-allowed}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: TooltipDirective, selector: "[tooltipText]", inputs: ["tooltipText", "tooltipPostition", "tooltipElementPosition"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'universal-button', template: "<button \n    class=\"universal-editor-button\"\n    [class.selected]=\"isSelected\"    \n    [tooltipText]=\"tooltip\"\n    [tooltipPostition]=\"tooltipPosition\"\n    [disabled]=\"isDisabled\"\n    >\n    <ng-content></ng-content>\n    <span\n    class=\"universal-editor-button-icon\"\n    *ngIf=\"showIcon\"\n    [class.universal-editor-button-icon-expanded]=\"isOpen\"\n    >\n    </span>\n</button>", styles: [".universal-editor-button{align-items:center;border-radius:3px;border:none;background-color:transparent;font-weight:500;text-align:center;cursor:pointer;display:inline-flex;font-size:inherit;padding:0 4px;height:30px;transition:.5s}.universal-editor-button:not(:disabled):hover{background-color:#d3d3d3}.selected{font-weight:700;color:#00f;background-color:#add8e6}.universal-editor-button-icon{background-size:22px;background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2224%22 viewBox%3D%220 -960 960 960%22 width%3D%2224%22%3E%3Cpath d%3D%22M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z%22%2F%3E%3C%2Fsvg%3E\");background-position:center center;background-repeat:no-repeat;width:22px;height:22px;display:inline-block;position:relative;vertical-align:middle;margin-left:2px;top:1px}.universal-editor-button-icon-expanded{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2224%22 viewBox%3D%220 -960 960 960%22 width%3D%2224%22%3E%3Cpath d%3D%22m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z%22%2F%3E%3C%2Fsvg%3E\")}.universal-editor-button:disabled{color:#d3d3d3;cursor:not-allowed}\n"] }]
        }], propDecorators: { showIcon: [{
                type: Input
            }], isOpen: [{
                type: Input
            }], isSelected: [{
                type: Input
            }], isDisabled: [{
                type: Input
            }], tooltip: [{
                type: Input
            }], tooltipPosition: [{
                type: Input
            }] } });

class TextStylesComponent {
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
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: TextStylesComponent, selector: "text-styles", inputs: { disabled: "disabled" }, outputs: { onStyleChange: "onStyleChange" }, host: { listeners: { "document:click": "onHostClick($event)" } }, ngImport: i0, template: "\n<div class=\"universal-editor-text-styles\">\n\n    <universal-button [showIcon]=\"true\" tooltip=\"Text styles\" [isOpen]=\"isOpen\" [isDisabled]=\"disabled\">\n        {{selectedStyle}}\n    </universal-button>\n\n    <div class=\"universal-editor-dropdown-content-text-styles\">\n        <div class=\"universal-editor-style\" (click)=\"onSelect('p')\" \n        [class.universal-editor-style-selected]=\"pSelected\">\n            <p style=\"margin-bottom: 0px;\">Normal text</p>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h1')\" \n        [class.universal-editor-style-selected]=\"h1Selected\">\n            <h1 style=\"margin-bottom: 0px;\">Heading 1</h1>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h2')\" \n        [class.universal-editor-style-selected]=\"h2Selected\">\n            <h2 style=\"margin-bottom: 0px;\">Heading 2</h2>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h3')\" \n        [class.universal-editor-style-selected]=\"h3Selected\">\n            <h3 style=\"margin-bottom: 0px;\">Heading 3</h3>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h4')\" \n        [class.universal-editor-style-selected]=\"h4Selected\">\n            <h4 style=\"margin-bottom: 0px;\">Heading 4</h4>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h5')\" \n        [class.universal-editor-style-selected]=\"h5Selected\">\n            <h5 style=\"margin-bottom: 0px;\">Heading 5</h5>\n        </div>\n        <div class=\"universal-editor-style\" (click)=\"onSelect('h6')\" \n        [class.universal-editor-style-selected]=\"h6Selected\">\n            <h6 style=\"margin-bottom: 0px;\">Heading 6</h6>\n        </div>\n    </div>\n\n</div>", styles: [".universal-editor-dropdown-content-text-styles{display:none;position:absolute;border-color:#8692a6;border-width:2px;border-style:solid}.universal-editor-style{padding:5px 14px;height:40px;display:flex;align-items:center}.universal-editor-style:hover{background-color:#d3d3d3}.universal-editor-style-selected{background-color:#add8e6}\n"], dependencies: [{ kind: "component", type: ButtonComponent, selector: "universal-button", inputs: ["showIcon", "isOpen", "isSelected", "isDisabled", "tooltip", "tooltipPosition"] }] }); }
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

class VerticalLineComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: VerticalLineComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: VerticalLineComponent, selector: "vertical-line", ngImport: i0, template: "<div class=\"universal-editor-vertical-line\"></div>\n", styles: [".universal-editor-vertical-line{border-left:2px solid gray;height:25px;margin:0 10px}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: VerticalLineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'vertical-line', template: "<div class=\"universal-editor-vertical-line\"></div>\n", styles: [".universal-editor-vertical-line{border-left:2px solid gray;height:25px;margin:0 10px}\n"] }]
        }] });

class TextColorTileComponent {
    constructor() {
        this.colorCode = 'gray';
        this.colorName = 'Default';
        this.selected = false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: TextColorTileComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: TextColorTileComponent, selector: "text-color-tile", inputs: { colorCode: "colorCode", colorName: "colorName", selected: "selected" }, ngImport: i0, template: "<div class=\"color-tile-border\">\n    <div \n    class=\"color-tile\"\n    [tooltipText]=\"colorName\" \n    [tooltipPostition]=\"'below'\"\n    [tooltipElementPosition]=\"'absolute'\"\n    [style.background-color]=\"colorCode\"\n    >\n    <svg *ngIf=\"selected\" class=\"selected-icon\" [attr.fill]=\"'white'\"\n    xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 -960 960 960\" width=\"24\">\n        <path d=\"M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z\"/>\n    </svg>\n</div>\n\n\n", styles: [".color-tile-border{border:1px transparent solid;padding:1px;border-radius:4px}.color-tile{width:26px;height:26px;border-radius:4px;position:relative;cursor:pointer}.color-tile-border:hover{border-color:#d3d3d3}.selected-icon{background-size:22px;background-position:center center;background-repeat:no-repeat;width:22px;height:22px;display:inline-block;position:relative;vertical-align:middle;left:2px;top:1px}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: TooltipDirective, selector: "[tooltipText]", inputs: ["tooltipText", "tooltipPostition", "tooltipElementPosition"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: TextColorTileComponent, decorators: [{
            type: Component,
            args: [{ selector: 'text-color-tile', template: "<div class=\"color-tile-border\">\n    <div \n    class=\"color-tile\"\n    [tooltipText]=\"colorName\" \n    [tooltipPostition]=\"'below'\"\n    [tooltipElementPosition]=\"'absolute'\"\n    [style.background-color]=\"colorCode\"\n    >\n    <svg *ngIf=\"selected\" class=\"selected-icon\" [attr.fill]=\"'white'\"\n    xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 -960 960 960\" width=\"24\">\n        <path d=\"M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z\"/>\n    </svg>\n</div>\n\n\n", styles: [".color-tile-border{border:1px transparent solid;padding:1px;border-radius:4px}.color-tile{width:26px;height:26px;border-radius:4px;position:relative;cursor:pointer}.color-tile-border:hover{border-color:#d3d3d3}.selected-icon{background-size:22px;background-position:center center;background-repeat:no-repeat;width:22px;height:22px;display:inline-block;position:relative;vertical-align:middle;left:2px;top:1px}\n"] }]
        }], propDecorators: { colorCode: [{
                type: Input
            }], colorName: [{
                type: Input
            }], selected: [{
                type: Input
            }] } });

class TextColorComponent {
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
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: TextColorComponent, selector: "text-color", inputs: { defaultColorName: "defaultColorName", colors: "colors" }, outputs: { onColorChange: "onColorChange" }, host: { listeners: { "document:click": "onHostClick($event)" } }, ngImport: i0, template: "\n<div class=\"universal-editor-text-color\">\n\n    <universal-button [showIcon]=\"true\" tooltip=\"Text color\" [isOpen]=\"isOpen\">\n        <div \n        class=\"text-color\"\n        [style.background-color]=\"selectedColor?.colorName !==defaultColorName ? selectedColor?.colorCode : ''\"\n        [style.background-image]=\"selectedColor?.colorName !==defaultColorName ? 'none' : ''\"\n        ></div>A \n    </universal-button>\n\n    <div class=\"universal-editor-dropdown-content-text-color\">\n        <div class=\"universal-editor-dropdown-content-row\">\n            <div *ngFor=\"let color of colors\">\n                <text-color-tile\n                [colorName]=\"color.colorName\" \n                [colorCode]=\"color.colorCode\"\n                [selected]=\"color.selected\"\n                (click)=\"onSelect(color)\">\n                </text-color-tile>\n            </div>\n        </div>\n    </div>\n\n</div>", styles: [".text-color{background-image:linear-gradient(to top,red,#ff0,green,#00f);width:5px;height:15px;margin-right:4px;border-radius:4px}.universal-editor-dropdown-content-text-color{display:none;position:absolute;border-color:#8692a6;border-width:2px;border-style:solid;padding:6px;min-width:224px;max-width:230px}.universal-editor-dropdown-content-row{display:flex;flex-wrap:wrap;justify-content:left;align-items:center;gap:2px}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: ButtonComponent, selector: "universal-button", inputs: ["showIcon", "isOpen", "isSelected", "isDisabled", "tooltip", "tooltipPosition"] }, { kind: "component", type: TextColorTileComponent, selector: "text-color-tile", inputs: ["colorCode", "colorName", "selected"] }] }); }
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

class NgxUniversalEditorComponent {
    constructor() {
        this.IS_PREMIUM = true;
        this.config = new UniversalEditorConfig();
        this.mentionUsers = [];
        this.onChangeText = new EventEmitter();
        this.onEditorReady = new EventEmitter();
        this.onChangeIds = new EventEmitter();
        this.editorWidth = 1000;
        this.textColors = Const.colors;
        this.el = inject(ElementRef);
        this.sanitizer = inject(DomSanitizer);
        this.apiService = inject(EditorApiService);
        this.subscriptions = new Subscription();
        //BULLET LIST
        this.isBulletList = false;
        //NUMBERED LIST
        this.isNumberedList = false;
        this.textStyle = 'p';
        this.selectedText = '';
        // BOLD
        this.isBold = false;
        // ITALIC
        this.isItalic = false;
        // UNDERLINE
        this.isUnderline = false;
        // STRIKETROUGH
        this.isStrikethrough = false;
        // SUBSCRIPT
        this.isSubscript = false;
        // SUPERSCRIPT
        this.isSuperscript = false;
        // MENTION PART
        this.isMentionDropdownOpen = false;
        this.filteredUsers = [];
        this.searchUserText = '';
    }
    ngOnInit() {
        this.subscriptions.add(this.apiService.bold$.subscribe(() => this.onSelectBold()));
        this.subscriptions.add(this.apiService.italic$.subscribe(() => this.onSelectItalic()));
        this.subscriptions.add(this.apiService.underline$.subscribe(() => this.onSelectUnderline()));
        this.subscriptions.add(this.apiService.strikethrough$.subscribe(() => this.onSelectStrikethrough()));
        this.subscriptions.add(this.apiService.subscript$.subscribe(() => this.onSelectSubscript()));
        this.subscriptions.add(this.apiService.superscript$.subscribe(() => this.onSelectSuperscript()));
        this.subscriptions.add(this.apiService.mention$.subscribe(() => this.onMentionClick()));
        this.subscriptions.add(this.apiService.clearFormatting$.subscribe(() => this.onClearFormatting()));
        this.subscriptions.add(this.apiService.textStyle$.subscribe((style) => this.onStyleChange(style)));
        this.subscriptions.add(this.apiService.textColor$.subscribe((color) => this.onTextColorChange(color)));
        this.subscriptions.add(this.apiService.innerHTML$.subscribe((html) => {
            if (typeof html === 'string') {
                this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(html);
            }
            else {
                this.innerHtml = html;
            }
        }));
        this.subscriptions.add(this.apiService.bulletList$.subscribe(() => this.onBulletListClick()));
        this.subscriptions.add(this.apiService.numberedList$.subscribe(() => this.onNumberedListClick()));
        this.defaultTextColor = this.textColors.find(color => color.colorName = this.config.defaultTextColor);
        if (this.defaultTextColor) {
            this.defaultTextColor.selected = true;
            this.selectedColor = this.defaultTextColor;
        }
        setTimeout(() => {
            this.onEditorReady.emit(new EditorApi(this.apiService));
            if (this.config.initialInnerHTML) {
                if (typeof this.config.initialInnerHTML === 'string') {
                    this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(this.config.initialInnerHTML);
                }
                else {
                    this.innerHtml = this.config.initialInnerHTML;
                }
            }
            this.editorWidth = this.editor.nativeElement.offsetWidth;
            // set editor size
        }, 0);
    }
    ngAfterViewInit() {
        setTimeout(() => {
            this.editor.nativeElement.addEventListener('blur', () => {
                this.editor.nativeElement.focus();
            });
        });
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
    onKeydown(event) {
        //console.log(event)
        // MENTION PART
        if (this.isMentionDropdownOpen) {
            if (event.key === 'ArrowDown' && this.enteredUser) {
                event.preventDefault();
                if (this.enteredUser.index < this.filteredUsers.length - 1) {
                    const newIndex = this.enteredUser.index + 1;
                    this.filteredUsers = this.filteredUsers.map(user => {
                        return {
                            ...user,
                            isMouseEntered: user.index === newIndex,
                        };
                    });
                    this.enteredUser = this.filteredUsers[newIndex];
                    const items = this.el.nativeElement.querySelectorAll('.universal-editor-user');
                    if (!items.length)
                        return;
                    items[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
            else if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (this.enteredUser && this.enteredUser.index > 0) {
                    const newIndex = this.enteredUser.index - 1;
                    this.filteredUsers = this.filteredUsers.map(user => {
                        return {
                            ...user,
                            isMouseEntered: user.index === newIndex,
                        };
                    });
                    this.enteredUser = this.filteredUsers[newIndex];
                    const items = this.el.nativeElement.querySelectorAll('.universal-editor-user');
                    if (!items.length)
                        return;
                    items[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
            else if (event.key === 'Tab' || event.key === 'Enter') {
                event.preventDefault();
                if (this.enteredUser) {
                    this.onSelectUser(this.enteredUser);
                }
                else {
                    this.onCancelSelectUser(false);
                }
            }
            else if (event.key === 'Backspace' && !this.searchUserText) {
                event.preventDefault();
                this.onCancelSelectUser(true);
            }
            else if (event.key === 'Escape') {
                event.preventDefault();
                this.onCancelSelectUser(false);
            }
        }
        if (event.key === 'b' && event.ctrlKey) {
            const tag = 'strong';
            event.preventDefault();
            if (!this.isMentionDropdownOpen && this.config.enableBold) {
                this.isBold = !this.isBold;
                if (this.currentTextStyleElement) {
                    if (this.isBold) {
                        const elem = document.createElement(tag);
                        let elemText = '\u200B';
                        if (!this.currentTextStyleElement.textContent) { // empty p
                            const space = document.createTextNode(elemText);
                            elem.appendChild(space);
                            this.currentTextStyleElement.appendChild(elem);
                            this.setCursorPositionAfter(space, false);
                        }
                        else { //with content
                            if (this.selectedText) {
                                elemText = this.selectedText;
                            }
                            const space = document.createTextNode(elemText);
                            elem.appendChild(space);
                            this.addElement(elem, this.currentTextStyleElement);
                            this.setCursorPositionAfter(elem, true);
                        }
                        this.currentBoldElement = elem;
                    }
                    else {
                        if (this.currentBoldElement && this.currentBoldElement.textContent === '\u200B') { // empty strong
                            this.currentBoldElement.remove();
                        }
                        else if (this.currentBoldElement) { // with content
                            this.splitAtCaret(this.currentBoldElement, false, false);
                        }
                    }
                }
            }
        }
        if (event.key === 'i' && event.ctrlKey) {
            const tag = 'em';
            event.preventDefault();
            if (!this.isMentionDropdownOpen && this.config.enableItalic) {
                this.isItalic = !this.isItalic;
                if (this.currentTextStyleElement) {
                    if (this.isItalic) {
                        const elem = document.createElement(tag);
                        let elemText = '\u200B';
                        if (!this.currentTextStyleElement.textContent) { // empty p
                            const space = document.createTextNode(elemText);
                            elem.appendChild(space);
                            this.currentTextStyleElement.appendChild(elem);
                            this.setCursorPositionAfter(space, false);
                        }
                        else { //with content
                            if (this.selectedText) {
                                elemText = this.selectedText;
                            }
                            const space = document.createTextNode(elemText);
                            elem.appendChild(space);
                            this.addElement(elem, this.currentTextStyleElement);
                            this.setCursorPositionAfter(elem, true);
                        }
                        this.currentBoldElement = elem;
                    }
                    else {
                        if (this.currentItalicElement && this.currentItalicElement.textContent === '\u200B') { // empty italic
                            this.currentItalicElement.remove();
                        }
                        else if (this.currentItalicElement) { // with content
                            this.splitAtCaret(this.currentItalicElement, false, false);
                        }
                    }
                }
            }
        }
        if (event.key === 'u' && event.ctrlKey) {
            const tag = 'u';
            event.preventDefault();
            if (!this.isMentionDropdownOpen && this.config.enableUnderline) {
                this.isUnderline = !this.isUnderline;
                if (this.currentTextStyleElement) {
                    if (this.isUnderline) {
                        const elem = document.createElement(tag);
                        let elemText = '\u200B';
                        if (!this.currentTextStyleElement.textContent) { // empty p
                            const space = document.createTextNode(elemText);
                            elem.appendChild(space);
                            this.currentTextStyleElement.appendChild(elem);
                            this.setCursorPositionAfter(space, false);
                        }
                        else { //with content
                            if (this.selectedText) {
                                elemText = this.selectedText;
                            }
                            const space = document.createTextNode(elemText);
                            elem.appendChild(space);
                            this.addElement(elem, this.currentTextStyleElement);
                            this.setCursorPositionAfter(elem, true);
                        }
                        this.currentBoldElement = elem;
                    }
                    else {
                        if (this.currentUnderlineElement && this.currentUnderlineElement.textContent === '\u200B') { // empty 
                            this.currentUnderlineElement.remove();
                        }
                        else if (this.currentUnderlineElement) { // with content
                            this.splitAtCaret(this.currentUnderlineElement, false, false);
                        }
                    }
                }
            }
        }
        if (event.key === 'S' && event.ctrlKey && event.shiftKey) {
            const tag = 's';
            event.preventDefault();
            if (!this.isMentionDropdownOpen && this.config.enableStrikethrough) {
                this.isStrikethrough = !this.isStrikethrough;
                if (this.currentTextStyleElement) {
                    if (this.isStrikethrough) {
                        const elem = document.createElement(tag);
                        let elemText = '\u200B';
                        if (!this.currentTextStyleElement.textContent) { // empty p
                            const space = document.createTextNode(elemText);
                            elem.appendChild(space);
                            this.currentTextStyleElement.appendChild(elem);
                            this.setCursorPositionAfter(space, false);
                        }
                        else { //with content
                            if (this.selectedText) {
                                elemText = this.selectedText;
                            }
                            const space = document.createTextNode(elemText);
                            elem.appendChild(space);
                            this.addElement(elem, this.currentTextStyleElement);
                            this.setCursorPositionAfter(elem, true);
                        }
                        this.currentBoldElement = elem;
                    }
                    else {
                        if (this.currentStrikethroughElement && this.currentStrikethroughElement.textContent === '\u200B') { // empty 
                            this.currentStrikethroughElement.remove();
                        }
                        else if (this.currentStrikethroughElement) { // with content
                            this.splitAtCaret(this.currentStrikethroughElement, false, false);
                        }
                    }
                }
            }
        }
        if (event.code === 'Comma' && event.ctrlKey && event.shiftKey) {
            const tag = 'sub';
            event.preventDefault();
            if (!this.isMentionDropdownOpen && this.config.enableSubscript) {
                this.isSubscript = !this.isSubscript;
                if (this.currentTextStyleElement) {
                    if (this.isSubscript) {
                        const elem = document.createElement(tag);
                        let elemText = '\u200B';
                        if (!this.currentTextStyleElement.textContent) { // empty p
                            const space = document.createTextNode(elemText);
                            elem.appendChild(space);
                            this.currentTextStyleElement.appendChild(elem);
                            this.setCursorPositionAfter(space, false);
                        }
                        else { //with content
                            if (this.selectedText) {
                                elemText = this.selectedText;
                            }
                            const space = document.createTextNode(elemText);
                            elem.appendChild(space);
                            this.addElement(elem, this.currentTextStyleElement);
                            this.setCursorPositionAfter(elem, true);
                        }
                        this.currentBoldElement = elem;
                    }
                    else {
                        if (this.currentSubscriptElement && this.currentSubscriptElement.textContent === '\u200B') { // empty 
                            this.currentSubscriptElement.remove();
                        }
                        else if (this.currentSubscriptElement) { // with content
                            this.splitAtCaret(this.currentSubscriptElement, false, false);
                        }
                    }
                }
            }
        }
        if (event.code === 'Period' && event.ctrlKey && event.shiftKey) {
            const tag = 'sup';
            event.preventDefault();
            if (!this.isMentionDropdownOpen && this.config.enableSuperscript) {
                this.isSuperscript = !this.isSuperscript;
                if (this.currentTextStyleElement) {
                    if (this.isSuperscript) {
                        const elem = document.createElement(tag);
                        let elemText = '\u200B';
                        if (!this.currentTextStyleElement.textContent) { // empty p
                            const space = document.createTextNode(elemText);
                            elem.appendChild(space);
                            this.currentTextStyleElement.appendChild(elem);
                            this.setCursorPositionAfter(space, false);
                        }
                        else { //with content
                            if (this.selectedText) {
                                elemText = this.selectedText;
                            }
                            const space = document.createTextNode(elemText);
                            elem.appendChild(space);
                            this.addElement(elem, this.currentTextStyleElement);
                            this.setCursorPositionAfter(elem, true);
                        }
                        this.currentBoldElement = elem;
                    }
                    else {
                        if (this.currentSupesrsciptElement && this.currentSupesrsciptElement.textContent === '\u200B') { // empty 
                            this.currentSupesrsciptElement.remove();
                        }
                        else if (this.currentSupesrsciptElement) { // with content
                            this.splitAtCaret(this.currentSupesrsciptElement, false, false);
                        }
                    }
                }
            }
        }
        if (event.key === '\\' && event.ctrlKey) {
            event.preventDefault();
            if (!this.isMentionDropdownOpen && this.currentTextStyleElement && this.highestFormatElement) {
                this.splitAtCaret(this.highestFormatElement, true, false);
            }
        }
        if (event.code === 'CustomTextColor') {
            const tag = 'span';
            event.preventDefault();
            if (!this.isMentionDropdownOpen && this.config.enableTextColor && this.currentTextStyleElement) {
                if (equal(this.selectedColor, this.defaultTextColor)) {
                    if (this.currentTextStyleElement.textContent && this.currentTextColorElement) {
                        this.splitAtCaret(this.currentTextColorElement, false, false);
                    }
                }
                else {
                    if (this.currentTextColorElement) { // from color to color
                        this.splitAtCaret(this.currentTextColorElement, false, true);
                    }
                    else if (this.selectedColor) { //from default to color
                        const elem = document.createElement(tag);
                        elem.style.color = this.selectedColor.colorCode;
                        elem.className = 'universal-editor-text-color';
                        elem.setAttribute('custom-text-color-name', this.selectedColor.colorName);
                        elem.setAttribute('custom-text-color-code', this.selectedColor.colorCode);
                        let elemText = '\u200B';
                        if (!this.currentTextStyleElement.textContent) { // empty p
                            const space = document.createTextNode(elemText);
                            elem.appendChild(space);
                            this.currentTextStyleElement.appendChild(elem);
                            this.setCursorPositionAfter(space, false);
                        }
                        else { //with content
                            if (this.selectedText) {
                                elemText = this.selectedText;
                            }
                            const space = document.createTextNode(elemText);
                            elem.appendChild(space);
                            this.addElement(elem, this.currentTextStyleElement);
                            this.setCursorPositionAfter(elem, true);
                        }
                        this.currentBoldElement = elem;
                    }
                }
            }
        }
        if (event.code === 'Digit8' && event.ctrlKey && event.shiftKey && this.textStyle === 'p') {
            event.preventDefault();
            if (!this.isMentionDropdownOpen && this.config.enableBulletList) {
                this.isBulletList = !this.isBulletList;
                if (this.isBulletList) {
                    const ul = document.createElement('ul');
                    ul.className = 'universal-editor-bullet-list';
                    this.currentBulletListElement = ul;
                    ul.setAttribute('bullet-list-indent-level', '1');
                    let caretElem = undefined;
                    if (this.currentTextStyleElement) {
                        const selection = window.getSelection();
                        if (selection && selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            const pElements = this.editor.nativeElement.querySelectorAll('p');
                            pElements.forEach((p) => {
                                if (range.intersectsNode(p)) {
                                    const li = document.createElement('li');
                                    li.appendChild(p);
                                    ul.appendChild(li);
                                    caretElem = p;
                                }
                            });
                        }
                        this.addElement(ul, this.editor.nativeElement);
                        this.mergeAdjacent('ul');
                        this.setCursorPositionAfter(caretElem, true);
                    }
                    else {
                        // create empty ul
                        const li = document.createElement('li');
                        const p = document.createElement('p');
                        p.textContent = '\u200B';
                        li.appendChild(p);
                        ul.appendChild(li);
                        this.addElement(ul, this.editor.nativeElement);
                        this.mergeAdjacent('ul');
                        this.setCursorPositionAfter(p, true);
                        this.currentTextStyleElement = p;
                    }
                }
                else if (this.currentTextStyleElement) {
                    if (this.currentBulletListElement && (this.currentBulletListElement.textContent === '\u200B' || this.currentBulletListElement.textContent === '')) { // empty ul
                        this.currentBulletListElement.replaceWith(this.currentTextStyleElement);
                        this.currentBulletListElement = undefined;
                    }
                    else if (this.currentBulletListElement) { // with content
                        const selection = window.getSelection();
                        if (selection && selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            const liElements = this.currentBulletListElement.querySelectorAll('li');
                            const parent = this.currentBulletListElement.parentElement;
                            let ul = undefined;
                            let caretElem = undefined;
                            liElements.forEach((li, index) => {
                                if (index === 0 && this.currentBulletListElement && parent) {
                                    if (range.intersectsNode(li)) {
                                        while (li.firstChild) {
                                            caretElem = li.firstChild;
                                            parent.insertBefore(li.firstChild, this.currentBulletListElement);
                                        }
                                    }
                                    else {
                                        ul = document.createElement('ul');
                                        ul.appendChild(li);
                                        parent.insertBefore(ul, this.currentBulletListElement);
                                    }
                                }
                                else if (this.currentBulletListElement && parent) {
                                    if (range.intersectsNode(li)) {
                                        if (ul) {
                                            ul = undefined;
                                        }
                                        while (li.firstChild) {
                                            caretElem = li.firstChild;
                                            parent.insertBefore(li.firstChild, this.currentBulletListElement);
                                        }
                                    }
                                    else {
                                        if (ul) {
                                            ul.appendChild(li);
                                        }
                                        else {
                                            ul = document.createElement('ul');
                                            ul.appendChild(li);
                                            parent.insertBefore(ul, this.currentBulletListElement);
                                        }
                                    }
                                }
                            });
                            this.currentBulletListElement.remove();
                            this.currentBulletListElement = undefined;
                            this.setCursorPositionAfter(caretElem, true);
                        }
                    }
                }
            }
        }
    }
    onInput(event) {
        //console.log(event)
        const fontElements = this.editor.nativeElement.querySelectorAll('font');
        fontElements.forEach((fontElem) => {
            fontElem.remove();
        });
        // FIRST CHAR
        if (event.inputType === 'insertText' && this.editor.nativeElement.innerHTML.length <= 1) {
            let coords = this.getCaretCoordinates();
            event.preventDefault();
            let content = event.data;
            content = `<span class="universal-marker">${content}</span>`;
            if (event.data === '@' && this.config.enableMention) {
                content = `<span class="universal-tag">${content}</span>`;
            }
            if (this.selectedColor && !equal(this.selectedColor, this.defaultTextColor)) {
                content = `<span class="universal-editor-text-color" style="color:${this.selectedColor.colorCode};" 
        custom-text-color-name="${this.selectedColor.colorName}" custom-text-color-code="${this.selectedColor.colorCode}">${content}</span>`;
            }
            if (this.isBold) {
                content = `<strong>${content}</strong>`;
            }
            if (this.isItalic) {
                content = `<em>${content}</em>`;
            }
            if (this.isUnderline) {
                content = `<u>${content}</u>`;
            }
            if (this.isStrikethrough) {
                content = `<s>${content}</s>`;
            }
            if (this.isSubscript) {
                content = `<sub>${content}</sub>`;
            }
            if (this.isSuperscript) {
                content = `<sup>${content}</sup>`;
            }
            content = `<${this.textStyle}>${content}</${this.textStyle}>`;
            const elem = this.createElementFromString(content);
            const text = this.editor.nativeElement.firstChild;
            if (text) {
                this.editor.nativeElement.replaceChild(elem, text);
            }
            else {
                this.editor.nativeElement.appendChild(elem);
            }
            const marker = elem.querySelector('.universal-marker');
            if (marker && marker.textContent) {
                const text = document.createTextNode(marker.textContent);
                marker.replaceWith(text);
                this.setCursorPositionAfter(text, false);
            }
            else {
                this.setCursorPositionAfter(elem, true);
            }
            if (event.data === '@' && this.config.enableMention) {
                this.openMentionDropdown(coords.x, coords.y);
            }
        }
        // MENTION PART
        if (event.data === '@' && !this.isMentionDropdownOpen && this.editor.nativeElement.innerHTML.length > 1 && this.config.enableMention && this.currentTextStyleElement) {
            const coords = this.getCaretCoordinates();
            event.preventDefault();
            if (event.type !== 'customInput') {
                this.deleteCharBeforeCaret();
            }
            const elemText = `<span class="universal-tag">@</span>`;
            const elem = this.createElementFromString(elemText);
            this.addElement(elem, this.currentTextStyleElement);
            this.setCursorPositionAfter(elem, true);
            this.openMentionDropdown(coords.x, coords.y);
        }
        if (this.isMentionDropdownOpen) {
            const tag = this.el.nativeElement.querySelector('.universal-tag');
            if (tag) {
                this.searchUserText = tag.textContent.replace(/@/g, '');
                this.filterUsers();
            }
        }
        this.traverseTheDOM(true);
        setTimeout(() => this.emitChange(), 0);
    }
    onBulletListClick() {
        this.editor.nativeElement.focus();
        const event = new KeyboardEvent('keydown', {
            code: 'Digit8',
            ctrlKey: true,
            shiftKey: true,
            bubbles: true,
            cancelable: true
        });
        this.editor.nativeElement.dispatchEvent(event);
    }
    onNumberedListClick() {
        this.editor.nativeElement.focus();
        const event = new KeyboardEvent('keydown', {
            code: 'Digit7',
            ctrlKey: true,
            shiftKey: true,
            bubbles: true,
            cancelable: true
        });
        this.editor.nativeElement.dispatchEvent(event);
    }
    get textStyleDisabled() {
        if (this.currentBulletListElement) {
            return true;
        }
        return false;
    }
    onStyleChange(event) {
        if (this.config.enableTextStyles) {
            if (this.editor.nativeElement.innerHTML.length === 0) {
                this.editor.nativeElement.focus();
                let inside = `&#8203;`;
                if (this.selectedColor && !equal(this.selectedColor, this.defaultTextColor)) {
                    inside = `<span class="universal-editor-text-color" style="color:${this.selectedColor.colorCode};" 
          custom-text-color-name="${this.selectedColor.colorName}" custom-text-color-code="${this.selectedColor.colorCode}">${inside}</span>`;
                }
                if (this.isBold) {
                    inside = `<strong>${inside}</strong>`;
                }
                if (this.isItalic) {
                    inside = `<em>${inside}</em>`;
                }
                if (this.isUnderline) {
                    inside = `<u>${inside}</u>`;
                }
                if (this.isStrikethrough) {
                    inside = `<s>${inside}</s>`;
                }
                if (this.isSubscript) {
                    inside = `<sub>${inside}</sub>`;
                }
                if (this.isSuperscript) {
                    inside = `<sup>${inside}</sup>`;
                }
                inside = `<${event}>${inside}</${event}>`;
                const elem = this.createElementFromString(inside);
                this.addElement(elem, this.editor.nativeElement);
                this.setCursorPositionAfter(elem, true);
            }
            else if (this.currentTextStyleElement) {
                this.replaceElement(this.currentTextStyleElement, event);
            }
            this.traverseTheDOM(false);
            this.textStyle = event;
            if (this.textStyles) {
                this.textStyles.setStyle(this.textStyle);
            }
        }
    }
    emitChange() {
        const taggedElements = this.editor.nativeElement.querySelectorAll('.universal-editor-tag');
        const ids = Array.from(taggedElements).map(element => element.id);
        const uniqueIds = Array.from(new Set(ids));
        //console.log(this.editor.nativeElement.innerHTML)
        this.onChangeText.emit(this.editor.nativeElement.innerHTML);
        this.onChangeIds.emit(uniqueIds);
    }
    mergeAdjacent(tag) {
        const all = document.querySelectorAll(tag);
        let prev = null;
        all.forEach((ul, index) => {
            if (prev && ul.previousElementSibling === prev) {
                while (ul.children.length > 0) {
                    prev.appendChild(ul.children[0]);
                }
                ul.remove();
            }
            else {
                prev = ul;
            }
        });
    }
    getSelectedText() {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            return range.toString();
            ;
        }
        return '';
    }
    splitAtCaret(element, clearFormatting, changeTextColor) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return;
        }
        const range = selection.getRangeAt(0);
        let selectedText = range.toString();
        if (element) {
            const startOffset = range.startOffset;
            const originalText = element.textContent;
            if (originalText) {
                if (this.textElement && this.textElement.textContent) {
                    const leftContainer = element.cloneNode(false);
                    const rightContainer = element.cloneNode(false);
                    const middleContainer = element.cloneNode(false);
                    this.splitElementAtText(element, leftContainer, middleContainer, rightContainer, startOffset, selectedText.length);
                    const marker = middleContainer.querySelector('#editor-marker');
                    if (!marker)
                        return;
                    if (!selectedText) {
                        selectedText = '\u200B';
                    }
                    const space = document.createTextNode(selectedText);
                    marker.replaceWith(space);
                    const parent = element.parentNode;
                    if (!parent)
                        return;
                    parent.insertBefore(leftContainer, element);
                    if (clearFormatting) {
                        parent.insertBefore(space, element);
                    }
                    else {
                        if (changeTextColor && this.selectedColor) {
                            middleContainer.style.color = this.selectedColor.colorCode;
                            middleContainer.setAttribute('custom-text-color-name', this.selectedColor.colorName);
                            middleContainer.setAttribute('custom-text-color-code', this.selectedColor.colorCode);
                            parent.insertBefore(middleContainer, element);
                        }
                        else if (middleContainer.firstChild) {
                            parent.insertBefore(middleContainer.firstChild, element);
                        }
                    }
                    if (rightContainer.textContent) {
                        parent.insertBefore(rightContainer, element);
                    }
                    element.remove();
                    this.setCursorPositionAfter(space, false);
                }
            }
        }
    }
    splitElementAtText(container, leftContainer, middleContainer, rightContainer, splitIndex, selectedTextLength) {
        const children = container.childNodes;
        let left = true;
        children.forEach(child => {
            if (this.textElement && child.contains(this.textElement) && this.textElement.textContent) {
                left = false;
                const textLeft = this.textElement.textContent.slice(0, splitIndex);
                const textRight = this.textElement.textContent.slice(splitIndex + selectedTextLength);
                if (child === this.textElement) {
                    leftContainer.appendChild(document.createTextNode(textLeft));
                    const marker = document.createElement('span');
                    marker.id = 'editor-marker';
                    middleContainer.appendChild(marker);
                    if (textRight) {
                        rightContainer.appendChild(document.createTextNode(textRight));
                    }
                }
                else {
                    const leftNew = child.cloneNode(false);
                    leftContainer.appendChild(leftNew);
                    const rightNew = child.cloneNode(false);
                    rightContainer.appendChild(rightNew);
                    const middleNew = child.cloneNode(false);
                    middleContainer.appendChild(middleNew);
                    this.splitElementAtText(child, leftNew, middleNew, rightNew, splitIndex, selectedTextLength);
                }
            }
            else if (left) {
                leftContainer.appendChild(child.cloneNode(true));
            }
            else {
                rightContainer.appendChild(child.cloneNode(true));
            }
        });
    }
    replaceElement(oldElement, newElementType) {
        //console.log(oldElement, newElementType)
        const newElement = document.createElement(newElementType);
        newElement.innerHTML = oldElement.innerHTML;
        if (oldElement.parentNode) {
            oldElement.parentNode.replaceChild(newElement, oldElement);
            this.setCursorPositionAfter(newElement, true);
        }
    }
    deleteCharBeforeCaret() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return;
        }
        const range = selection.getRangeAt(0);
        // Check if the selection is collapsed (no text is selected)
        if (range.collapsed) {
            const startContainer = range.startContainer;
            // Deleting a character in a text node
            if (startContainer.nodeType === Node.TEXT_NODE && range.startOffset > 0) {
                // Modify the range to encompass the character before the caret
                range.setStart(startContainer, range.startOffset - 1);
                // Delete the character
                range.deleteContents();
                // Create a new range to set the caret position
                const newRange = document.createRange();
                newRange.setStart(startContainer, range.startOffset);
                newRange.collapse(true);
                // Set the new range as the selection
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }
    }
    createElementFromString(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        if (doc.body.firstChild && doc.body.firstChild.nodeType === Node.ELEMENT_NODE) {
            return doc.body.firstChild;
        }
        return doc.body.firstElementChild;
    }
    addElement(elem, parent) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && parent.contains(selection.anchorNode)) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(elem);
            range.selectNodeContents(elem);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    setCursorPositionAfter(element, afterContentInsideTag) {
        if (element) {
            const range = document.createRange();
            const selection = window.getSelection();
            if (afterContentInsideTag) {
                if (element.lastChild) {
                    range.setStartAfter(element.lastChild);
                }
                else {
                    range.setStart(element, 0);
                }
            }
            else {
                range.setStartAfter(element);
            }
            range.collapse(true);
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
    onHostClick(event) {
        const targetElement = event.target;
        const dropdown = this.el.nativeElement.querySelector('.universal-editor-mention');
        const mentionButton = this.el.nativeElement.querySelector('.mention-button');
        if (targetElement && !dropdown.contains(targetElement) && this.isMentionDropdownOpen && !mentionButton.contains(targetElement)) {
            this.onCancelSelectUser(false);
        }
        if (this.editor.nativeElement.contains(targetElement)) {
            this.traverseTheDOM(true);
        }
    }
    onResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.editorWidth = this.editor.nativeElement.offsetWidth;
            console.log('New width:', this.editorWidth);
            //set editor size
        }, 100);
    }
    traverseTheDOM(exposeChanges) {
        const editor = this.editor.nativeElement;
        const selection = window.getSelection();
        // Ensure there's a selection and it's within the editor
        if (!selection || !selection.rangeCount || !editor.contains(selection.anchorNode)) {
            console.log('No valid selection within the editor');
            return;
        }
        const range = selection.getRangeAt(0);
        this.selectedText = range.toString();
        let node = selection.getRangeAt(0).startContainer;
        if (node && node !== editor && exposeChanges) {
            this.isBold = false;
            this.isItalic = false;
            this.isUnderline = false;
            this.isStrikethrough = false;
            this.isSubscript = false;
            this.isSuperscript = false;
            this.selectedColor = this.defaultTextColor;
            this.isBulletList = false;
        }
        this.textElement = undefined;
        this.currentTextStyleElement = undefined;
        this.currentBoldElement = undefined;
        this.currentItalicElement = undefined;
        this.currentUnderlineElement = undefined;
        this.currentStrikethroughElement = undefined;
        this.currentSupesrsciptElement = undefined;
        this.currentSubscriptElement = undefined;
        this.highestFormatElement = undefined;
        this.currentTextColorElement = undefined;
        this.currentBulletListElement = undefined;
        if (node.nodeType === Node.TEXT_NODE) {
            this.textElement = node;
        }
        while (node && node !== editor) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.nodeName === 'DIV') {
                    this.replaceElement(node, 'p');
                }
                if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(node.nodeName)) {
                    this.textStyle = node.nodeName.toLowerCase();
                    this.currentTextStyleElement = node;
                    const br = this.currentTextStyleElement.querySelector('br');
                    if (br) {
                        const space = document.createTextNode('\u200B');
                        br.replaceWith(space);
                        this.setCursorPositionAfter(space, false);
                    }
                }
                if (node.nodeName === 'STRONG') {
                    if (exposeChanges) {
                        this.isBold = true;
                    }
                    this.currentBoldElement = node;
                    this.highestFormatElement = node;
                }
                if (node.nodeName === 'EM') {
                    if (exposeChanges) {
                        this.isItalic = true;
                    }
                    this.currentItalicElement = node;
                    this.highestFormatElement = node;
                }
                if (node.nodeName === 'U') {
                    if (exposeChanges) {
                        this.isUnderline = true;
                    }
                    this.currentUnderlineElement = node;
                    this.highestFormatElement = node;
                }
                if (node.nodeName === 'S') {
                    if (exposeChanges) {
                        this.isStrikethrough = true;
                    }
                    this.currentStrikethroughElement = node;
                    this.highestFormatElement = node;
                }
                if (node.nodeName === 'SUB') {
                    if (exposeChanges) {
                        this.isSubscript = true;
                    }
                    this.currentSubscriptElement = node;
                    this.highestFormatElement = node;
                }
                if (node.nodeName === 'SUP') {
                    if (exposeChanges) {
                        this.isSuperscript = true;
                    }
                    this.currentSupesrsciptElement = node;
                    this.highestFormatElement = node;
                }
                if (node.nodeName === 'SPAN') {
                    const elem = node;
                    if (elem.className === 'universal-editor-text-color') {
                        this.currentTextColorElement = elem;
                        if (exposeChanges) {
                            const textColor = this.currentTextColorElement.getAttribute('custom-text-color-code');
                            this.selectedColor = this.textColors.find(color => color.colorCode === textColor);
                        }
                        this.highestFormatElement = elem;
                    }
                }
                if (node.nodeName === 'UL') {
                    if (exposeChanges) {
                        this.isBulletList = true;
                    }
                    this.currentBulletListElement = node;
                }
                console.log('Element type:', node.nodeName);
            }
            node = node.parentNode;
        }
        if (exposeChanges) {
            if (this.textStyles) {
                this.textStyles.setStyle(this.textStyle);
            }
            if (this.selectedColor) {
                this.textColorRef.setColor(this.selectedColor);
            }
        }
    }
    onTextColorChange(color) {
        if (equal(this.selectedColor, color))
            return;
        this.selectedColor = color;
        this.editor.nativeElement.focus();
        const event = new KeyboardEvent('keydown', {
            code: 'CustomTextColor',
            bubbles: true,
            cancelable: true
        });
        this.editor.nativeElement.dispatchEvent(event);
    }
    onSelectBold() {
        this.editor.nativeElement.focus();
        const event = new KeyboardEvent('keydown', {
            key: 'b',
            ctrlKey: true,
            bubbles: true,
            cancelable: true
        });
        this.editor.nativeElement.dispatchEvent(event);
    }
    onSelectItalic() {
        this.editor.nativeElement.focus();
        const event = new KeyboardEvent('keydown', {
            key: 'i',
            ctrlKey: true,
            bubbles: true,
            cancelable: true
        });
        this.editor.nativeElement.dispatchEvent(event);
    }
    onSelectUnderline() {
        this.editor.nativeElement.focus();
        const event = new KeyboardEvent('keydown', {
            key: 'u',
            ctrlKey: true,
            bubbles: true,
            cancelable: true
        });
        this.editor.nativeElement.dispatchEvent(event);
    }
    onSelectStrikethrough() {
        this.editor.nativeElement.focus();
        const event = new KeyboardEvent('keydown', {
            key: 'S',
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
            shiftKey: true
        });
        this.editor.nativeElement.dispatchEvent(event);
    }
    onSelectSubscript() {
        this.editor.nativeElement.focus();
        const event = new KeyboardEvent('keydown', {
            code: 'Comma',
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
            shiftKey: true
        });
        this.editor.nativeElement.dispatchEvent(event);
    }
    onSelectSuperscript() {
        this.editor.nativeElement.focus();
        const event = new KeyboardEvent('keydown', {
            code: 'Period',
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
            shiftKey: true
        });
        this.editor.nativeElement.dispatchEvent(event);
    }
    onClearFormatting() {
        this.editor.nativeElement.focus();
        const event = new KeyboardEvent('keydown', {
            key: '\\',
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
        });
        this.editor.nativeElement.dispatchEvent(event);
    }
    onMentionClick() {
        this.editor.nativeElement.focus();
        const event = new InputEvent('customInput', {
            inputType: 'insertText',
            data: '@',
            bubbles: true,
            cancelable: true,
        });
        this.onInput(event);
    }
    onMouseEnter(enteredUser) {
        if (equal(enteredUser, this.enteredUser))
            return;
        this.enteredUser = enteredUser;
        this.filteredUsers = this.filteredUsers.map(user => {
            return {
                ...user,
                isMouseEntered: user.id === enteredUser.id,
            };
        });
    }
    onSelectUser(user) {
        if (this.isMentionDropdownOpen) {
            const tag = this.el.nativeElement.querySelector('.universal-tag');
            if (tag) {
                let newElement;
                if (this.IS_PREMIUM) {
                    newElement = document.createElement('span');
                    newElement.className = 'universal-editor-tag';
                    newElement.id = user.id;
                    newElement.setAttribute('contenteditable', 'false');
                    newElement.textContent = `@${user.firstName} ${user.lastName}`;
                }
                else {
                    newElement = document.createTextNode(`@${user.firstName} ${user.lastName}`);
                }
                tag.replaceWith(newElement);
                const space = document.createTextNode('\u00A0');
                const parentNode = newElement.parentNode;
                if (parentNode) {
                    parentNode.insertBefore(space, newElement.nextSibling);
                }
                this.setCursorPositionAfter(space, false);
                this.closeMentionDropdown();
                this.emitChange();
            }
        }
    }
    onCancelSelectUser(remove) {
        if (this.isMentionDropdownOpen) {
            const tag = this.el.nativeElement.querySelector('.universal-tag');
            if (tag) {
                const newElement = document.createTextNode(remove ? '' : tag.textContent);
                tag.replaceWith(newElement);
                this.setCursorPositionAfter(newElement, false);
            }
            this.closeMentionDropdown();
        }
    }
    getCaretCoordinates() {
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount)
            return { x: 0, y: 0 };
        const range = selection.getRangeAt(0).cloneRange();
        const dummySpan = document.createElement('span');
        dummySpan.appendChild(document.createTextNode('\u200B')); // Zero-width space
        range.insertNode(dummySpan);
        range.collapse(true);
        const rect = dummySpan.getBoundingClientRect();
        const coordinates = { x: rect.left, y: rect.top };
        const parent = dummySpan.parentNode;
        if (parent) {
            dummySpan.parentNode.removeChild(dummySpan);
        }
        return coordinates;
    }
    openMentionDropdown(x, y) {
        const dropdown = this.el.nativeElement.querySelector('.universal-editor-mention');
        const backdrop = this.el.nativeElement.querySelector('.universal-editor-mention-backdrop');
        dropdown.style.display = 'block';
        backdrop.style.display = 'block';
        this.isMentionDropdownOpen = true;
        this.searchUserText = '';
        this.filterUsers();
        setTimeout(() => {
            const dropdownHeight = dropdown.clientHeight;
            const dropdownWidth = dropdown.offsetWidth;
            const rightWidth = window.innerWidth - x;
            //console.log(x, y, dropdownHeight, dropdownWidth, rightWidth);
            if (this.config.mentionPosition === 'auto') {
                if (y > dropdownHeight) {
                    dropdown.style.top = `${y - 10 - dropdownHeight}px`;
                }
                else {
                    dropdown.style.top = `${y + 30}px`;
                }
            }
            else if (this.config.mentionPosition === 'below') {
                dropdown.style.top = `${y + 30}px`;
            }
            else {
                dropdown.style.top = `${y - 10 - dropdownHeight}px`;
            }
            if (rightWidth > dropdownWidth) {
                dropdown.style.left = `${x}px`;
            }
            else {
                dropdown.style.left = `${x - (dropdownWidth - rightWidth)}px`;
            }
        });
    }
    closeMentionDropdown() {
        const dropdown = this.el.nativeElement.querySelector('.universal-editor-mention');
        const backdrop = this.el.nativeElement.querySelector('.universal-editor-mention-backdrop');
        dropdown.style.display = 'none';
        backdrop.style.display = 'none';
        this.isMentionDropdownOpen = false;
    }
    filterUsers() {
        if (!this.searchUserText) {
            this.filteredUsers = this.mentionUsers.map((user, index) => {
                return {
                    ...user,
                    isMouseEntered: index === 0,
                    index: index,
                };
            });
        }
        else {
            const searchLowerCase = this.searchUserText.trim().toLowerCase();
            this.filteredUsers = this.mentionUsers.filter(user => {
                const fullName = user.firstName + ' ' + user.lastName;
                return user.firstName?.toLowerCase().includes(searchLowerCase) ||
                    user.lastName?.toLowerCase().includes(searchLowerCase) ||
                    fullName.toLowerCase().includes(searchLowerCase) ||
                    user.email?.toLowerCase().includes(searchLowerCase);
            }).map((user, index) => {
                return {
                    ...user,
                    isMouseEntered: index === 0,
                    index: index,
                };
            });
        }
        if (this.filteredUsers.length > 0) {
            this.enteredUser = this.filteredUsers[0];
        }
        else {
            this.enteredUser = null;
        }
        if (this.isMentionDropdownOpen) {
            setTimeout(() => {
                const coords = this.getCaretCoordinates();
                if (coords.x === 0 || coords.y === 0) {
                    return;
                }
                const dropdown = this.el.nativeElement.querySelector('.universal-editor-mention');
                const dropdownHeight = dropdown.clientHeight;
                const dropdownWidth = dropdown.offsetWidth;
                const rightWidth = window.innerWidth - coords.x;
                //console.log(coords.x, coords.y, dropdownHeight, dropdownWidth, rightWidth)
                if (this.config.mentionPosition === 'auto') {
                    if (coords.y > dropdownHeight) {
                        dropdown.style.top = `${coords.y - 10 - dropdownHeight}px`;
                    }
                    else {
                        dropdown.style.top = `${coords.y + 30}px`;
                    }
                }
                else if (this.config.mentionPosition === 'below') {
                    dropdown.style.top = `${coords.y + 30}px`;
                }
                else {
                    dropdown.style.top = `${coords.y - 10 - dropdownHeight}px`;
                }
                if (rightWidth > dropdownWidth) {
                    dropdown.style.left = `${coords.x}px`;
                }
                else {
                    dropdown.style.left = `${coords.x - (dropdownWidth - rightWidth)}px`;
                }
            }, 5);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxUniversalEditorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: NgxUniversalEditorComponent, selector: "ngx-universal-editor", inputs: { config: "config", mentionUsers: "mentionUsers" }, outputs: { onChangeText: "onChangeText", onEditorReady: "onEditorReady", onChangeIds: "onChangeIds" }, host: { listeners: { "document:click": "onHostClick($event)", "window:resize": "onResize($event)" } }, providers: [EditorApiService], viewQueries: [{ propertyName: "editor", first: true, predicate: ["editor"], descendants: true }, { propertyName: "textStyles", first: true, predicate: ["textStyles"], descendants: true }, { propertyName: "textColorRef", first: true, predicate: ["textColor"], descendants: true }], ngImport: i0, template: "<div class=\"universal-editor\">\r\n\r\n\r\n    <div class=\"universal-editor-header\" *ngIf=\"config.showToolbar\">\r\n        <text-styles\r\n        [disabled]=\"textStyleDisabled\"\r\n        *ngIf=\"this.config.enableTextStyles\"\r\n        #textStyles\r\n        (onStyleChange)=\"onStyleChange($event)\"\r\n        ></text-styles>\r\n\r\n        <vertical-line></vertical-line>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableBold\"\r\n        [isSelected]=\"isBold\"\r\n        tooltip=\"Bold Ctrl+B\"\r\n        (click)=\"onSelectBold()\"\r\n        ><span class=\"button-icon bold\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableItalic\"\r\n        tooltip=\"Italic Ctrl+I\"\r\n        [isSelected]=\"isItalic\"\r\n        (click)=\"onSelectItalic()\"\r\n        ><span class=\"button-icon italic\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableUnderline\"\r\n        tooltip=\"Underline Ctrl+U\"\r\n        [isSelected]=\"isUnderline\"\r\n        (click)=\"onSelectUnderline()\"\r\n        ><span class=\"button-icon underline\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableStrikethrough\"\r\n        tooltip=\"Strikethrough Ctrl+Shift+S\"\r\n        [isSelected]=\"isStrikethrough\"\r\n        (click)=\"onSelectStrikethrough()\"\r\n        ><span class=\"button-icon strikethrough\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableSubscript\"\r\n        tooltip=\"Subscript Ctrl+Shift+,\"\r\n        [isSelected]=\"isSubscript\"\r\n        (click)=\"onSelectSubscript()\"\r\n        ><span class=\"button-icon subscript\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableSuperscript\"\r\n        tooltip=\"Superscript Ctrl+Shift+.\"\r\n        [isSelected]=\"isSuperscript\"\r\n        (click)=\"onSelectSuperscript()\"\r\n        ><span class=\"button-icon superscript\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableClearFormatting\"\r\n        tooltip=\"Clear formatting Ctrl+\\\"\r\n        (click)=\"onClearFormatting()\"\r\n        ><span class=\"button-icon clear-format\"></span></universal-button>\r\n\r\n        <vertical-line></vertical-line>\r\n\r\n        <text-color\r\n        #textColor\r\n        *ngIf=\"this.config.enableTextColor\"\r\n        [colors]=\"textColors\"\r\n        (onColorChange)=\"onTextColorChange($event)\"\r\n        [defaultColorName]=\"config.defaultTextColor\"\r\n        ></text-color>\r\n\r\n        <vertical-line></vertical-line>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableBulletList\"\r\n        tooltip=\"Bullet list Ctrl+Shift+8\"\r\n        [isSelected]=\"isBulletList\"\r\n        [isDisabled]=\"textStyle !== 'p'\"\r\n        (click)=\"onBulletListClick()\"\r\n        ><span class=\"button-icon bullet-list\" [class.disabled-bullet-list]=\"textStyle !== 'p'\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableNumberedList\"\r\n        tooltip=\"Numbered list Ctrl+Shift+7\"\r\n        [isSelected]=\"isNumberedList\"\r\n        [isDisabled]=\"textStyle !== 'p'\"\r\n        (click)=\"onNumberedListClick()\"\r\n        ><span class=\"button-icon numbered-list\" [class.disabled-numbered-list]=\"textStyle !== 'p'\"></span></universal-button>\r\n        \r\n        <vertical-line></vertical-line>\r\n\r\n        <universal-button \r\n        class=\"mention-button\"\r\n        *ngIf=\"this.config.enableMention\"\r\n        tooltip=\"Mention @\"\r\n        (click)=\"onMentionClick()\"\r\n        ><span style=\"width: 20px;\">@</span></universal-button>\r\n    </div>\r\n\r\n    \r\n    <div\r\n        #editor  \r\n        class=\"universal-editor-content\"\r\n        [attr.contenteditable]=\"config.contenteditable\"\r\n        [attr.placeholderValue]=\"config.placeholderText\"\r\n        [innerHTML]=\"innerHtml\"\r\n        (input)=\"onInput($event)\"\r\n        (keydown)=\"onKeydown($event)\"\r\n    >\r\n    </div>\r\n        \r\n\r\n    <div class=\"universal-editor-mention-backdrop\" *ngIf=\"this.config.enableMention\"></div>\r\n    <div class=\"universal-editor-mention\" *ngIf=\"this.config.enableMention\">\r\n        <div *ngFor=\"let user of filteredUsers\">\r\n            <mention-user \r\n                [user]=\"user\"\r\n                (click)=\"onSelectUser(user)\"\r\n                (mouseenter)=\"onMouseEnter(user)\"\r\n                >\r\n            </mention-user>\r\n        </div>\r\n        <div *ngIf=\"filteredUsers.length === 0\">\r\n            <mention-user>\r\n            </mention-user>\r\n        </div>    \r\n    </div>\r\n\r\n</div>\r\n\r\n\r\n", styles: [".universal-editor{width:100%;height:100%}.universal-editor-header{height:40px;border-color:#8692a6;border-width:2px;border-style:solid;display:flex;flex-direction:row;justify-content:left;align-items:center;padding:0 10px}.universal-editor-content{border-color:#8692a6;border-width:2px;border-style:solid;height:100%;min-height:80px;position:relative;padding:15px 20px 0;overflow-y:auto}.universal-editor-content:empty:before{content:attr(placeholderValue);pointer-events:none;color:#8692a6}.universal-editor-mention{border-color:#8692a6;border-width:2px;border-style:solid;display:none;position:absolute;max-height:300px;overflow-y:auto;z-index:11}.universal-editor-mention-backdrop{display:none;position:fixed;inset:0;z-index:10}:host ::ng-deep .universal-tag{color:#00f}:host ::ng-deep .universal-editor-tag{color:red}.universal-editor-content p{margin-top:0!important}:host ::ng-deep p,:host ::ng-deep h1,:host ::ng-deep h2,:host ::ng-deep h3,:host ::ng-deep h4,:host ::ng-deep h5,:host ::ng-deep h6{margin-top:0}:host ::ng-deep .tooltip{background-color:gray;color:#fff;padding:4px 8px;border-radius:4px;position:absolute;z-index:1000;font-size:12px;font-weight:300}.button-icon{background-size:20px;background-position:center center;background-repeat:no-repeat;width:20px;height:20px;display:inline-block;position:relative;vertical-align:middle}.bold{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M287.54-207.001v-545.998h201.414q63.199 0 114.122 39.401 50.923 39.402 50.923 106.214 0 44.845-21.154 74.115-21.154 29.269-46.154 43.082 31.769 11.572 59.269 43.918 27.5 32.346 27.5 85.423 0 78.691-58.569 116.268t-117.735 37.577H287.54Zm91.997-85.69h113.916q47.547 0 66.586-26.231t19.039-50.309q0-24.078-19.539-50.308Q540-445.77 490.923-445.77H379.537v153.079Zm0-234.308h103.77q36.462 0 58.309-21.346 21.847-21.347 21.847-49.424 0-30.924-22.687-50.54-22.686-19.615-55.629-19.615h-105.61v140.925Z%22%2F%3E%3C%2Fsvg%3E\")}.italic{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M231.77-207.001v-68.306h152.692l133.616-409.386H361.386v-68.306h374.152v68.306H587.153L453.537-275.307h152.385v68.306H231.77Z%22%2F%3E%3C%2Fsvg%3E\")}.underline{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M253.847-179.003v-51.998h452.306v51.998H253.847ZM480-306.848q-88.307 0-137.153-53.053-48.846-53.053-48.846-142.264V-799.46h68.365v300.936q0 57.464 30.658 92.033t87.01 34.569q56.351 0 86.997-34.569t30.646-92.033V-799.46h68.322v297.295q0 89.211-48.846 142.264Q568.307-306.848 480-306.848Z%22%2F%3E%3C%2Fsvg%3E\")}.strikethrough{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M212.001-370.001v-51.998h535.998v51.998H212.001Zm0-168v-51.998h535.998v51.998H212.001Z%22%2F%3E%3C%2Fsvg%3E\")}.subscript{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M707.691-164.001v-87.208q0-18.792 12.646-31.638 12.647-12.846 31.508-12.846h44.154v-44.923h-88.308V-384h87.538q18.862 0 31.508 12.599 12.646 12.598 12.646 31.39v43.219q0 18.791-12.646 31.637t-31.508 12.846h-44.153v44.923h88.307v43.385H707.691ZM292.694-300.309l150.153-233.845-138.768-213.845h63.481l110.825 174.847h-1.539L593-747.999h63.306L515.768-534.154l151.538 233.845H604L480.846-492.078h1.539L356-300.309h-63.306Z%22%2F%3E%3C%2Fsvg%3E\")}.superscript{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M707.691-576v-87.208q0-18.791 12.646-31.637 12.647-12.846 31.508-12.846h44.154v-44.923h-88.308v-43.385h87.538q18.862 0 31.508 12.599t12.646 31.39v43.219q0 18.792-12.646 31.638t-31.508 12.846h-44.153v44.923h88.307V-576H707.691ZM292.694-212.001l150.153-233.845-138.768-213.845h63.481l110.825 174.846h-1.539L593-659.691h63.306L515.768-445.846l151.538 233.845H604l-123.154-191.77h1.539L356-212.001h-63.306Z%22%2F%3E%3C%2Fsvg%3E\")}.clear-format{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22m489.922-565.693-45.306-45.306 15.771-38.079h-54.62l-52.228-52.228h396.767v60.612H522.153l-32.231 75.001Zm268.847 439.767L439.307-445.771l-82.154 190.616h-65.535l101.999-236.307-270.538-270.153 37.153-37.153 635.689 635.689-37.152 37.153Z%22%2F%3E%3C%2Fsvg%3E\")}.bullet-list{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M372.309-250.001v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69ZM222.327-217.463q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Zm0-204q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Zm0-204q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Z%22%2F%3E%3C%2Fsvg%3E\")}.disabled-bullet-list{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath fill%3D%22%23d3d3d3%22 d%3D%22M372.309-250.001v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69ZM222.327-217.463q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Zm0-204q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Zm0-204q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Z%22%2F%3E%3C%2Fsvg%3E\")}.numbered-list{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M164.001-164.001v-35.692h96v-36.308h-48v-35.692h48v-36.308h-96v-35.692h113.846q7.585 0 12.715 5.131 5.131 5.13 5.131 12.715v55.693q0 7.584-5.131 12.715-5.13 5.13-12.715 5.13 7.585 0 12.715 5.131 5.131 5.131 5.131 12.715v52.616q0 7.584-5.131 12.715-5.13 5.131-12.715 5.131H164.001Zm0-226.153V-480q0-7.584 5.131-12.715t12.715-5.131h78.154v-36.308h-96v-35.692h113.846q7.585 0 12.715 5.131 5.131 5.131 5.131 12.715v72q0 7.584-5.131 12.715-5.13 5.131-12.715 5.131h-78.154v36.308h96v35.692H164.001Zm48-226.153v-144h-48v-35.692h83.692v179.692h-35.692Zm160.308 366.306v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Z%22%2F%3E%3C%2Fsvg%3E\")}.disabled-numbered-list{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath fill%3D%22%23d3d3d3%22 d%3D%22M164.001-164.001v-35.692h96v-36.308h-48v-35.692h48v-36.308h-96v-35.692h113.846q7.585 0 12.715 5.131 5.131 5.13 5.131 12.715v55.693q0 7.584-5.131 12.715-5.13 5.13-12.715 5.13 7.585 0 12.715 5.131 5.131 5.131 5.131 12.715v52.616q0 7.584-5.131 12.715-5.13 5.131-12.715 5.131H164.001Zm0-226.153V-480q0-7.584 5.131-12.715t12.715-5.131h78.154v-36.308h-96v-35.692h113.846q7.585 0 12.715 5.131 5.131 5.131 5.131 12.715v72q0 7.584-5.131 12.715-5.13 5.131-12.715 5.131h-78.154v36.308h96v35.692H164.001Zm48-226.153v-144h-48v-35.692h83.692v179.692h-35.692Zm160.308 366.306v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Z%22%2F%3E%3C%2Fsvg%3E\")}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: MentionUserComponent, selector: "mention-user", inputs: ["user"] }, { kind: "component", type: TextStylesComponent, selector: "text-styles", inputs: ["disabled"], outputs: ["onStyleChange"] }, { kind: "component", type: ButtonComponent, selector: "universal-button", inputs: ["showIcon", "isOpen", "isSelected", "isDisabled", "tooltip", "tooltipPosition"] }, { kind: "component", type: VerticalLineComponent, selector: "vertical-line" }, { kind: "component", type: TextColorComponent, selector: "text-color", inputs: ["defaultColorName", "colors"], outputs: ["onColorChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: NgxUniversalEditorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-universal-editor', providers: [EditorApiService], template: "<div class=\"universal-editor\">\r\n\r\n\r\n    <div class=\"universal-editor-header\" *ngIf=\"config.showToolbar\">\r\n        <text-styles\r\n        [disabled]=\"textStyleDisabled\"\r\n        *ngIf=\"this.config.enableTextStyles\"\r\n        #textStyles\r\n        (onStyleChange)=\"onStyleChange($event)\"\r\n        ></text-styles>\r\n\r\n        <vertical-line></vertical-line>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableBold\"\r\n        [isSelected]=\"isBold\"\r\n        tooltip=\"Bold Ctrl+B\"\r\n        (click)=\"onSelectBold()\"\r\n        ><span class=\"button-icon bold\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableItalic\"\r\n        tooltip=\"Italic Ctrl+I\"\r\n        [isSelected]=\"isItalic\"\r\n        (click)=\"onSelectItalic()\"\r\n        ><span class=\"button-icon italic\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableUnderline\"\r\n        tooltip=\"Underline Ctrl+U\"\r\n        [isSelected]=\"isUnderline\"\r\n        (click)=\"onSelectUnderline()\"\r\n        ><span class=\"button-icon underline\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableStrikethrough\"\r\n        tooltip=\"Strikethrough Ctrl+Shift+S\"\r\n        [isSelected]=\"isStrikethrough\"\r\n        (click)=\"onSelectStrikethrough()\"\r\n        ><span class=\"button-icon strikethrough\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableSubscript\"\r\n        tooltip=\"Subscript Ctrl+Shift+,\"\r\n        [isSelected]=\"isSubscript\"\r\n        (click)=\"onSelectSubscript()\"\r\n        ><span class=\"button-icon subscript\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableSuperscript\"\r\n        tooltip=\"Superscript Ctrl+Shift+.\"\r\n        [isSelected]=\"isSuperscript\"\r\n        (click)=\"onSelectSuperscript()\"\r\n        ><span class=\"button-icon superscript\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableClearFormatting\"\r\n        tooltip=\"Clear formatting Ctrl+\\\"\r\n        (click)=\"onClearFormatting()\"\r\n        ><span class=\"button-icon clear-format\"></span></universal-button>\r\n\r\n        <vertical-line></vertical-line>\r\n\r\n        <text-color\r\n        #textColor\r\n        *ngIf=\"this.config.enableTextColor\"\r\n        [colors]=\"textColors\"\r\n        (onColorChange)=\"onTextColorChange($event)\"\r\n        [defaultColorName]=\"config.defaultTextColor\"\r\n        ></text-color>\r\n\r\n        <vertical-line></vertical-line>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableBulletList\"\r\n        tooltip=\"Bullet list Ctrl+Shift+8\"\r\n        [isSelected]=\"isBulletList\"\r\n        [isDisabled]=\"textStyle !== 'p'\"\r\n        (click)=\"onBulletListClick()\"\r\n        ><span class=\"button-icon bullet-list\" [class.disabled-bullet-list]=\"textStyle !== 'p'\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableNumberedList\"\r\n        tooltip=\"Numbered list Ctrl+Shift+7\"\r\n        [isSelected]=\"isNumberedList\"\r\n        [isDisabled]=\"textStyle !== 'p'\"\r\n        (click)=\"onNumberedListClick()\"\r\n        ><span class=\"button-icon numbered-list\" [class.disabled-numbered-list]=\"textStyle !== 'p'\"></span></universal-button>\r\n        \r\n        <vertical-line></vertical-line>\r\n\r\n        <universal-button \r\n        class=\"mention-button\"\r\n        *ngIf=\"this.config.enableMention\"\r\n        tooltip=\"Mention @\"\r\n        (click)=\"onMentionClick()\"\r\n        ><span style=\"width: 20px;\">@</span></universal-button>\r\n    </div>\r\n\r\n    \r\n    <div\r\n        #editor  \r\n        class=\"universal-editor-content\"\r\n        [attr.contenteditable]=\"config.contenteditable\"\r\n        [attr.placeholderValue]=\"config.placeholderText\"\r\n        [innerHTML]=\"innerHtml\"\r\n        (input)=\"onInput($event)\"\r\n        (keydown)=\"onKeydown($event)\"\r\n    >\r\n    </div>\r\n        \r\n\r\n    <div class=\"universal-editor-mention-backdrop\" *ngIf=\"this.config.enableMention\"></div>\r\n    <div class=\"universal-editor-mention\" *ngIf=\"this.config.enableMention\">\r\n        <div *ngFor=\"let user of filteredUsers\">\r\n            <mention-user \r\n                [user]=\"user\"\r\n                (click)=\"onSelectUser(user)\"\r\n                (mouseenter)=\"onMouseEnter(user)\"\r\n                >\r\n            </mention-user>\r\n        </div>\r\n        <div *ngIf=\"filteredUsers.length === 0\">\r\n            <mention-user>\r\n            </mention-user>\r\n        </div>    \r\n    </div>\r\n\r\n</div>\r\n\r\n\r\n", styles: [".universal-editor{width:100%;height:100%}.universal-editor-header{height:40px;border-color:#8692a6;border-width:2px;border-style:solid;display:flex;flex-direction:row;justify-content:left;align-items:center;padding:0 10px}.universal-editor-content{border-color:#8692a6;border-width:2px;border-style:solid;height:100%;min-height:80px;position:relative;padding:15px 20px 0;overflow-y:auto}.universal-editor-content:empty:before{content:attr(placeholderValue);pointer-events:none;color:#8692a6}.universal-editor-mention{border-color:#8692a6;border-width:2px;border-style:solid;display:none;position:absolute;max-height:300px;overflow-y:auto;z-index:11}.universal-editor-mention-backdrop{display:none;position:fixed;inset:0;z-index:10}:host ::ng-deep .universal-tag{color:#00f}:host ::ng-deep .universal-editor-tag{color:red}.universal-editor-content p{margin-top:0!important}:host ::ng-deep p,:host ::ng-deep h1,:host ::ng-deep h2,:host ::ng-deep h3,:host ::ng-deep h4,:host ::ng-deep h5,:host ::ng-deep h6{margin-top:0}:host ::ng-deep .tooltip{background-color:gray;color:#fff;padding:4px 8px;border-radius:4px;position:absolute;z-index:1000;font-size:12px;font-weight:300}.button-icon{background-size:20px;background-position:center center;background-repeat:no-repeat;width:20px;height:20px;display:inline-block;position:relative;vertical-align:middle}.bold{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M287.54-207.001v-545.998h201.414q63.199 0 114.122 39.401 50.923 39.402 50.923 106.214 0 44.845-21.154 74.115-21.154 29.269-46.154 43.082 31.769 11.572 59.269 43.918 27.5 32.346 27.5 85.423 0 78.691-58.569 116.268t-117.735 37.577H287.54Zm91.997-85.69h113.916q47.547 0 66.586-26.231t19.039-50.309q0-24.078-19.539-50.308Q540-445.77 490.923-445.77H379.537v153.079Zm0-234.308h103.77q36.462 0 58.309-21.346 21.847-21.347 21.847-49.424 0-30.924-22.687-50.54-22.686-19.615-55.629-19.615h-105.61v140.925Z%22%2F%3E%3C%2Fsvg%3E\")}.italic{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M231.77-207.001v-68.306h152.692l133.616-409.386H361.386v-68.306h374.152v68.306H587.153L453.537-275.307h152.385v68.306H231.77Z%22%2F%3E%3C%2Fsvg%3E\")}.underline{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M253.847-179.003v-51.998h452.306v51.998H253.847ZM480-306.848q-88.307 0-137.153-53.053-48.846-53.053-48.846-142.264V-799.46h68.365v300.936q0 57.464 30.658 92.033t87.01 34.569q56.351 0 86.997-34.569t30.646-92.033V-799.46h68.322v297.295q0 89.211-48.846 142.264Q568.307-306.848 480-306.848Z%22%2F%3E%3C%2Fsvg%3E\")}.strikethrough{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M212.001-370.001v-51.998h535.998v51.998H212.001Zm0-168v-51.998h535.998v51.998H212.001Z%22%2F%3E%3C%2Fsvg%3E\")}.subscript{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M707.691-164.001v-87.208q0-18.792 12.646-31.638 12.647-12.846 31.508-12.846h44.154v-44.923h-88.308V-384h87.538q18.862 0 31.508 12.599 12.646 12.598 12.646 31.39v43.219q0 18.791-12.646 31.637t-31.508 12.846h-44.153v44.923h88.307v43.385H707.691ZM292.694-300.309l150.153-233.845-138.768-213.845h63.481l110.825 174.847h-1.539L593-747.999h63.306L515.768-534.154l151.538 233.845H604L480.846-492.078h1.539L356-300.309h-63.306Z%22%2F%3E%3C%2Fsvg%3E\")}.superscript{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M707.691-576v-87.208q0-18.791 12.646-31.637 12.647-12.846 31.508-12.846h44.154v-44.923h-88.308v-43.385h87.538q18.862 0 31.508 12.599t12.646 31.39v43.219q0 18.792-12.646 31.638t-31.508 12.846h-44.153v44.923h88.307V-576H707.691ZM292.694-212.001l150.153-233.845-138.768-213.845h63.481l110.825 174.846h-1.539L593-659.691h63.306L515.768-445.846l151.538 233.845H604l-123.154-191.77h1.539L356-212.001h-63.306Z%22%2F%3E%3C%2Fsvg%3E\")}.clear-format{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22m489.922-565.693-45.306-45.306 15.771-38.079h-54.62l-52.228-52.228h396.767v60.612H522.153l-32.231 75.001Zm268.847 439.767L439.307-445.771l-82.154 190.616h-65.535l101.999-236.307-270.538-270.153 37.153-37.153 635.689 635.689-37.152 37.153Z%22%2F%3E%3C%2Fsvg%3E\")}.bullet-list{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M372.309-250.001v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69ZM222.327-217.463q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Zm0-204q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Zm0-204q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Z%22%2F%3E%3C%2Fsvg%3E\")}.disabled-bullet-list{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath fill%3D%22%23d3d3d3%22 d%3D%22M372.309-250.001v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69ZM222.327-217.463q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Zm0-204q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Zm0-204q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Z%22%2F%3E%3C%2Fsvg%3E\")}.numbered-list{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M164.001-164.001v-35.692h96v-36.308h-48v-35.692h48v-36.308h-96v-35.692h113.846q7.585 0 12.715 5.131 5.131 5.13 5.131 12.715v55.693q0 7.584-5.131 12.715-5.13 5.13-12.715 5.13 7.585 0 12.715 5.131 5.131 5.131 5.131 12.715v52.616q0 7.584-5.131 12.715-5.13 5.131-12.715 5.131H164.001Zm0-226.153V-480q0-7.584 5.131-12.715t12.715-5.131h78.154v-36.308h-96v-35.692h113.846q7.585 0 12.715 5.131 5.131 5.131 5.131 12.715v72q0 7.584-5.131 12.715-5.13 5.131-12.715 5.131h-78.154v36.308h96v35.692H164.001Zm48-226.153v-144h-48v-35.692h83.692v179.692h-35.692Zm160.308 366.306v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Z%22%2F%3E%3C%2Fsvg%3E\")}.disabled-numbered-list{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath fill%3D%22%23d3d3d3%22 d%3D%22M164.001-164.001v-35.692h96v-36.308h-48v-35.692h48v-36.308h-96v-35.692h113.846q7.585 0 12.715 5.131 5.131 5.13 5.131 12.715v55.693q0 7.584-5.131 12.715-5.13 5.13-12.715 5.13 7.585 0 12.715 5.131 5.131 5.131 5.131 12.715v52.616q0 7.584-5.131 12.715-5.13 5.131-12.715 5.131H164.001Zm0-226.153V-480q0-7.584 5.131-12.715t12.715-5.131h78.154v-36.308h-96v-35.692h113.846q7.585 0 12.715 5.131 5.131 5.131 5.131 12.715v72q0 7.584-5.131 12.715-5.13 5.131-12.715 5.131h-78.154v36.308h96v35.692H164.001Zm48-226.153v-144h-48v-35.692h83.692v179.692h-35.692Zm160.308 366.306v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Z%22%2F%3E%3C%2Fsvg%3E\")}\n"] }]
        }], propDecorators: { config: [{
                type: Input
            }], mentionUsers: [{
                type: Input
            }], onChangeText: [{
                type: Output
            }], onEditorReady: [{
                type: Output
            }], onChangeIds: [{
                type: Output
            }], editor: [{
                type: ViewChild,
                args: ['editor']
            }], textStyles: [{
                type: ViewChild,
                args: ['textStyles']
            }], onHostClick: [{
                type: HostListener,
                args: ['document:click', ['$event']]
            }], onResize: [{
                type: HostListener,
                args: ['window:resize', ['$event']]
            }], textColorRef: [{
                type: ViewChild,
                args: ['textColor']
            }] } });

class NgxUniversalEditorModule {
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

/*
 * Public API Surface of ngx-universal-editor
 */

/**
 * Generated bundle index. Do not edit.
 */

export { EditorApi, NgxUniversalEditorComponent, NgxUniversalEditorModule, UniversalEditorConfig };
//# sourceMappingURL=ngx-universal-editor.mjs.map
