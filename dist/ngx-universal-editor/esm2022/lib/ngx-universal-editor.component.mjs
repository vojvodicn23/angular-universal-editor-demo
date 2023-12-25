import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { UniversalEditorConfig } from '../public-api';
import { EditorApiService } from './editor.api.service';
import { EditorApi } from './ngx-universal-editor-api';
import { equal } from './shared/custom-methods';
import { Const } from './shared/constants';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./components/mention-user/mention-user.component";
import * as i3 from "./components/text-styles/text-styles.component";
import * as i4 from "./components/button/button.component";
import * as i5 from "./components/vertical-line/vertical-line.component";
import * as i6 from "./components/text-color/text-color.component";
export class NgxUniversalEditorComponent {
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
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: NgxUniversalEditorComponent, selector: "ngx-universal-editor", inputs: { config: "config", mentionUsers: "mentionUsers" }, outputs: { onChangeText: "onChangeText", onEditorReady: "onEditorReady", onChangeIds: "onChangeIds" }, host: { listeners: { "document:click": "onHostClick($event)", "window:resize": "onResize($event)" } }, providers: [EditorApiService], viewQueries: [{ propertyName: "editor", first: true, predicate: ["editor"], descendants: true }, { propertyName: "textStyles", first: true, predicate: ["textStyles"], descendants: true }, { propertyName: "textColorRef", first: true, predicate: ["textColor"], descendants: true }], ngImport: i0, template: "<div class=\"universal-editor\">\r\n\r\n\r\n    <div class=\"universal-editor-header\" *ngIf=\"config.showToolbar\">\r\n        <text-styles\r\n        [disabled]=\"textStyleDisabled\"\r\n        *ngIf=\"this.config.enableTextStyles\"\r\n        #textStyles\r\n        (onStyleChange)=\"onStyleChange($event)\"\r\n        ></text-styles>\r\n\r\n        <vertical-line></vertical-line>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableBold\"\r\n        [isSelected]=\"isBold\"\r\n        tooltip=\"Bold Ctrl+B\"\r\n        (click)=\"onSelectBold()\"\r\n        ><span class=\"button-icon bold\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableItalic\"\r\n        tooltip=\"Italic Ctrl+I\"\r\n        [isSelected]=\"isItalic\"\r\n        (click)=\"onSelectItalic()\"\r\n        ><span class=\"button-icon italic\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableUnderline\"\r\n        tooltip=\"Underline Ctrl+U\"\r\n        [isSelected]=\"isUnderline\"\r\n        (click)=\"onSelectUnderline()\"\r\n        ><span class=\"button-icon underline\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableStrikethrough\"\r\n        tooltip=\"Strikethrough Ctrl+Shift+S\"\r\n        [isSelected]=\"isStrikethrough\"\r\n        (click)=\"onSelectStrikethrough()\"\r\n        ><span class=\"button-icon strikethrough\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableSubscript\"\r\n        tooltip=\"Subscript Ctrl+Shift+,\"\r\n        [isSelected]=\"isSubscript\"\r\n        (click)=\"onSelectSubscript()\"\r\n        ><span class=\"button-icon subscript\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableSuperscript\"\r\n        tooltip=\"Superscript Ctrl+Shift+.\"\r\n        [isSelected]=\"isSuperscript\"\r\n        (click)=\"onSelectSuperscript()\"\r\n        ><span class=\"button-icon superscript\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableClearFormatting\"\r\n        tooltip=\"Clear formatting Ctrl+\\\"\r\n        (click)=\"onClearFormatting()\"\r\n        ><span class=\"button-icon clear-format\"></span></universal-button>\r\n\r\n        <vertical-line></vertical-line>\r\n\r\n        <text-color\r\n        #textColor\r\n        *ngIf=\"this.config.enableTextColor\"\r\n        [colors]=\"textColors\"\r\n        (onColorChange)=\"onTextColorChange($event)\"\r\n        [defaultColorName]=\"config.defaultTextColor\"\r\n        ></text-color>\r\n\r\n        <vertical-line></vertical-line>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableBulletList\"\r\n        tooltip=\"Bullet list Ctrl+Shift+8\"\r\n        [isSelected]=\"isBulletList\"\r\n        [isDisabled]=\"textStyle !== 'p'\"\r\n        (click)=\"onBulletListClick()\"\r\n        ><span class=\"button-icon bullet-list\" [class.disabled-bullet-list]=\"textStyle !== 'p'\"></span></universal-button>\r\n\r\n        <universal-button \r\n        *ngIf=\"this.config.enableNumberedList\"\r\n        tooltip=\"Numbered list Ctrl+Shift+7\"\r\n        [isSelected]=\"isNumberedList\"\r\n        [isDisabled]=\"textStyle !== 'p'\"\r\n        (click)=\"onNumberedListClick()\"\r\n        ><span class=\"button-icon numbered-list\" [class.disabled-numbered-list]=\"textStyle !== 'p'\"></span></universal-button>\r\n        \r\n        <vertical-line></vertical-line>\r\n\r\n        <universal-button \r\n        class=\"mention-button\"\r\n        *ngIf=\"this.config.enableMention\"\r\n        tooltip=\"Mention @\"\r\n        (click)=\"onMentionClick()\"\r\n        ><span style=\"width: 20px;\">@</span></universal-button>\r\n    </div>\r\n\r\n    \r\n    <div\r\n        #editor  \r\n        class=\"universal-editor-content\"\r\n        [attr.contenteditable]=\"config.contenteditable\"\r\n        [attr.placeholderValue]=\"config.placeholderText\"\r\n        [innerHTML]=\"innerHtml\"\r\n        (input)=\"onInput($event)\"\r\n        (keydown)=\"onKeydown($event)\"\r\n    >\r\n    </div>\r\n        \r\n\r\n    <div class=\"universal-editor-mention-backdrop\" *ngIf=\"this.config.enableMention\"></div>\r\n    <div class=\"universal-editor-mention\" *ngIf=\"this.config.enableMention\">\r\n        <div *ngFor=\"let user of filteredUsers\">\r\n            <mention-user \r\n                [user]=\"user\"\r\n                (click)=\"onSelectUser(user)\"\r\n                (mouseenter)=\"onMouseEnter(user)\"\r\n                >\r\n            </mention-user>\r\n        </div>\r\n        <div *ngIf=\"filteredUsers.length === 0\">\r\n            <mention-user>\r\n            </mention-user>\r\n        </div>    \r\n    </div>\r\n\r\n</div>\r\n\r\n\r\n", styles: [".universal-editor{width:100%;height:100%}.universal-editor-header{height:40px;border-color:#8692a6;border-width:2px;border-style:solid;display:flex;flex-direction:row;justify-content:left;align-items:center;padding:0 10px}.universal-editor-content{border-color:#8692a6;border-width:2px;border-style:solid;height:100%;min-height:80px;position:relative;padding:15px 20px 0;overflow-y:auto}.universal-editor-content:empty:before{content:attr(placeholderValue);pointer-events:none;color:#8692a6}.universal-editor-mention{border-color:#8692a6;border-width:2px;border-style:solid;display:none;position:absolute;max-height:300px;overflow-y:auto;z-index:11}.universal-editor-mention-backdrop{display:none;position:fixed;inset:0;z-index:10}:host ::ng-deep .universal-tag{color:#00f}:host ::ng-deep .universal-editor-tag{color:red}.universal-editor-content p{margin-top:0!important}:host ::ng-deep p,:host ::ng-deep h1,:host ::ng-deep h2,:host ::ng-deep h3,:host ::ng-deep h4,:host ::ng-deep h5,:host ::ng-deep h6{margin-top:0}:host ::ng-deep .tooltip{background-color:gray;color:#fff;padding:4px 8px;border-radius:4px;position:absolute;z-index:1000;font-size:12px;font-weight:300}.button-icon{background-size:20px;background-position:center center;background-repeat:no-repeat;width:20px;height:20px;display:inline-block;position:relative;vertical-align:middle}.bold{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M287.54-207.001v-545.998h201.414q63.199 0 114.122 39.401 50.923 39.402 50.923 106.214 0 44.845-21.154 74.115-21.154 29.269-46.154 43.082 31.769 11.572 59.269 43.918 27.5 32.346 27.5 85.423 0 78.691-58.569 116.268t-117.735 37.577H287.54Zm91.997-85.69h113.916q47.547 0 66.586-26.231t19.039-50.309q0-24.078-19.539-50.308Q540-445.77 490.923-445.77H379.537v153.079Zm0-234.308h103.77q36.462 0 58.309-21.346 21.847-21.347 21.847-49.424 0-30.924-22.687-50.54-22.686-19.615-55.629-19.615h-105.61v140.925Z%22%2F%3E%3C%2Fsvg%3E\")}.italic{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M231.77-207.001v-68.306h152.692l133.616-409.386H361.386v-68.306h374.152v68.306H587.153L453.537-275.307h152.385v68.306H231.77Z%22%2F%3E%3C%2Fsvg%3E\")}.underline{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M253.847-179.003v-51.998h452.306v51.998H253.847ZM480-306.848q-88.307 0-137.153-53.053-48.846-53.053-48.846-142.264V-799.46h68.365v300.936q0 57.464 30.658 92.033t87.01 34.569q56.351 0 86.997-34.569t30.646-92.033V-799.46h68.322v297.295q0 89.211-48.846 142.264Q568.307-306.848 480-306.848Z%22%2F%3E%3C%2Fsvg%3E\")}.strikethrough{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M212.001-370.001v-51.998h535.998v51.998H212.001Zm0-168v-51.998h535.998v51.998H212.001Z%22%2F%3E%3C%2Fsvg%3E\")}.subscript{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M707.691-164.001v-87.208q0-18.792 12.646-31.638 12.647-12.846 31.508-12.846h44.154v-44.923h-88.308V-384h87.538q18.862 0 31.508 12.599 12.646 12.598 12.646 31.39v43.219q0 18.791-12.646 31.637t-31.508 12.846h-44.153v44.923h88.307v43.385H707.691ZM292.694-300.309l150.153-233.845-138.768-213.845h63.481l110.825 174.847h-1.539L593-747.999h63.306L515.768-534.154l151.538 233.845H604L480.846-492.078h1.539L356-300.309h-63.306Z%22%2F%3E%3C%2Fsvg%3E\")}.superscript{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M707.691-576v-87.208q0-18.791 12.646-31.637 12.647-12.846 31.508-12.846h44.154v-44.923h-88.308v-43.385h87.538q18.862 0 31.508 12.599t12.646 31.39v43.219q0 18.792-12.646 31.638t-31.508 12.846h-44.153v44.923h88.307V-576H707.691ZM292.694-212.001l150.153-233.845-138.768-213.845h63.481l110.825 174.846h-1.539L593-659.691h63.306L515.768-445.846l151.538 233.845H604l-123.154-191.77h1.539L356-212.001h-63.306Z%22%2F%3E%3C%2Fsvg%3E\")}.clear-format{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22m489.922-565.693-45.306-45.306 15.771-38.079h-54.62l-52.228-52.228h396.767v60.612H522.153l-32.231 75.001Zm268.847 439.767L439.307-445.771l-82.154 190.616h-65.535l101.999-236.307-270.538-270.153 37.153-37.153 635.689 635.689-37.152 37.153Z%22%2F%3E%3C%2Fsvg%3E\")}.bullet-list{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M372.309-250.001v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69ZM222.327-217.463q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Zm0-204q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Zm0-204q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Z%22%2F%3E%3C%2Fsvg%3E\")}.disabled-bullet-list{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath fill%3D%22%23d3d3d3%22 d%3D%22M372.309-250.001v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69ZM222.327-217.463q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Zm0-204q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Zm0-204q-24.235 0-41.28-17.257-17.046-17.258-17.046-41.492 0-24.235 17.258-41.28t41.492-17.045q24.235 0 41.28 17.257 17.045 17.258 17.045 41.492 0 24.235-17.257 41.28-17.258 17.045-41.492 17.045Z%22%2F%3E%3C%2Fsvg%3E\")}.numbered-list{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath d%3D%22M164.001-164.001v-35.692h96v-36.308h-48v-35.692h48v-36.308h-96v-35.692h113.846q7.585 0 12.715 5.131 5.131 5.13 5.131 12.715v55.693q0 7.584-5.131 12.715-5.13 5.13-12.715 5.13 7.585 0 12.715 5.131 5.131 5.131 5.131 12.715v52.616q0 7.584-5.131 12.715-5.13 5.131-12.715 5.131H164.001Zm0-226.153V-480q0-7.584 5.131-12.715t12.715-5.131h78.154v-36.308h-96v-35.692h113.846q7.585 0 12.715 5.131 5.131 5.131 5.131 12.715v72q0 7.584-5.131 12.715-5.13 5.131-12.715 5.131h-78.154v36.308h96v35.692H164.001Zm48-226.153v-144h-48v-35.692h83.692v179.692h-35.692Zm160.308 366.306v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Z%22%2F%3E%3C%2Fsvg%3E\")}.disabled-numbered-list{background-image:url(\"data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%2220%22 viewBox%3D%220 -960 960 960%22 width%3D%2220%22%3E%3Cpath fill%3D%22%23d3d3d3%22 d%3D%22M164.001-164.001v-35.692h96v-36.308h-48v-35.692h48v-36.308h-96v-35.692h113.846q7.585 0 12.715 5.131 5.131 5.13 5.131 12.715v55.693q0 7.584-5.131 12.715-5.13 5.13-12.715 5.13 7.585 0 12.715 5.131 5.131 5.131 5.131 12.715v52.616q0 7.584-5.131 12.715-5.13 5.131-12.715 5.131H164.001Zm0-226.153V-480q0-7.584 5.131-12.715t12.715-5.131h78.154v-36.308h-96v-35.692h113.846q7.585 0 12.715 5.131 5.131 5.131 5.131 12.715v72q0 7.584-5.131 12.715-5.13 5.131-12.715 5.131h-78.154v36.308h96v35.692H164.001Zm48-226.153v-144h-48v-35.692h83.692v179.692h-35.692Zm160.308 366.306v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Zm0-204v-51.998h423.69v51.998h-423.69Z%22%2F%3E%3C%2Fsvg%3E\")}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.MentionUserComponent, selector: "mention-user", inputs: ["user"] }, { kind: "component", type: i3.TextStylesComponent, selector: "text-styles", inputs: ["disabled"], outputs: ["onStyleChange"] }, { kind: "component", type: i4.ButtonComponent, selector: "universal-button", inputs: ["showIcon", "isOpen", "isSelected", "isDisabled", "tooltip", "tooltipPosition"] }, { kind: "component", type: i5.VerticalLineComponent, selector: "vertical-line" }, { kind: "component", type: i6.TextColorComponent, selector: "text-color", inputs: ["defaultColorName", "colors"], outputs: ["onColorChange"] }] }); }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXVuaXZlcnNhbC1lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXVuaXZlcnNhbC1lZGl0b3Ivc3JjL2xpYi9uZ3gtdW5pdmVyc2FsLWVkaXRvci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtdW5pdmVyc2FsLWVkaXRvci9zcmMvbGliL25neC11bml2ZXJzYWwtZWRpdG9yLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEosT0FBTyxFQUFZLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFFLHFCQUFxQixFQUFlLE1BQU0sZUFBZSxDQUFDO0FBRW5FLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFaEQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG9CQUFvQixDQUFDOzs7Ozs7OztBQVEzQyxNQUFNLE9BQU8sMkJBQTJCO0lBTnhDO1FBU0UsZUFBVSxHQUFHLElBQUksQ0FBQztRQUVULFdBQU0sR0FBMEIsSUFBSSxxQkFBcUIsRUFBRSxDQUFDO1FBQzVELGlCQUFZLEdBQWlCLEVBQUUsQ0FBQztRQUUvQixpQkFBWSxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ2hFLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQWEsQ0FBQztRQUM5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QU07c0JBQWQsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVJLFlBQVk7c0JBQXJCLE1BQU07Z0JBQ0csYUFBYTtzQkFBdEIsTUFBTTtnQkFDRyxXQUFXO3NCQUFwQixNQUFNO2dCQUVjLE1BQU07c0JBQTFCLFNBQVM7dUJBQUMsUUFBUTtnQkE2bkJjLFVBQVU7c0JBQTFDLFNBQVM7dUJBQUMsWUFBWTtnQkFrUXFCLFdBQVc7c0JBQXRELFlBQVk7dUJBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBY0MsUUFBUTtzQkFBbEQsWUFBWTt1QkFBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBNklULFlBQVk7c0JBQTNDLFNBQVM7dUJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBWaWV3Q2hpbGQsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTYWZlSHRtbCwgRG9tU2FuaXRpemVyIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBVbml2ZXJzYWxFZGl0b3JDb25maWcsIE1lbnRpb25Vc2VyIH0gZnJvbSAnLi4vcHVibGljLWFwaSc7XHJcbmltcG9ydCB7IFRleHRTdHlsZXNDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGV4dC1zdHlsZXMvdGV4dC1zdHlsZXMuY29tcG9uZW50JztcclxuaW1wb3J0IHsgRWRpdG9yQXBpU2VydmljZSB9IGZyb20gJy4vZWRpdG9yLmFwaS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRWRpdG9yQXBpIH0gZnJvbSAnLi9uZ3gtdW5pdmVyc2FsLWVkaXRvci1hcGknO1xyXG5pbXBvcnQgeyBlcXVhbCB9IGZyb20gJy4vc2hhcmVkL2N1c3RvbS1tZXRob2RzJztcclxuaW1wb3J0IHsgQ29sb3IsIFRleHRDb2xvckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90ZXh0LWNvbG9yL3RleHQtY29sb3IuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29uc3QgfSBmcm9tICcuL3NoYXJlZC9jb25zdGFudHMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtdW5pdmVyc2FsLWVkaXRvcicsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL25neC11bml2ZXJzYWwtZWRpdG9yLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtdW5pdmVyc2FsLWVkaXRvci5jb21wb25lbnQuY3NzJ10sXHJcbiAgcHJvdmlkZXJzOiBbRWRpdG9yQXBpU2VydmljZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neFVuaXZlcnNhbEVkaXRvckNvbXBvbmVudCAgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdHtcclxuICBcclxuICBcclxuICBJU19QUkVNSVVNID0gdHJ1ZTtcclxuICBcclxuICBASW5wdXQoKSBjb25maWc6IFVuaXZlcnNhbEVkaXRvckNvbmZpZyA9IG5ldyBVbml2ZXJzYWxFZGl0b3JDb25maWcoKTtcclxuICBASW5wdXQoKSBtZW50aW9uVXNlcnM6TWVudGlvblVzZXJbXSA9IFtdO1xyXG5cclxuICBAT3V0cHV0KCkgb25DaGFuZ2VUZXh0OiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xyXG4gIEBPdXRwdXQoKSBvbkVkaXRvclJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjxFZGl0b3JBcGk+KCk7XHJcbiAgQE91dHB1dCgpIG9uQ2hhbmdlSWRzOiBFdmVudEVtaXR0ZXI8c3RyaW5nW10+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmdbXT4oKTtcclxuICBcclxuICBAVmlld0NoaWxkKCdlZGl0b3InKSBlZGl0b3IhOiBFbGVtZW50UmVmO1xyXG4gIGVkaXRvcldpZHRoID0gMTAwMDtcclxuICByZWFkb25seSB0ZXh0Q29sb3JzID0gQ29uc3QuY29sb3JzO1xyXG4gIGRlZmF1bHRUZXh0Q29sb3I6Q29sb3IgfCB1bmRlZmluZWQ7XHJcbiAgaW5uZXJIdG1sITogU2FmZUh0bWw7XHJcbiAgcHJpdmF0ZSBlbCA9IGluamVjdChFbGVtZW50UmVmKTtcclxuICBwcml2YXRlIHNhbml0aXplciA9IGluamVjdChEb21TYW5pdGl6ZXIpO1xyXG4gIHByaXZhdGUgYXBpU2VydmljZSA9IGluamVjdChFZGl0b3JBcGlTZXJ2aWNlKTtcclxuXHJcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zID0gbmV3IFN1YnNjcmlwdGlvbigpO1xyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcclxuICAgICAgdGhpcy5hcGlTZXJ2aWNlLmJvbGQkLnN1YnNjcmliZSgoKSA9PiB0aGlzLm9uU2VsZWN0Qm9sZCgpKVxyXG4gICAgKTtcclxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXHJcbiAgICAgICAgdGhpcy5hcGlTZXJ2aWNlLml0YWxpYyQuc3Vic2NyaWJlKCgpID0+IHRoaXMub25TZWxlY3RJdGFsaWMoKSlcclxuICAgICk7XHJcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxyXG4gICAgICAgIHRoaXMuYXBpU2VydmljZS51bmRlcmxpbmUkLnN1YnNjcmliZSgoKSA9PiB0aGlzLm9uU2VsZWN0VW5kZXJsaW5lKCkpXHJcbiAgICApO1xyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcclxuICAgICAgICB0aGlzLmFwaVNlcnZpY2Uuc3RyaWtldGhyb3VnaCQuc3Vic2NyaWJlKCgpID0+IHRoaXMub25TZWxlY3RTdHJpa2V0aHJvdWdoKCkpXHJcbiAgICApO1xyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcclxuICAgICAgICB0aGlzLmFwaVNlcnZpY2Uuc3Vic2NyaXB0JC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5vblNlbGVjdFN1YnNjcmlwdCgpKVxyXG4gICAgKTtcclxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXHJcbiAgICAgICAgdGhpcy5hcGlTZXJ2aWNlLnN1cGVyc2NyaXB0JC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5vblNlbGVjdFN1cGVyc2NyaXB0KCkpXHJcbiAgICApO1xyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcclxuICAgICAgICB0aGlzLmFwaVNlcnZpY2UubWVudGlvbiQuc3Vic2NyaWJlKCgpID0+IHRoaXMub25NZW50aW9uQ2xpY2soKSlcclxuICAgICk7XHJcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxyXG4gICAgICAgIHRoaXMuYXBpU2VydmljZS5jbGVhckZvcm1hdHRpbmckLnN1YnNjcmliZSgoKSA9PiB0aGlzLm9uQ2xlYXJGb3JtYXR0aW5nKCkpXHJcbiAgICApO1xyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcclxuICAgICAgICB0aGlzLmFwaVNlcnZpY2UudGV4dFN0eWxlJC5zdWJzY3JpYmUoKHN0eWxlKSA9PiB0aGlzLm9uU3R5bGVDaGFuZ2Uoc3R5bGUpKVxyXG4gICAgKTtcclxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXHJcbiAgICAgICAgdGhpcy5hcGlTZXJ2aWNlLnRleHRDb2xvciQuc3Vic2NyaWJlKChjb2xvcikgPT4gdGhpcy5vblRleHRDb2xvckNoYW5nZShjb2xvcikpXHJcbiAgICApO1xyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcclxuICAgICAgICB0aGlzLmFwaVNlcnZpY2UuaW5uZXJIVE1MJC5zdWJzY3JpYmUoKGh0bWwpID0+IHtcclxuICAgICAgICAgIGlmKHR5cGVvZiBodG1sID09PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXJIdG1sID0gdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwoaHRtbCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0aGlzLmlubmVySHRtbCA9IGh0bWw7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICk7XHJcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxyXG4gICAgICB0aGlzLmFwaVNlcnZpY2UuYnVsbGV0TGlzdCQuc3Vic2NyaWJlKCgpID0+IHRoaXMub25CdWxsZXRMaXN0Q2xpY2soKSlcclxuICAgICk7XHJcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxyXG4gICAgICB0aGlzLmFwaVNlcnZpY2UubnVtYmVyZWRMaXN0JC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5vbk51bWJlcmVkTGlzdENsaWNrKCkpXHJcbiAgICApO1xyXG4gICAgXHJcbiAgICB0aGlzLmRlZmF1bHRUZXh0Q29sb3IgPSB0aGlzLnRleHRDb2xvcnMuZmluZChjb2xvciA9PiBjb2xvci5jb2xvck5hbWUgPSB0aGlzLmNvbmZpZy5kZWZhdWx0VGV4dENvbG9yKTtcclxuICAgIGlmKHRoaXMuZGVmYXVsdFRleHRDb2xvcil7XHJcbiAgICAgIHRoaXMuZGVmYXVsdFRleHRDb2xvci5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRDb2xvciA9IHRoaXMuZGVmYXVsdFRleHRDb2xvcjtcclxuICAgIH0gXHJcblxyXG4gICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICB0aGlzLm9uRWRpdG9yUmVhZHkuZW1pdChuZXcgRWRpdG9yQXBpKHRoaXMuYXBpU2VydmljZSkpO1xyXG4gICAgICBpZih0aGlzLmNvbmZpZy5pbml0aWFsSW5uZXJIVE1MKXtcclxuICAgICAgICBpZih0eXBlb2YgdGhpcy5jb25maWcuaW5pdGlhbElubmVySFRNTCA9PT0gJ3N0cmluZycpe1xyXG4gICAgICAgICAgdGhpcy5pbm5lckh0bWwgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbCh0aGlzLmNvbmZpZy5pbml0aWFsSW5uZXJIVE1MKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIHRoaXMuaW5uZXJIdG1sID0gdGhpcy5jb25maWcuaW5pdGlhbElubmVySFRNTDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5lZGl0b3JXaWR0aCA9IHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XHJcbiAgICAgIC8vIHNldCBlZGl0b3Igc2l6ZVxyXG4gICAgfSwwKTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpe1xyXG4gICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoKT0+e1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnVuc3Vic2NyaWJlKCk7XHJcbiAgfVxyXG5cclxuICBvbktleWRvd24oZXZlbnQ6S2V5Ym9hcmRFdmVudCl7ICBcclxuICAgIC8vY29uc29sZS5sb2coZXZlbnQpXHJcbiAgICAvLyBNRU5USU9OIFBBUlRcclxuICAgIGlmKHRoaXMuaXNNZW50aW9uRHJvcGRvd25PcGVuKXtcclxuICAgICAgaWYoZXZlbnQua2V5ID09PSAnQXJyb3dEb3duJyAmJiB0aGlzLmVudGVyZWRVc2VyKXtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGlmKHRoaXMuZW50ZXJlZFVzZXIuaW5kZXggPCB0aGlzLmZpbHRlcmVkVXNlcnMubGVuZ3RoIC0gMSl7XHJcbiAgICAgICAgICBjb25zdCBuZXdJbmRleCA9IHRoaXMuZW50ZXJlZFVzZXIuaW5kZXggKyAxO1xyXG4gICAgICAgICAgdGhpcy5maWx0ZXJlZFVzZXJzID0gdGhpcy5maWx0ZXJlZFVzZXJzLm1hcCh1c2VyID0+e1xyXG4gICAgICAgICAgICByZXR1cm57XHJcbiAgICAgICAgICAgICAgLi4udXNlcixcclxuICAgICAgICAgICAgICBpc01vdXNlRW50ZXJlZCA6IHVzZXIuaW5kZXggPT09IG5ld0luZGV4LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRoaXMuZW50ZXJlZFVzZXIgPSB0aGlzLmZpbHRlcmVkVXNlcnNbbmV3SW5kZXhdO1xyXG4gICAgICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnVuaXZlcnNhbC1lZGl0b3ItdXNlcicpO1xyXG4gICAgICAgICAgaWYgKCFpdGVtcy5sZW5ndGgpIHJldHVybjtcclxuICAgICAgICAgIGl0ZW1zW25ld0luZGV4XS5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICduZWFyZXN0JyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZihldmVudC5rZXkgPT09ICdBcnJvd1VwJyl7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBpZih0aGlzLmVudGVyZWRVc2VyICYmIHRoaXMuZW50ZXJlZFVzZXIuaW5kZXggPiAwKXtcclxuICAgICAgICAgIGNvbnN0IG5ld0luZGV4ID0gdGhpcy5lbnRlcmVkVXNlci5pbmRleCAtIDE7XHJcbiAgICAgICAgICB0aGlzLmZpbHRlcmVkVXNlcnMgPSB0aGlzLmZpbHRlcmVkVXNlcnMubWFwKHVzZXIgPT57XHJcbiAgICAgICAgICAgIHJldHVybntcclxuICAgICAgICAgICAgICAuLi51c2VyLFxyXG4gICAgICAgICAgICAgIGlzTW91c2VFbnRlcmVkIDogdXNlci5pbmRleCA9PT0gbmV3SW5kZXgsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgdGhpcy5lbnRlcmVkVXNlciA9IHRoaXMuZmlsdGVyZWRVc2Vyc1tuZXdJbmRleF07XHJcbiAgICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudW5pdmVyc2FsLWVkaXRvci11c2VyJyk7XHJcbiAgICAgICAgICBpZiAoIWl0ZW1zLmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgICAgICAgaXRlbXNbbmV3SW5kZXhdLnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6ICdzbW9vdGgnLCBibG9jazogJ25lYXJlc3QnIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKGV2ZW50LmtleSA9PT0gJ1RhYicgfHwgZXZlbnQua2V5ID09PSAnRW50ZXInKXtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGlmKHRoaXMuZW50ZXJlZFVzZXIpeyAgICAgICAgIFxyXG4gICAgICAgICAgdGhpcy5vblNlbGVjdFVzZXIodGhpcy5lbnRlcmVkVXNlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICB0aGlzLm9uQ2FuY2VsU2VsZWN0VXNlcihmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYoZXZlbnQua2V5ID09PSAnQmFja3NwYWNlJyAmJiAhdGhpcy5zZWFyY2hVc2VyVGV4dCl7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0aGlzLm9uQ2FuY2VsU2VsZWN0VXNlcih0cnVlKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKGV2ZW50LmtleSA9PT0gJ0VzY2FwZScpe1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5vbkNhbmNlbFNlbGVjdFVzZXIoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZihldmVudC5rZXkgPT09ICdiJyAmJiBldmVudC5jdHJsS2V5KXtcclxuICAgICAgY29uc3QgdGFnID0gJ3N0cm9uZyc7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGlmKCF0aGlzLmlzTWVudGlvbkRyb3Bkb3duT3BlbiAmJiB0aGlzLmNvbmZpZy5lbmFibGVCb2xkKXtcclxuICAgICAgICB0aGlzLmlzQm9sZCA9ICF0aGlzLmlzQm9sZDtcclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRUZXh0U3R5bGVFbGVtZW50KXtcclxuICAgICAgICAgIGlmKHRoaXMuaXNCb2xkKXtcclxuICAgICAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcclxuICAgICAgICAgICAgbGV0IGVsZW1UZXh0ID0gJ1xcdTIwMEInO1xyXG4gICAgICAgICAgICBpZighdGhpcy5jdXJyZW50VGV4dFN0eWxlRWxlbWVudC50ZXh0Q29udGVudCl7IC8vIGVtcHR5IHBcclxuICAgICAgICAgICAgICBjb25zdCBzcGFjZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGVsZW1UZXh0KTtcclxuICAgICAgICAgICAgICBlbGVtLmFwcGVuZENoaWxkKHNwYWNlKTtcclxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0U3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGVsZW0pO1xyXG4gICAgICAgICAgICAgIHRoaXMuc2V0Q3Vyc29yUG9zaXRpb25BZnRlcihzcGFjZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7ICAvL3dpdGggY29udGVudFxyXG4gICAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0ZWRUZXh0KXtcclxuICAgICAgICAgICAgICAgIGVsZW1UZXh0ID0gdGhpcy5zZWxlY3RlZFRleHQ7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGNvbnN0IHNwYWNlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZWxlbVRleHQpO1xyXG4gICAgICAgICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoc3BhY2UpO1xyXG4gICAgICAgICAgICAgIHRoaXMuYWRkRWxlbWVudChlbGVtLCB0aGlzLmN1cnJlbnRUZXh0U3R5bGVFbGVtZW50KTtcclxuICAgICAgICAgICAgICB0aGlzLnNldEN1cnNvclBvc2l0aW9uQWZ0ZXIoZWxlbSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Qm9sZEVsZW1lbnQgPSBlbGVtO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50Qm9sZEVsZW1lbnQgJiYgdGhpcy5jdXJyZW50Qm9sZEVsZW1lbnQudGV4dENvbnRlbnQgPT09ICdcXHUyMDBCJyl7IC8vIGVtcHR5IHN0cm9uZ1xyXG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudEJvbGRFbGVtZW50LnJlbW92ZSgpOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYodGhpcy5jdXJyZW50Qm9sZEVsZW1lbnQpeyAvLyB3aXRoIGNvbnRlbnRcclxuICAgICAgICAgICAgICB0aGlzLnNwbGl0QXRDYXJldCh0aGlzLmN1cnJlbnRCb2xkRWxlbWVudCwgZmFsc2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYoZXZlbnQua2V5ID09PSAnaScgJiYgZXZlbnQuY3RybEtleSl7XHJcbiAgICAgIGNvbnN0IHRhZyA9ICdlbSc7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGlmKCF0aGlzLmlzTWVudGlvbkRyb3Bkb3duT3BlbiAmJiB0aGlzLmNvbmZpZy5lbmFibGVJdGFsaWMpe1xyXG4gICAgICAgIHRoaXMuaXNJdGFsaWMgPSAhdGhpcy5pc0l0YWxpYztcclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRUZXh0U3R5bGVFbGVtZW50KXtcclxuICAgICAgICAgIGlmKHRoaXMuaXNJdGFsaWMpe1xyXG4gICAgICAgICAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xyXG4gICAgICAgICAgICBsZXQgZWxlbVRleHQgPSAnXFx1MjAwQic7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmN1cnJlbnRUZXh0U3R5bGVFbGVtZW50LnRleHRDb250ZW50KXsgLy8gZW1wdHkgcFxyXG4gICAgICAgICAgICAgIGNvbnN0IHNwYWNlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZWxlbVRleHQpO1xyXG4gICAgICAgICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoc3BhY2UpO1xyXG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFRleHRTdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZXRDdXJzb3JQb3NpdGlvbkFmdGVyKHNwYWNlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXsgIC8vd2l0aCBjb250ZW50XHJcbiAgICAgICAgICAgICAgaWYodGhpcy5zZWxlY3RlZFRleHQpe1xyXG4gICAgICAgICAgICAgICAgZWxlbVRleHQgPSB0aGlzLnNlbGVjdGVkVGV4dDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgY29uc3Qgc3BhY2UgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShlbGVtVGV4dCk7XHJcbiAgICAgICAgICAgICAgZWxlbS5hcHBlbmRDaGlsZChzcGFjZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5hZGRFbGVtZW50KGVsZW0sIHRoaXMuY3VycmVudFRleHRTdHlsZUVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgIHRoaXMuc2V0Q3Vyc29yUG9zaXRpb25BZnRlcihlbGVtLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCb2xkRWxlbWVudCA9IGVsZW07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRJdGFsaWNFbGVtZW50ICYmIHRoaXMuY3VycmVudEl0YWxpY0VsZW1lbnQudGV4dENvbnRlbnQgPT09ICdcXHUyMDBCJyl7IC8vIGVtcHR5IGl0YWxpY1xyXG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudEl0YWxpY0VsZW1lbnQucmVtb3ZlKCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0aGlzLmN1cnJlbnRJdGFsaWNFbGVtZW50KXsgLy8gd2l0aCBjb250ZW50XHJcbiAgICAgICAgICAgICAgdGhpcy5zcGxpdEF0Q2FyZXQodGhpcy5jdXJyZW50SXRhbGljRWxlbWVudCwgZmFsc2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYoZXZlbnQua2V5ID09PSAndScgJiYgZXZlbnQuY3RybEtleSl7XHJcbiAgICAgIGNvbnN0IHRhZyA9ICd1JztcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgaWYoIXRoaXMuaXNNZW50aW9uRHJvcGRvd25PcGVuICYmIHRoaXMuY29uZmlnLmVuYWJsZVVuZGVybGluZSl7XHJcbiAgICAgICAgdGhpcy5pc1VuZGVybGluZSA9ICF0aGlzLmlzVW5kZXJsaW5lO1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFRleHRTdHlsZUVsZW1lbnQpe1xyXG4gICAgICAgICAgaWYodGhpcy5pc1VuZGVybGluZSl7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XHJcbiAgICAgICAgICAgIGxldCBlbGVtVGV4dCA9ICdcXHUyMDBCJztcclxuICAgICAgICAgICAgaWYoIXRoaXMuY3VycmVudFRleHRTdHlsZUVsZW1lbnQudGV4dENvbnRlbnQpeyAvLyBlbXB0eSBwXHJcbiAgICAgICAgICAgICAgY29uc3Qgc3BhY2UgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShlbGVtVGV4dCk7XHJcbiAgICAgICAgICAgICAgZWxlbS5hcHBlbmRDaGlsZChzcGFjZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VGV4dFN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChlbGVtKTtcclxuICAgICAgICAgICAgICB0aGlzLnNldEN1cnNvclBvc2l0aW9uQWZ0ZXIoc3BhY2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNleyAgLy93aXRoIGNvbnRlbnRcclxuICAgICAgICAgICAgICBpZih0aGlzLnNlbGVjdGVkVGV4dCl7XHJcbiAgICAgICAgICAgICAgICBlbGVtVGV4dCA9IHRoaXMuc2VsZWN0ZWRUZXh0O1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBjb25zdCBzcGFjZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGVsZW1UZXh0KTtcclxuICAgICAgICAgICAgICBlbGVtLmFwcGVuZENoaWxkKHNwYWNlKTtcclxuICAgICAgICAgICAgICB0aGlzLmFkZEVsZW1lbnQoZWxlbSwgdGhpcy5jdXJyZW50VGV4dFN0eWxlRWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZXRDdXJzb3JQb3NpdGlvbkFmdGVyKGVsZW0sIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJvbGRFbGVtZW50ID0gZWxlbTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY3VycmVudFVuZGVybGluZUVsZW1lbnQgJiYgdGhpcy5jdXJyZW50VW5kZXJsaW5lRWxlbWVudC50ZXh0Q29udGVudCA9PT0gJ1xcdTIwMEInKXsgLy8gZW1wdHkgXHJcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VW5kZXJsaW5lRWxlbWVudC5yZW1vdmUoKTsgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMuY3VycmVudFVuZGVybGluZUVsZW1lbnQpeyAvLyB3aXRoIGNvbnRlbnRcclxuICAgICAgICAgICAgICB0aGlzLnNwbGl0QXRDYXJldCh0aGlzLmN1cnJlbnRVbmRlcmxpbmVFbGVtZW50LCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZihldmVudC5rZXkgPT09ICdTJyAmJiBldmVudC5jdHJsS2V5ICYmIGV2ZW50LnNoaWZ0S2V5KXtcclxuICAgICAgY29uc3QgdGFnID0gJ3MnO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZighdGhpcy5pc01lbnRpb25Ecm9wZG93bk9wZW4gJiYgdGhpcy5jb25maWcuZW5hYmxlU3RyaWtldGhyb3VnaCl7XHJcbiAgICAgICAgdGhpcy5pc1N0cmlrZXRocm91Z2ggPSAhdGhpcy5pc1N0cmlrZXRocm91Z2g7XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VGV4dFN0eWxlRWxlbWVudCl7XHJcbiAgICAgICAgICBpZih0aGlzLmlzU3RyaWtldGhyb3VnaCl7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XHJcbiAgICAgICAgICAgIGxldCBlbGVtVGV4dCA9ICdcXHUyMDBCJztcclxuICAgICAgICAgICAgaWYoIXRoaXMuY3VycmVudFRleHRTdHlsZUVsZW1lbnQudGV4dENvbnRlbnQpeyAvLyBlbXB0eSBwXHJcbiAgICAgICAgICAgICAgY29uc3Qgc3BhY2UgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShlbGVtVGV4dCk7XHJcbiAgICAgICAgICAgICAgZWxlbS5hcHBlbmRDaGlsZChzcGFjZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VGV4dFN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChlbGVtKTtcclxuICAgICAgICAgICAgICB0aGlzLnNldEN1cnNvclBvc2l0aW9uQWZ0ZXIoc3BhY2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNleyAgLy93aXRoIGNvbnRlbnRcclxuICAgICAgICAgICAgICBpZih0aGlzLnNlbGVjdGVkVGV4dCl7XHJcbiAgICAgICAgICAgICAgICBlbGVtVGV4dCA9IHRoaXMuc2VsZWN0ZWRUZXh0O1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBjb25zdCBzcGFjZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGVsZW1UZXh0KTtcclxuICAgICAgICAgICAgICBlbGVtLmFwcGVuZENoaWxkKHNwYWNlKTtcclxuICAgICAgICAgICAgICB0aGlzLmFkZEVsZW1lbnQoZWxlbSwgdGhpcy5jdXJyZW50VGV4dFN0eWxlRWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZXRDdXJzb3JQb3NpdGlvbkFmdGVyKGVsZW0sIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJvbGRFbGVtZW50ID0gZWxlbTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY3VycmVudFN0cmlrZXRocm91Z2hFbGVtZW50ICYmIHRoaXMuY3VycmVudFN0cmlrZXRocm91Z2hFbGVtZW50LnRleHRDb250ZW50ID09PSAnXFx1MjAwQicpeyAvLyBlbXB0eSBcclxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTdHJpa2V0aHJvdWdoRWxlbWVudC5yZW1vdmUoKTsgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMuY3VycmVudFN0cmlrZXRocm91Z2hFbGVtZW50KXsgLy8gd2l0aCBjb250ZW50XHJcbiAgICAgICAgICAgICAgdGhpcy5zcGxpdEF0Q2FyZXQodGhpcy5jdXJyZW50U3RyaWtldGhyb3VnaEVsZW1lbnQsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmKGV2ZW50LmNvZGUgPT09ICdDb21tYScgJiYgZXZlbnQuY3RybEtleSAmJiBldmVudC5zaGlmdEtleSl7XHJcbiAgICAgIGNvbnN0IHRhZyA9ICdzdWInO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZighdGhpcy5pc01lbnRpb25Ecm9wZG93bk9wZW4gJiYgdGhpcy5jb25maWcuZW5hYmxlU3Vic2NyaXB0KXtcclxuICAgICAgICB0aGlzLmlzU3Vic2NyaXB0ID0gIXRoaXMuaXNTdWJzY3JpcHQ7XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VGV4dFN0eWxlRWxlbWVudCl7XHJcbiAgICAgICAgICBpZih0aGlzLmlzU3Vic2NyaXB0KXtcclxuICAgICAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcclxuICAgICAgICAgICAgbGV0IGVsZW1UZXh0ID0gJ1xcdTIwMEInO1xyXG4gICAgICAgICAgICBpZighdGhpcy5jdXJyZW50VGV4dFN0eWxlRWxlbWVudC50ZXh0Q29udGVudCl7IC8vIGVtcHR5IHBcclxuICAgICAgICAgICAgICBjb25zdCBzcGFjZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGVsZW1UZXh0KTtcclxuICAgICAgICAgICAgICBlbGVtLmFwcGVuZENoaWxkKHNwYWNlKTtcclxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0U3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGVsZW0pO1xyXG4gICAgICAgICAgICAgIHRoaXMuc2V0Q3Vyc29yUG9zaXRpb25BZnRlcihzcGFjZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7ICAvL3dpdGggY29udGVudFxyXG4gICAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0ZWRUZXh0KXtcclxuICAgICAgICAgICAgICAgIGVsZW1UZXh0ID0gdGhpcy5zZWxlY3RlZFRleHQ7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGNvbnN0IHNwYWNlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZWxlbVRleHQpO1xyXG4gICAgICAgICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoc3BhY2UpO1xyXG4gICAgICAgICAgICAgIHRoaXMuYWRkRWxlbWVudChlbGVtLCB0aGlzLmN1cnJlbnRUZXh0U3R5bGVFbGVtZW50KTtcclxuICAgICAgICAgICAgICB0aGlzLnNldEN1cnNvclBvc2l0aW9uQWZ0ZXIoZWxlbSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Qm9sZEVsZW1lbnQgPSBlbGVtO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50U3Vic2NyaXB0RWxlbWVudCAmJiB0aGlzLmN1cnJlbnRTdWJzY3JpcHRFbGVtZW50LnRleHRDb250ZW50ID09PSAnXFx1MjAwQicpeyAvLyBlbXB0eSBcclxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTdWJzY3JpcHRFbGVtZW50LnJlbW92ZSgpOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYodGhpcy5jdXJyZW50U3Vic2NyaXB0RWxlbWVudCl7IC8vIHdpdGggY29udGVudFxyXG4gICAgICAgICAgICAgIHRoaXMuc3BsaXRBdENhcmV0KHRoaXMuY3VycmVudFN1YnNjcmlwdEVsZW1lbnQsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmKGV2ZW50LmNvZGUgPT09ICdQZXJpb2QnICYmIGV2ZW50LmN0cmxLZXkgJiYgZXZlbnQuc2hpZnRLZXkpe1xyXG4gICAgICBjb25zdCB0YWcgPSAnc3VwJztcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgaWYoIXRoaXMuaXNNZW50aW9uRHJvcGRvd25PcGVuICYmIHRoaXMuY29uZmlnLmVuYWJsZVN1cGVyc2NyaXB0KXtcclxuICAgICAgICB0aGlzLmlzU3VwZXJzY3JpcHQgPSAhdGhpcy5pc1N1cGVyc2NyaXB0O1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFRleHRTdHlsZUVsZW1lbnQpe1xyXG4gICAgICAgICAgaWYodGhpcy5pc1N1cGVyc2NyaXB0KXtcclxuICAgICAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcclxuICAgICAgICAgICAgbGV0IGVsZW1UZXh0ID0gJ1xcdTIwMEInO1xyXG4gICAgICAgICAgICBpZighdGhpcy5jdXJyZW50VGV4dFN0eWxlRWxlbWVudC50ZXh0Q29udGVudCl7IC8vIGVtcHR5IHBcclxuICAgICAgICAgICAgICBjb25zdCBzcGFjZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGVsZW1UZXh0KTtcclxuICAgICAgICAgICAgICBlbGVtLmFwcGVuZENoaWxkKHNwYWNlKTtcclxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0U3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGVsZW0pO1xyXG4gICAgICAgICAgICAgIHRoaXMuc2V0Q3Vyc29yUG9zaXRpb25BZnRlcihzcGFjZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7ICAvL3dpdGggY29udGVudFxyXG4gICAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0ZWRUZXh0KXtcclxuICAgICAgICAgICAgICAgIGVsZW1UZXh0ID0gdGhpcy5zZWxlY3RlZFRleHQ7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGNvbnN0IHNwYWNlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZWxlbVRleHQpO1xyXG4gICAgICAgICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoc3BhY2UpO1xyXG4gICAgICAgICAgICAgIHRoaXMuYWRkRWxlbWVudChlbGVtLCB0aGlzLmN1cnJlbnRUZXh0U3R5bGVFbGVtZW50KTtcclxuICAgICAgICAgICAgICB0aGlzLnNldEN1cnNvclBvc2l0aW9uQWZ0ZXIoZWxlbSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Qm9sZEVsZW1lbnQgPSBlbGVtO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50U3VwZXNyc2NpcHRFbGVtZW50ICYmIHRoaXMuY3VycmVudFN1cGVzcnNjaXB0RWxlbWVudC50ZXh0Q29udGVudCA9PT0gJ1xcdTIwMEInKXsgLy8gZW1wdHkgXHJcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3VwZXNyc2NpcHRFbGVtZW50LnJlbW92ZSgpOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYodGhpcy5jdXJyZW50U3VwZXNyc2NpcHRFbGVtZW50KXsgLy8gd2l0aCBjb250ZW50XHJcbiAgICAgICAgICAgICAgdGhpcy5zcGxpdEF0Q2FyZXQodGhpcy5jdXJyZW50U3VwZXNyc2NpcHRFbGVtZW50LCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZihldmVudC5rZXkgPT09ICdcXFxcJyAmJiBldmVudC5jdHJsS2V5KXtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgaWYoIXRoaXMuaXNNZW50aW9uRHJvcGRvd25PcGVuICYmIHRoaXMuY3VycmVudFRleHRTdHlsZUVsZW1lbnQgJiYgdGhpcy5oaWdoZXN0Rm9ybWF0RWxlbWVudCl7XHJcbiAgICAgICAgdGhpcy5zcGxpdEF0Q2FyZXQodGhpcy5oaWdoZXN0Rm9ybWF0RWxlbWVudCwgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZihldmVudC5jb2RlID09PSAnQ3VzdG9tVGV4dENvbG9yJyl7XHJcbiAgICAgIGNvbnN0IHRhZyA9ICdzcGFuJztcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgaWYoIXRoaXMuaXNNZW50aW9uRHJvcGRvd25PcGVuICYmIHRoaXMuY29uZmlnLmVuYWJsZVRleHRDb2xvciAmJiB0aGlzLmN1cnJlbnRUZXh0U3R5bGVFbGVtZW50KXtcclxuICAgICAgICBpZihlcXVhbCh0aGlzLnNlbGVjdGVkQ29sb3IsIHRoaXMuZGVmYXVsdFRleHRDb2xvcikpe1xyXG4gICAgICAgICAgaWYodGhpcy5jdXJyZW50VGV4dFN0eWxlRWxlbWVudC50ZXh0Q29udGVudCAmJiB0aGlzLmN1cnJlbnRUZXh0Q29sb3JFbGVtZW50KXtcclxuICAgICAgICAgICAgdGhpcy5zcGxpdEF0Q2FyZXQodGhpcy5jdXJyZW50VGV4dENvbG9yRWxlbWVudCwgZmFsc2UsIGZhbHNlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIGlmKHRoaXMuY3VycmVudFRleHRDb2xvckVsZW1lbnQpeyAvLyBmcm9tIGNvbG9yIHRvIGNvbG9yXHJcbiAgICAgICAgICAgIHRoaXMuc3BsaXRBdENhcmV0KHRoaXMuY3VycmVudFRleHRDb2xvckVsZW1lbnQsIGZhbHNlLCB0cnVlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYodGhpcy5zZWxlY3RlZENvbG9yKXsgLy9mcm9tIGRlZmF1bHQgdG8gY29sb3JcclxuICAgICAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcclxuICAgICAgICAgICAgZWxlbS5zdHlsZS5jb2xvciA9IHRoaXMuc2VsZWN0ZWRDb2xvci5jb2xvckNvZGU7XHJcbiAgICAgICAgICAgIGVsZW0uY2xhc3NOYW1lID0gJ3VuaXZlcnNhbC1lZGl0b3ItdGV4dC1jb2xvcic7XHJcbiAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCdjdXN0b20tdGV4dC1jb2xvci1uYW1lJywgdGhpcy5zZWxlY3RlZENvbG9yLmNvbG9yTmFtZSk7XHJcbiAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCdjdXN0b20tdGV4dC1jb2xvci1jb2RlJywgdGhpcy5zZWxlY3RlZENvbG9yLmNvbG9yQ29kZSk7XHJcbiAgICAgICAgICAgIGxldCBlbGVtVGV4dCA9ICdcXHUyMDBCJztcclxuICAgICAgICAgICAgaWYoIXRoaXMuY3VycmVudFRleHRTdHlsZUVsZW1lbnQudGV4dENvbnRlbnQpeyAvLyBlbXB0eSBwXHJcbiAgICAgICAgICAgICAgY29uc3Qgc3BhY2UgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShlbGVtVGV4dCk7XHJcbiAgICAgICAgICAgICAgZWxlbS5hcHBlbmRDaGlsZChzcGFjZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VGV4dFN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChlbGVtKTtcclxuICAgICAgICAgICAgICB0aGlzLnNldEN1cnNvclBvc2l0aW9uQWZ0ZXIoc3BhY2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNleyAgLy93aXRoIGNvbnRlbnRcclxuICAgICAgICAgICAgICBpZih0aGlzLnNlbGVjdGVkVGV4dCl7XHJcbiAgICAgICAgICAgICAgICBlbGVtVGV4dCA9IHRoaXMuc2VsZWN0ZWRUZXh0O1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBjb25zdCBzcGFjZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGVsZW1UZXh0KTtcclxuICAgICAgICAgICAgICBlbGVtLmFwcGVuZENoaWxkKHNwYWNlKTtcclxuICAgICAgICAgICAgICB0aGlzLmFkZEVsZW1lbnQoZWxlbSwgdGhpcy5jdXJyZW50VGV4dFN0eWxlRWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZXRDdXJzb3JQb3NpdGlvbkFmdGVyKGVsZW0sIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJvbGRFbGVtZW50ID0gZWxlbTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZihldmVudC5jb2RlID09PSAnRGlnaXQ4JyAmJiBldmVudC5jdHJsS2V5ICYmIGV2ZW50LnNoaWZ0S2V5ICYmIHRoaXMudGV4dFN0eWxlID09PSAncCcpe1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZighdGhpcy5pc01lbnRpb25Ecm9wZG93bk9wZW4gJiYgdGhpcy5jb25maWcuZW5hYmxlQnVsbGV0TGlzdCl7XHJcbiAgICAgICAgdGhpcy5pc0J1bGxldExpc3QgPSAhdGhpcy5pc0J1bGxldExpc3Q7XHJcbiAgICAgICAgaWYodGhpcy5pc0J1bGxldExpc3Qpe1xyXG4gICAgICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xyXG4gICAgICAgICAgdWwuY2xhc3NOYW1lID0gJ3VuaXZlcnNhbC1lZGl0b3ItYnVsbGV0LWxpc3QnO1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50QnVsbGV0TGlzdEVsZW1lbnQgPSB1bDtcclxuICAgICAgICAgIHVsLnNldEF0dHJpYnV0ZSgnYnVsbGV0LWxpc3QtaW5kZW50LWxldmVsJywgJzEnKTtcclxuICAgICAgICAgIGxldCBjYXJldEVsZW0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICBpZih0aGlzLmN1cnJlbnRUZXh0U3R5bGVFbGVtZW50KXtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0aW9uICYmIHNlbGVjdGlvbi5yYW5nZUNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJhbmdlID0gc2VsZWN0aW9uLmdldFJhbmdlQXQoMCk7XHJcbiAgICAgICAgICAgICAgY29uc3QgcEVsZW1lbnRzID0gdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwJyk7IFxyXG4gICAgICAgICAgICAgIHBFbGVtZW50cy5mb3JFYWNoKChwOmFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYocmFuZ2UuaW50ZXJzZWN0c05vZGUocCkpe1xyXG4gICAgICAgICAgICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKHApO1xyXG4gICAgICAgICAgICAgICAgICB1bC5hcHBlbmRDaGlsZChsaSk7XHJcbiAgICAgICAgICAgICAgICAgIGNhcmV0RWxlbSA9IHA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hZGRFbGVtZW50KHVsLCB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50KTtcclxuICAgICAgICAgICAgdGhpcy5tZXJnZUFkamFjZW50KCd1bCcpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEN1cnNvclBvc2l0aW9uQWZ0ZXIoY2FyZXRFbGVtLCB0cnVlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgLy8gY3JlYXRlIGVtcHR5IHVsXHJcbiAgICAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgICAgICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICAgICAgICAgcC50ZXh0Q29udGVudCA9ICdcXHUyMDBCJztcclxuICAgICAgICAgICBsaS5hcHBlbmRDaGlsZChwKTtcclxuICAgICAgICAgICB1bC5hcHBlbmRDaGlsZChsaSk7XHJcbiAgICAgICAgICAgdGhpcy5hZGRFbGVtZW50KHVsLCB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50KTtcclxuICAgICAgICAgICB0aGlzLm1lcmdlQWRqYWNlbnQoJ3VsJyk7XHJcbiAgICAgICAgICAgdGhpcy5zZXRDdXJzb3JQb3NpdGlvbkFmdGVyKHAsIHRydWUpO1xyXG4gICAgICAgICAgIHRoaXMuY3VycmVudFRleHRTdHlsZUVsZW1lbnQgPSBwO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuY3VycmVudFRleHRTdHlsZUVsZW1lbnQpe1xyXG4gICAgICAgICAgaWYodGhpcy5jdXJyZW50QnVsbGV0TGlzdEVsZW1lbnQgJiYgKHRoaXMuY3VycmVudEJ1bGxldExpc3RFbGVtZW50LnRleHRDb250ZW50ID09PSAnXFx1MjAwQicgfHwgdGhpcy5jdXJyZW50QnVsbGV0TGlzdEVsZW1lbnQudGV4dENvbnRlbnQgPT09ICcnKSl7IC8vIGVtcHR5IHVsXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJ1bGxldExpc3RFbGVtZW50LnJlcGxhY2VXaXRoKHRoaXMuY3VycmVudFRleHRTdHlsZUVsZW1lbnQpOyAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCdWxsZXRMaXN0RWxlbWVudCA9IHVuZGVmaW5lZDsgICBcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYodGhpcy5jdXJyZW50QnVsbGV0TGlzdEVsZW1lbnQpeyAvLyB3aXRoIGNvbnRlbnRcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0aW9uICYmIHNlbGVjdGlvbi5yYW5nZUNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJhbmdlID0gc2VsZWN0aW9uLmdldFJhbmdlQXQoMCk7XHJcbiAgICAgICAgICAgICAgY29uc3QgbGlFbGVtZW50cyA9IHRoaXMuY3VycmVudEJ1bGxldExpc3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7IFxyXG4gICAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuY3VycmVudEJ1bGxldExpc3RFbGVtZW50LnBhcmVudEVsZW1lbnQ7IFxyXG4gICAgICAgICAgICAgIGxldCB1bDpIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICBsZXQgY2FyZXRFbGVtID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgIGxpRWxlbWVudHMuZm9yRWFjaCgobGksIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihpbmRleCA9PT0gMCAmJiB0aGlzLmN1cnJlbnRCdWxsZXRMaXN0RWxlbWVudCAmJiBwYXJlbnQpe1xyXG4gICAgICAgICAgICAgICAgICBpZihyYW5nZS5pbnRlcnNlY3RzTm9kZShsaSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChsaS5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjYXJldEVsZW0gPSBsaS5maXJzdENoaWxkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShsaS5maXJzdENoaWxkLCB0aGlzLmN1cnJlbnRCdWxsZXRMaXN0RWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVsLmFwcGVuZENoaWxkKGxpKTtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKHVsLCB0aGlzLmN1cnJlbnRCdWxsZXRMaXN0RWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5jdXJyZW50QnVsbGV0TGlzdEVsZW1lbnQgJiYgcGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmKHJhbmdlLmludGVyc2VjdHNOb2RlKGxpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodWwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgdWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAobGkuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY2FyZXRFbGVtID0gbGkuZmlyc3RDaGlsZDtcclxuICAgICAgICAgICAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUobGkuZmlyc3RDaGlsZCwgdGhpcy5jdXJyZW50QnVsbGV0TGlzdEVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHVsKXtcclxuICAgICAgICAgICAgICAgICAgICAgIHVsLmFwcGVuZENoaWxkKGxpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgIHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHVsLmFwcGVuZENoaWxkKGxpKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUodWwsIHRoaXMuY3VycmVudEJ1bGxldExpc3RFbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QnVsbGV0TGlzdEVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QnVsbGV0TGlzdEVsZW1lbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZXRDdXJzb3JQb3NpdGlvbkFmdGVyKGNhcmV0RWxlbSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIG9uSW5wdXQoZXZlbnQ6IGFueSkgeyBcclxuICAgIC8vY29uc29sZS5sb2coZXZlbnQpXHJcbiAgICBjb25zdCBmb250RWxlbWVudHMgPSB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ZvbnQnKTtcclxuICAgIGZvbnRFbGVtZW50cy5mb3JFYWNoKChmb250RWxlbTphbnkpID0+IHtcclxuICAgICAgZm9udEVsZW0ucmVtb3ZlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBGSVJTVCBDSEFSXHJcbiAgICBpZihldmVudC5pbnB1dFR5cGUgPT09ICdpbnNlcnRUZXh0JyAmJiB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LmlubmVySFRNTC5sZW5ndGggPD0gMSl7XHJcbiAgICAgIGxldCBjb29yZHMgPSB0aGlzLmdldENhcmV0Q29vcmRpbmF0ZXMoKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IGNvbnRlbnQgPSBldmVudC5kYXRhO1xyXG4gICAgICBjb250ZW50ID0gYDxzcGFuIGNsYXNzPVwidW5pdmVyc2FsLW1hcmtlclwiPiR7Y29udGVudH08L3NwYW4+YFxyXG4gICAgICBpZihldmVudC5kYXRhID09PSAnQCcgJiYgdGhpcy5jb25maWcuZW5hYmxlTWVudGlvbil7XHJcbiAgICAgICAgY29udGVudCA9IGA8c3BhbiBjbGFzcz1cInVuaXZlcnNhbC10YWdcIj4ke2NvbnRlbnR9PC9zcGFuPmA7XHJcbiAgICAgIH1cclxuICAgICAgaWYodGhpcy5zZWxlY3RlZENvbG9yICYmICFlcXVhbCh0aGlzLnNlbGVjdGVkQ29sb3IsIHRoaXMuZGVmYXVsdFRleHRDb2xvcikpe1xyXG4gICAgICAgIGNvbnRlbnQgPSBgPHNwYW4gY2xhc3M9XCJ1bml2ZXJzYWwtZWRpdG9yLXRleHQtY29sb3JcIiBzdHlsZT1cImNvbG9yOiR7dGhpcy5zZWxlY3RlZENvbG9yLmNvbG9yQ29kZX07XCIgXHJcbiAgICAgICAgY3VzdG9tLXRleHQtY29sb3ItbmFtZT1cIiR7dGhpcy5zZWxlY3RlZENvbG9yLmNvbG9yTmFtZX1cIiBjdXN0b20tdGV4dC1jb2xvci1jb2RlPVwiJHt0aGlzLnNlbGVjdGVkQ29sb3IuY29sb3JDb2RlfVwiPiR7Y29udGVudH08L3NwYW4+YDtcclxuICAgICAgfVxyXG4gICAgICBpZih0aGlzLmlzQm9sZCl7XHJcbiAgICAgICAgY29udGVudCA9IGA8c3Ryb25nPiR7Y29udGVudH08L3N0cm9uZz5gO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKHRoaXMuaXNJdGFsaWMpe1xyXG4gICAgICAgIGNvbnRlbnQgPSBgPGVtPiR7Y29udGVudH08L2VtPmA7XHJcbiAgICAgIH1cclxuICAgICAgaWYodGhpcy5pc1VuZGVybGluZSl7XHJcbiAgICAgICAgY29udGVudCA9IGA8dT4ke2NvbnRlbnR9PC91PmA7XHJcbiAgICAgIH1cclxuICAgICAgaWYodGhpcy5pc1N0cmlrZXRocm91Z2gpe1xyXG4gICAgICAgIGNvbnRlbnQgPSBgPHM+JHtjb250ZW50fTwvcz5gO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKHRoaXMuaXNTdWJzY3JpcHQpe1xyXG4gICAgICAgIGNvbnRlbnQgPSBgPHN1Yj4ke2NvbnRlbnR9PC9zdWI+YDtcclxuICAgICAgfVxyXG4gICAgICBpZih0aGlzLmlzU3VwZXJzY3JpcHQpe1xyXG4gICAgICAgIGNvbnRlbnQgPSBgPHN1cD4ke2NvbnRlbnR9PC9zdXA+YDtcclxuICAgICAgfVxyXG4gICAgICBjb250ZW50ID0gYDwke3RoaXMudGV4dFN0eWxlfT4ke2NvbnRlbnR9PC8ke3RoaXMudGV4dFN0eWxlfT5gO1xyXG5cclxuICAgICAgY29uc3QgZWxlbSA9IHRoaXMuY3JlYXRlRWxlbWVudEZyb21TdHJpbmcoY29udGVudCkgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LmZpcnN0Q2hpbGQ7XHJcbiAgICAgIGlmKHRleHQpe1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQucmVwbGFjZUNoaWxkKGVsZW0sIHRleHQpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZChlbGVtKTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBtYXJrZXIgPSBlbGVtLnF1ZXJ5U2VsZWN0b3IoJy51bml2ZXJzYWwtbWFya2VyJyk7XHJcbiAgICAgIGlmKG1hcmtlciAmJiBtYXJrZXIudGV4dENvbnRlbnQpe1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShtYXJrZXIudGV4dENvbnRlbnQpO1xyXG4gICAgICAgIG1hcmtlci5yZXBsYWNlV2l0aCh0ZXh0KTtcclxuICAgICAgICB0aGlzLnNldEN1cnNvclBvc2l0aW9uQWZ0ZXIodGV4dCwgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgdGhpcy5zZXRDdXJzb3JQb3NpdGlvbkFmdGVyKGVsZW0sIHRydWUpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICdAJyAmJiB0aGlzLmNvbmZpZy5lbmFibGVNZW50aW9uKXsgXHJcbiAgICAgICAgdGhpcy5vcGVuTWVudGlvbkRyb3Bkb3duKGNvb3Jkcy54LCBjb29yZHMueSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBNRU5USU9OIFBBUlRcclxuICAgIGlmKGV2ZW50LmRhdGEgPT09ICdAJyAmJiAhdGhpcy5pc01lbnRpb25Ecm9wZG93bk9wZW4gJiYgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5pbm5lckhUTUwubGVuZ3RoID4gMSAmJiB0aGlzLmNvbmZpZy5lbmFibGVNZW50aW9uICYmIHRoaXMuY3VycmVudFRleHRTdHlsZUVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgY29vcmRzID0gdGhpcy5nZXRDYXJldENvb3JkaW5hdGVzKCk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBpZihldmVudC50eXBlICE9PSAnY3VzdG9tSW5wdXQnKXtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNoYXJCZWZvcmVDYXJldCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGVsZW1UZXh0ID0gYDxzcGFuIGNsYXNzPVwidW5pdmVyc2FsLXRhZ1wiPkA8L3NwYW4+YDsgXHJcbiAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLmNyZWF0ZUVsZW1lbnRGcm9tU3RyaW5nKGVsZW1UZXh0KSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgdGhpcy5hZGRFbGVtZW50KGVsZW0sIHRoaXMuY3VycmVudFRleHRTdHlsZUVsZW1lbnQpO1xyXG4gICAgICB0aGlzLnNldEN1cnNvclBvc2l0aW9uQWZ0ZXIoZWxlbSwgdHJ1ZSk7XHJcblxyXG4gICAgICB0aGlzLm9wZW5NZW50aW9uRHJvcGRvd24oY29vcmRzLngsIGNvb3Jkcy55KTtcclxuICAgIH1cclxuXHJcbiAgICBpZih0aGlzLmlzTWVudGlvbkRyb3Bkb3duT3Blbil7XHJcbiAgICAgIGNvbnN0IHRhZyA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudW5pdmVyc2FsLXRhZycpO1xyXG4gICAgICBpZih0YWcpe1xyXG4gICAgICAgIHRoaXMuc2VhcmNoVXNlclRleHQgPSB0YWcudGV4dENvbnRlbnQucmVwbGFjZSgvQC9nLCAnJyk7XHJcbiAgICAgICAgdGhpcy5maWx0ZXJVc2VycygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudHJhdmVyc2VUaGVET00odHJ1ZSk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZW1pdENoYW5nZSgpLCAwKTtcclxuICB9XHJcblxyXG4gIC8vQlVMTEVUIExJU1RcclxuICBpc0J1bGxldExpc3QgPSBmYWxzZTtcclxuICBwcml2YXRlIGN1cnJlbnRCdWxsZXRMaXN0RWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XHJcbiAgb25CdWxsZXRMaXN0Q2xpY2soKXtcclxuICAgIHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEtleWJvYXJkRXZlbnQoJ2tleWRvd24nLCB7XHJcbiAgICAgIGNvZGU6J0RpZ2l0OCcsXHJcbiAgICAgIGN0cmxLZXk6IHRydWUsXHJcbiAgICAgIHNoaWZ0S2V5OiB0cnVlLFxyXG4gICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgfVxyXG5cclxuICAvL05VTUJFUkVEIExJU1RcclxuICBpc051bWJlcmVkTGlzdCA9IGZhbHNlO1xyXG4gIG9uTnVtYmVyZWRMaXN0Q2xpY2soKXtcclxuICAgIHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEtleWJvYXJkRXZlbnQoJ2tleWRvd24nLHtcclxuICAgICAgY29kZTonRGlnaXQ3JyxcclxuICAgICAgY3RybEtleTogdHJ1ZSxcclxuICAgICAgc2hpZnRLZXk6IHRydWUsXHJcbiAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgIGNhbmNlbGFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIC8vIFRFWFQgU1RZTEVcclxuICBAVmlld0NoaWxkKCd0ZXh0U3R5bGVzJykgcHJpdmF0ZSB0ZXh0U3R5bGVzITogVGV4dFN0eWxlc0NvbXBvbmVudDtcclxuICB0ZXh0U3R5bGUgPSAncCc7XHJcbiAgcHJpdmF0ZSBjdXJyZW50VGV4dFN0eWxlRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XHJcbiAgZ2V0IHRleHRTdHlsZURpc2FibGVkKCl7XHJcbiAgICBpZih0aGlzLmN1cnJlbnRCdWxsZXRMaXN0RWxlbWVudCl7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICBvblN0eWxlQ2hhbmdlKGV2ZW50OiBzdHJpbmcpe1xyXG4gICAgaWYodGhpcy5jb25maWcuZW5hYmxlVGV4dFN0eWxlcyl7XHJcbiAgICAgIGlmKHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgIGxldCBpbnNpZGUgPSBgJiM4MjAzO2A7XHJcbiAgICAgICAgaWYodGhpcy5zZWxlY3RlZENvbG9yICYmICFlcXVhbCh0aGlzLnNlbGVjdGVkQ29sb3IsIHRoaXMuZGVmYXVsdFRleHRDb2xvcikpe1xyXG4gICAgICAgICAgaW5zaWRlID0gYDxzcGFuIGNsYXNzPVwidW5pdmVyc2FsLWVkaXRvci10ZXh0LWNvbG9yXCIgc3R5bGU9XCJjb2xvcjoke3RoaXMuc2VsZWN0ZWRDb2xvci5jb2xvckNvZGV9O1wiIFxyXG4gICAgICAgICAgY3VzdG9tLXRleHQtY29sb3ItbmFtZT1cIiR7dGhpcy5zZWxlY3RlZENvbG9yLmNvbG9yTmFtZX1cIiBjdXN0b20tdGV4dC1jb2xvci1jb2RlPVwiJHt0aGlzLnNlbGVjdGVkQ29sb3IuY29sb3JDb2RlfVwiPiR7aW5zaWRlfTwvc3Bhbj5gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmlzQm9sZCl7XHJcbiAgICAgICAgICBpbnNpZGUgPSBgPHN0cm9uZz4ke2luc2lkZX08L3N0cm9uZz5gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmlzSXRhbGljKXtcclxuICAgICAgICAgIGluc2lkZSA9IGA8ZW0+JHtpbnNpZGV9PC9lbT5gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmlzVW5kZXJsaW5lKXtcclxuICAgICAgICAgIGluc2lkZSA9IGA8dT4ke2luc2lkZX08L3U+YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5pc1N0cmlrZXRocm91Z2gpe1xyXG4gICAgICAgICAgaW5zaWRlID0gYDxzPiR7aW5zaWRlfTwvcz5gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmlzU3Vic2NyaXB0KXtcclxuICAgICAgICAgIGluc2lkZSA9IGA8c3ViPiR7aW5zaWRlfTwvc3ViPmA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuaXNTdXBlcnNjcmlwdCl7XHJcbiAgICAgICAgICBpbnNpZGUgPSBgPHN1cD4ke2luc2lkZX08L3N1cD5gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbnNpZGUgPSBgPCR7ZXZlbnR9PiR7aW5zaWRlfTwvJHtldmVudH0+YDtcclxuICBcclxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy5jcmVhdGVFbGVtZW50RnJvbVN0cmluZyhpbnNpZGUpIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgIHRoaXMuYWRkRWxlbWVudChlbGVtLCB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50KTtcclxuICAgICAgICB0aGlzLnNldEN1cnNvclBvc2l0aW9uQWZ0ZXIoZWxlbSwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZih0aGlzLmN1cnJlbnRUZXh0U3R5bGVFbGVtZW50KXtcclxuICAgICAgICB0aGlzLnJlcGxhY2VFbGVtZW50KHRoaXMuY3VycmVudFRleHRTdHlsZUVsZW1lbnQsIGV2ZW50KTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnRyYXZlcnNlVGhlRE9NKGZhbHNlKTtcclxuICAgICAgdGhpcy50ZXh0U3R5bGUgPSBldmVudDtcclxuICAgICAgaWYodGhpcy50ZXh0U3R5bGVzKXtcclxuICAgICAgICB0aGlzLnRleHRTdHlsZXMuc2V0U3R5bGUodGhpcy50ZXh0U3R5bGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBcclxuXHJcblxyXG4gIC8vIFNIQVJFRFxyXG4gIHByaXZhdGUgdGV4dEVsZW1lbnQ6SFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XHJcbiAgcHJpdmF0ZSBzZWxlY3RlZFRleHQgPSAnJztcclxuICByZXNpemVUaW1lb3V0OmFueTtcclxuICBwcml2YXRlIGVtaXRDaGFuZ2UoKXtcclxuICAgIGNvbnN0IHRhZ2dlZEVsZW1lbnRzOiAgTm9kZUxpc3RPZjxFbGVtZW50PiA9IHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnVuaXZlcnNhbC1lZGl0b3ItdGFnJyk7XHJcbiAgICBjb25zdCBpZHMgPSBBcnJheS5mcm9tKHRhZ2dlZEVsZW1lbnRzKS5tYXAoZWxlbWVudCA9PiBlbGVtZW50LmlkKTtcclxuICAgIGNvbnN0IHVuaXF1ZUlkcyA9IEFycmF5LmZyb20obmV3IFNldChpZHMpKTtcclxuICAgIC8vY29uc29sZS5sb2codGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5pbm5lckhUTUwpXHJcbiAgICB0aGlzLm9uQ2hhbmdlVGV4dC5lbWl0KHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MKTtcclxuICAgIHRoaXMub25DaGFuZ2VJZHMuZW1pdCh1bmlxdWVJZHMpO1xyXG4gIH1cclxuICBwcml2YXRlIG1lcmdlQWRqYWNlbnQodGFnOnN0cmluZykge1xyXG4gICAgY29uc3QgYWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0YWcpO1xyXG4gICAgbGV0IHByZXY6IGFueSA9IG51bGw7XHJcbiAgXHJcbiAgICBhbGwuZm9yRWFjaCgodWwsIGluZGV4KSA9PiB7XHJcbiAgICAgIGlmIChwcmV2ICYmIHVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgPT09IHByZXYpIHtcclxuICAgICAgICB3aGlsZSAodWwuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcHJldi5hcHBlbmRDaGlsZCh1bC5jaGlsZHJlblswXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVsLnJlbW92ZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHByZXYgPSB1bDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGdldFNlbGVjdGVkVGV4dCgpe1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xyXG4gICAgaWYgKHNlbGVjdGlvbiAmJiBzZWxlY3Rpb24ucmFuZ2VDb3VudCA+IDApIHtcclxuICAgICAgY29uc3QgcmFuZ2UgPSBzZWxlY3Rpb24uZ2V0UmFuZ2VBdCgwKTtcclxuICAgICAgcmV0dXJuIHJhbmdlLnRvU3RyaW5nKCk7O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICcnO1xyXG4gIH1cclxuICBwcml2YXRlIHNwbGl0QXRDYXJldChlbGVtZW50OiBIVE1MRWxlbWVudCwgY2xlYXJGb3JtYXR0aW5nOiBib29sZWFuLCBjaGFuZ2VUZXh0Q29sb3I6IGJvb2xlYW4pIHtcclxuICAgIFxyXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xyXG4gICAgaWYgKCFzZWxlY3Rpb24gfHwgc2VsZWN0aW9uLnJhbmdlQ291bnQgPT09IDApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9IFxyXG4gICAgY29uc3QgcmFuZ2UgPSBzZWxlY3Rpb24uZ2V0UmFuZ2VBdCgwKTtcclxuICAgIGxldCBzZWxlY3RlZFRleHQgPSByYW5nZS50b1N0cmluZygpO1xyXG4gICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgY29uc3Qgc3RhcnRPZmZzZXQgPSByYW5nZS5zdGFydE9mZnNldDtcclxuICAgICAgY29uc3Qgb3JpZ2luYWxUZXh0ID0gZWxlbWVudC50ZXh0Q29udGVudDtcclxuICAgICAgaWYob3JpZ2luYWxUZXh0KXtcclxuICAgICAgICBpZih0aGlzLnRleHRFbGVtZW50ICYmIHRoaXMudGV4dEVsZW1lbnQudGV4dENvbnRlbnQpe1xyXG4gICAgICAgICAgY29uc3QgbGVmdENvbnRhaW5lciA9IGVsZW1lbnQuY2xvbmVOb2RlKGZhbHNlKSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICAgIGNvbnN0IHJpZ2h0Q29udGFpbmVyID0gZWxlbWVudC5jbG9uZU5vZGUoZmFsc2UpIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgICAgY29uc3QgbWlkZGxlQ29udGFpbmVyID0gZWxlbWVudC5jbG9uZU5vZGUoZmFsc2UpIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgICAgdGhpcy5zcGxpdEVsZW1lbnRBdFRleHQoZWxlbWVudCwgbGVmdENvbnRhaW5lciwgbWlkZGxlQ29udGFpbmVyLCByaWdodENvbnRhaW5lciwgc3RhcnRPZmZzZXQsIHNlbGVjdGVkVGV4dC5sZW5ndGgpO1xyXG4gICAgICAgICAgY29uc3QgbWFya2VyID0gbWlkZGxlQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNlZGl0b3ItbWFya2VyJyk7XHJcbiAgICAgICAgICBpZighbWFya2VyKSByZXR1cm47XHJcbiAgICAgICAgICBpZighc2VsZWN0ZWRUZXh0KXtcclxuICAgICAgICAgICAgc2VsZWN0ZWRUZXh0ID0gJ1xcdTIwMEInO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc3Qgc3BhY2UgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzZWxlY3RlZFRleHQpO1xyXG4gICAgICAgICAgbWFya2VyLnJlcGxhY2VXaXRoKHNwYWNlKTtcclxuICAgICAgICAgIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcclxuICAgICAgICAgIGlmKCFwYXJlbnQpIHJldHVybjtcclxuICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUobGVmdENvbnRhaW5lciwgZWxlbWVudCk7XHJcbiAgICAgICAgICBpZihjbGVhckZvcm1hdHRpbmcpe1xyXG4gICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKHNwYWNlLCBlbGVtZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlmKGNoYW5nZVRleHRDb2xvciAmJiB0aGlzLnNlbGVjdGVkQ29sb3Ipe1xyXG4gICAgICAgICAgICAgIG1pZGRsZUNvbnRhaW5lci5zdHlsZS5jb2xvciA9IHRoaXMuc2VsZWN0ZWRDb2xvci5jb2xvckNvZGU7XHJcbiAgICAgICAgICAgICAgbWlkZGxlQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnY3VzdG9tLXRleHQtY29sb3ItbmFtZScsIHRoaXMuc2VsZWN0ZWRDb2xvci5jb2xvck5hbWUpO1xyXG4gICAgICAgICAgICAgIG1pZGRsZUNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2N1c3RvbS10ZXh0LWNvbG9yLWNvZGUnLCB0aGlzLnNlbGVjdGVkQ29sb3IuY29sb3JDb2RlKTtcclxuICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG1pZGRsZUNvbnRhaW5lciwgZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihtaWRkbGVDb250YWluZXIuZmlyc3RDaGlsZCl7XHJcbiAgICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShtaWRkbGVDb250YWluZXIuZmlyc3RDaGlsZCwgZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKHJpZ2h0Q29udGFpbmVyLnRleHRDb250ZW50KXtcclxuICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShyaWdodENvbnRhaW5lciwgZWxlbWVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgdGhpcy5zZXRDdXJzb3JQb3NpdGlvbkFmdGVyKHNwYWNlLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9ICBcclxuICAgIH1cclxuICB9XHJcbiAgcHJpdmF0ZSBzcGxpdEVsZW1lbnRBdFRleHQoY29udGFpbmVyOkhUTUxFbGVtZW50LCBsZWZ0Q29udGFpbmVyOkhUTUxFbGVtZW50LCBtaWRkbGVDb250YWluZXI6SFRNTEVsZW1lbnQsIHJpZ2h0Q29udGFpbmVyOkhUTUxFbGVtZW50LCBzcGxpdEluZGV4Om51bWJlciwgc2VsZWN0ZWRUZXh0TGVuZ3RoOm51bWJlcikge1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBjb250YWluZXIuY2hpbGROb2RlcztcclxuICAgIGxldCBsZWZ0ID0gdHJ1ZTtcclxuICAgIGNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICBpZiAodGhpcy50ZXh0RWxlbWVudCAmJiBjaGlsZC5jb250YWlucyh0aGlzLnRleHRFbGVtZW50KSAmJiB0aGlzLnRleHRFbGVtZW50LnRleHRDb250ZW50KSB7XHJcbiAgICAgICAgbGVmdCA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IHRleHRMZWZ0ID0gdGhpcy50ZXh0RWxlbWVudC50ZXh0Q29udGVudC5zbGljZSgwLCBzcGxpdEluZGV4KTtcclxuICAgICAgICBjb25zdCB0ZXh0UmlnaHQgPSB0aGlzLnRleHRFbGVtZW50LnRleHRDb250ZW50LnNsaWNlKHNwbGl0SW5kZXggKyBzZWxlY3RlZFRleHRMZW5ndGgpO1xyXG4gICAgICAgIGlmKGNoaWxkID09PSB0aGlzLnRleHRFbGVtZW50KXtcclxuICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dExlZnQpKTtcclxuICAgICAgICAgIGNvbnN0IG1hcmtlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgIG1hcmtlci5pZCA9ICdlZGl0b3ItbWFya2VyJztcclxuICAgICAgICAgIG1pZGRsZUNvbnRhaW5lci5hcHBlbmRDaGlsZChtYXJrZXIpO1xyXG4gICAgICAgICAgaWYodGV4dFJpZ2h0KXtcclxuICAgICAgICAgICAgcmlnaHRDb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dFJpZ2h0KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICBjb25zdCBsZWZ0TmV3ID0gY2hpbGQuY2xvbmVOb2RlKGZhbHNlKTtcclxuICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQobGVmdE5ldyk7XHJcbiAgICAgICAgICBjb25zdCByaWdodE5ldyA9IGNoaWxkLmNsb25lTm9kZShmYWxzZSk7XHJcbiAgICAgICAgICByaWdodENvbnRhaW5lci5hcHBlbmRDaGlsZChyaWdodE5ldyk7XHJcbiAgICAgICAgICBjb25zdCBtaWRkbGVOZXcgPSBjaGlsZC5jbG9uZU5vZGUoZmFsc2UpO1xyXG4gICAgICAgICAgbWlkZGxlQ29udGFpbmVyLmFwcGVuZENoaWxkKG1pZGRsZU5ldyk7XHJcbiAgICAgICAgICB0aGlzLnNwbGl0RWxlbWVudEF0VGV4dChjaGlsZCBhcyBIVE1MRWxlbWVudCwgbGVmdE5ldyBhcyBIVE1MRWxlbWVudCwgbWlkZGxlTmV3IGFzIEhUTUxFbGVtZW50LCByaWdodE5ldyBhcyBIVE1MRWxlbWVudCwgc3BsaXRJbmRleCwgc2VsZWN0ZWRUZXh0TGVuZ3RoKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgfSBlbHNlIGlmKGxlZnQpIHtcclxuICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkLmNsb25lTm9kZSh0cnVlKSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICByaWdodENvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZC5jbG9uZU5vZGUodHJ1ZSkpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcHJpdmF0ZSByZXBsYWNlRWxlbWVudChvbGRFbGVtZW50OiBIVE1MRWxlbWVudCwgbmV3RWxlbWVudFR5cGU6IHN0cmluZykge1xyXG4gICAgLy9jb25zb2xlLmxvZyhvbGRFbGVtZW50LCBuZXdFbGVtZW50VHlwZSlcclxuICAgIGNvbnN0IG5ld0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5ld0VsZW1lbnRUeXBlKTtcclxuICAgIG5ld0VsZW1lbnQuaW5uZXJIVE1MID0gb2xkRWxlbWVudC5pbm5lckhUTUw7XHJcbiAgICBpZihvbGRFbGVtZW50LnBhcmVudE5vZGUpe1xyXG4gICAgICBvbGRFbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0VsZW1lbnQsIG9sZEVsZW1lbnQpO1xyXG4gICAgICB0aGlzLnNldEN1cnNvclBvc2l0aW9uQWZ0ZXIobmV3RWxlbWVudCwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHByaXZhdGUgZGVsZXRlQ2hhckJlZm9yZUNhcmV0KCkge1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xyXG4gICAgaWYgKCFzZWxlY3Rpb24gfHwgc2VsZWN0aW9uLnJhbmdlQ291bnQgPT09IDApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9IFxyXG5cclxuICAgIGNvbnN0IHJhbmdlID0gc2VsZWN0aW9uLmdldFJhbmdlQXQoMCk7XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgdGhlIHNlbGVjdGlvbiBpcyBjb2xsYXBzZWQgKG5vIHRleHQgaXMgc2VsZWN0ZWQpXHJcbiAgICBpZiAocmFuZ2UuY29sbGFwc2VkKSB7XHJcbiAgICAgIGNvbnN0IHN0YXJ0Q29udGFpbmVyID0gcmFuZ2Uuc3RhcnRDb250YWluZXI7XHJcbiAgICAgIC8vIERlbGV0aW5nIGEgY2hhcmFjdGVyIGluIGEgdGV4dCBub2RlXHJcbiAgICAgIGlmIChzdGFydENvbnRhaW5lci5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgcmFuZ2Uuc3RhcnRPZmZzZXQgPiAwKSB7XHJcbiAgICAgICAgLy8gTW9kaWZ5IHRoZSByYW5nZSB0byBlbmNvbXBhc3MgdGhlIGNoYXJhY3RlciBiZWZvcmUgdGhlIGNhcmV0XHJcbiAgICAgICAgcmFuZ2Uuc2V0U3RhcnQoc3RhcnRDb250YWluZXIsIHJhbmdlLnN0YXJ0T2Zmc2V0IC0gMSk7XHJcbiAgICAgICAgLy8gRGVsZXRlIHRoZSBjaGFyYWN0ZXJcclxuICAgICAgICByYW5nZS5kZWxldGVDb250ZW50cygpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgcmFuZ2UgdG8gc2V0IHRoZSBjYXJldCBwb3NpdGlvblxyXG4gICAgICAgIGNvbnN0IG5ld1JhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcclxuICAgICAgICBuZXdSYW5nZS5zZXRTdGFydChzdGFydENvbnRhaW5lciwgcmFuZ2Uuc3RhcnRPZmZzZXQpO1xyXG4gICAgICAgIG5ld1JhbmdlLmNvbGxhcHNlKHRydWUpO1xyXG5cclxuICAgICAgICAvLyBTZXQgdGhlIG5ldyByYW5nZSBhcyB0aGUgc2VsZWN0aW9uXHJcbiAgICAgICAgc2VsZWN0aW9uLnJlbW92ZUFsbFJhbmdlcygpO1xyXG4gICAgICAgIHNlbGVjdGlvbi5hZGRSYW5nZShuZXdSYW5nZSk7XHJcbiAgICAgIH0gXHJcbiAgICB9XHJcbiAgfVxyXG4gIHByaXZhdGUgY3JlYXRlRWxlbWVudEZyb21TdHJpbmcoaHRtbFN0cmluZzogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XHJcbiAgICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWxTdHJpbmcsICd0ZXh0L2h0bWwnKTtcclxuXHJcbiAgICBpZiAoZG9jLmJvZHkuZmlyc3RDaGlsZCAmJiBkb2MuYm9keS5maXJzdENoaWxkLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xyXG4gICAgICAgIHJldHVybiBkb2MuYm9keS5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRvYy5ib2R5LmZpcnN0RWxlbWVudENoaWxkO1xyXG4gIH1cclxuICBwcml2YXRlIGFkZEVsZW1lbnQoZWxlbTpIVE1MRWxlbWVudCwgcGFyZW50OiBIVE1MRWxlbWVudCl7XHJcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgICBpZiAoc2VsZWN0aW9uICYmIHNlbGVjdGlvbi5yYW5nZUNvdW50ID4gMCAmJiBwYXJlbnQuY29udGFpbnMoc2VsZWN0aW9uLmFuY2hvck5vZGUpKSB7XHJcbiAgICAgIGNvbnN0IHJhbmdlID0gc2VsZWN0aW9uLmdldFJhbmdlQXQoMCk7XHJcbiAgICAgIHJhbmdlLmRlbGV0ZUNvbnRlbnRzKCk7XHJcbiAgICAgIHJhbmdlLmluc2VydE5vZGUoZWxlbSk7XHJcblxyXG4gICAgICByYW5nZS5zZWxlY3ROb2RlQ29udGVudHMoZWxlbSk7XHJcbiAgICAgIHJhbmdlLmNvbGxhcHNlKHRydWUpO1xyXG4gICAgICBzZWxlY3Rpb24ucmVtb3ZlQWxsUmFuZ2VzKCk7XHJcbiAgICAgIHNlbGVjdGlvbi5hZGRSYW5nZShyYW5nZSk7ICAgIFxyXG4gICAgfSAgICAgICAgICBcclxuICB9XHJcbiAgcHJpdmF0ZSBzZXRDdXJzb3JQb3NpdGlvbkFmdGVyKGVsZW1lbnQ6IGFueSwgYWZ0ZXJDb250ZW50SW5zaWRlVGFnOiBib29sZWFuKSB7XHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBjb25zdCByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgXHJcbiAgICAgIGlmKGFmdGVyQ29udGVudEluc2lkZVRhZyl7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQubGFzdENoaWxkKSB7XHJcbiAgICAgICAgICByYW5nZS5zZXRTdGFydEFmdGVyKGVsZW1lbnQubGFzdENoaWxkKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByYW5nZS5zZXRTdGFydChlbGVtZW50LCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICByYW5nZS5zZXRTdGFydEFmdGVyKGVsZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICAgIHJhbmdlLmNvbGxhcHNlKHRydWUpO1xyXG4gICAgICBcclxuICAgICAgaWYoc2VsZWN0aW9uKXtcclxuICAgICAgICBzZWxlY3Rpb24ucmVtb3ZlQWxsUmFuZ2VzKCk7XHJcbiAgICAgICAgc2VsZWN0aW9uLmFkZFJhbmdlKHJhbmdlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDpjbGljaycsIFsnJGV2ZW50J10pIG9uSG9zdENsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xyXG4gICAgY29uc3QgZHJvcGRvd24gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnVuaXZlcnNhbC1lZGl0b3ItbWVudGlvbicpO1xyXG4gICAgY29uc3QgbWVudGlvbkJ1dHRvbiA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubWVudGlvbi1idXR0b24nKTtcclxuICAgIFxyXG4gICAgaWYgKHRhcmdldEVsZW1lbnQgJiYgIWRyb3Bkb3duLmNvbnRhaW5zKHRhcmdldEVsZW1lbnQpICYmIHRoaXMuaXNNZW50aW9uRHJvcGRvd25PcGVuICYmICFtZW50aW9uQnV0dG9uLmNvbnRhaW5zKHRhcmdldEVsZW1lbnQpKSB7XHJcbiAgICAgIHRoaXMub25DYW5jZWxTZWxlY3RVc2VyKGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZih0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKHRhcmdldEVsZW1lbnQpKXtcclxuICAgICAgdGhpcy50cmF2ZXJzZVRoZURPTSh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnLCBbJyRldmVudCddKSBvblJlc2l6ZSgpIHtcclxuICAgIGNsZWFyVGltZW91dCh0aGlzLnJlc2l6ZVRpbWVvdXQpO1xyXG4gICAgdGhpcy5yZXNpemVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuZWRpdG9yV2lkdGggPSB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xyXG4gICAgICBjb25zb2xlLmxvZygnTmV3IHdpZHRoOicsIHRoaXMuZWRpdG9yV2lkdGgpO1xyXG4gICAgICAvL3NldCBlZGl0b3Igc2l6ZVxyXG4gICAgfSwgMTAwKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdHJhdmVyc2VUaGVET00oZXhwb3NlQ2hhbmdlczogYm9vbGVhbikge1xyXG4gICAgY29uc3QgZWRpdG9yID0gdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudDtcclxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcclxuXHJcbiAgICAvLyBFbnN1cmUgdGhlcmUncyBhIHNlbGVjdGlvbiBhbmQgaXQncyB3aXRoaW4gdGhlIGVkaXRvclxyXG4gICAgaWYgKCFzZWxlY3Rpb24gfHwgIXNlbGVjdGlvbi5yYW5nZUNvdW50IHx8ICFlZGl0b3IuY29udGFpbnMoc2VsZWN0aW9uLmFuY2hvck5vZGUpKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ05vIHZhbGlkIHNlbGVjdGlvbiB3aXRoaW4gdGhlIGVkaXRvcicpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByYW5nZSA9IHNlbGVjdGlvbi5nZXRSYW5nZUF0KDApO1xyXG4gICAgdGhpcy5zZWxlY3RlZFRleHQgPSByYW5nZS50b1N0cmluZygpO1xyXG5cclxuICAgIGxldCBub2RlOiBOb2RlIHwgbnVsbCA9IHNlbGVjdGlvbi5nZXRSYW5nZUF0KDApLnN0YXJ0Q29udGFpbmVyO1xyXG4gICAgaWYobm9kZSAmJiBub2RlICE9PSBlZGl0b3IgJiYgZXhwb3NlQ2hhbmdlcyl7XHJcbiAgICAgIHRoaXMuaXNCb2xkID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuaXNJdGFsaWMgPSBmYWxzZTtcclxuICAgICAgdGhpcy5pc1VuZGVybGluZSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmlzU3RyaWtldGhyb3VnaCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmlzU3Vic2NyaXB0ID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuaXNTdXBlcnNjcmlwdCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnNlbGVjdGVkQ29sb3IgPSB0aGlzLmRlZmF1bHRUZXh0Q29sb3I7XHJcbiAgICAgIHRoaXMuaXNCdWxsZXRMaXN0ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICB0aGlzLnRleHRFbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5jdXJyZW50VGV4dFN0eWxlRWxlbWVudCA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMuY3VycmVudEJvbGRFbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5jdXJyZW50SXRhbGljRWxlbWVudCA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMuY3VycmVudFVuZGVybGluZUVsZW1lbnQgPSB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLmN1cnJlbnRTdHJpa2V0aHJvdWdoRWxlbWVudCA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMuY3VycmVudFN1cGVzcnNjaXB0RWxlbWVudCA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMuY3VycmVudFN1YnNjcmlwdEVsZW1lbnQgPSB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLmhpZ2hlc3RGb3JtYXRFbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5jdXJyZW50VGV4dENvbG9yRWxlbWVudCA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMuY3VycmVudEJ1bGxldExpc3RFbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgaWYobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpe1xyXG4gICAgICB0aGlzLnRleHRFbGVtZW50ID0gbm9kZSBhcyBIVE1MRWxlbWVudDtcclxuICAgIH1cclxuICAgIHdoaWxlIChub2RlICYmIG5vZGUgIT09IGVkaXRvcikge1xyXG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xyXG4gICAgICAgICAgaWYobm9kZS5ub2RlTmFtZSA9PT0gJ0RJVicpe1xyXG4gICAgICAgICAgICB0aGlzLnJlcGxhY2VFbGVtZW50KG5vZGUgYXMgSFRNTEVsZW1lbnQsICdwJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoWydQJywgJ0gxJywgJ0gyJywgJ0gzJywgJ0g0JywgJ0g1JywgJ0g2J10uaW5jbHVkZXMobm9kZS5ub2RlTmFtZSkpIHtcclxuICAgICAgICAgICAgdGhpcy50ZXh0U3R5bGUgPSBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7IFxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0U3R5bGVFbGVtZW50ID0gbm9kZSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICAgICAgY29uc3QgYnIgPSB0aGlzLmN1cnJlbnRUZXh0U3R5bGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JyJyk7XHJcbiAgICAgICAgICAgIGlmKGJyKXtcclxuICAgICAgICAgICAgICBjb25zdCBzcGFjZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdcXHUyMDBCJyk7XHJcbiAgICAgICAgICAgICAgYnIucmVwbGFjZVdpdGgoc3BhY2UpO1xyXG4gICAgICAgICAgICAgIHRoaXMuc2V0Q3Vyc29yUG9zaXRpb25BZnRlcihzcGFjZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZihub2RlLm5vZGVOYW1lID09PSAnU1RST05HJyl7XHJcbiAgICAgICAgICAgIGlmKGV4cG9zZUNoYW5nZXMpe1xyXG4gICAgICAgICAgICAgIHRoaXMuaXNCb2xkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCb2xkRWxlbWVudCA9IG5vZGUgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuaGlnaGVzdEZvcm1hdEVsZW1lbnQgPSBub2RlIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYobm9kZS5ub2RlTmFtZSA9PT0gJ0VNJyl7XHJcbiAgICAgICAgICAgIGlmKGV4cG9zZUNoYW5nZXMpe1xyXG4gICAgICAgICAgICAgIHRoaXMuaXNJdGFsaWMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEl0YWxpY0VsZW1lbnQgPSBub2RlIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgICAgICB0aGlzLmhpZ2hlc3RGb3JtYXRFbGVtZW50ID0gbm9kZSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKG5vZGUubm9kZU5hbWUgPT09ICdVJyl7XHJcbiAgICAgICAgICAgIGlmKGV4cG9zZUNoYW5nZXMpe1xyXG4gICAgICAgICAgICAgIHRoaXMuaXNVbmRlcmxpbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFVuZGVybGluZUVsZW1lbnQgPSBub2RlIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgICAgICB0aGlzLmhpZ2hlc3RGb3JtYXRFbGVtZW50ID0gbm9kZSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKG5vZGUubm9kZU5hbWUgPT09ICdTJyl7XHJcbiAgICAgICAgICAgIGlmKGV4cG9zZUNoYW5nZXMpe1xyXG4gICAgICAgICAgICAgIHRoaXMuaXNTdHJpa2V0aHJvdWdoID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdHJpa2V0aHJvdWdoRWxlbWVudCA9IG5vZGUgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuaGlnaGVzdEZvcm1hdEVsZW1lbnQgPSBub2RlIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYobm9kZS5ub2RlTmFtZSA9PT0gJ1NVQicpe1xyXG4gICAgICAgICAgICBpZihleHBvc2VDaGFuZ2VzKXtcclxuICAgICAgICAgICAgICB0aGlzLmlzU3Vic2NyaXB0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdWJzY3JpcHRFbGVtZW50ID0gbm9kZSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICAgICAgdGhpcy5oaWdoZXN0Rm9ybWF0RWxlbWVudCA9IG5vZGUgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZihub2RlLm5vZGVOYW1lID09PSAnU1VQJyl7XHJcbiAgICAgICAgICAgIGlmKGV4cG9zZUNoYW5nZXMpe1xyXG4gICAgICAgICAgICAgIHRoaXMuaXNTdXBlcnNjcmlwdCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3VwZXNyc2NpcHRFbGVtZW50ID0gbm9kZSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICAgICAgdGhpcy5oaWdoZXN0Rm9ybWF0RWxlbWVudCA9IG5vZGUgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZihub2RlLm5vZGVOYW1lID09PSAnU1BBTicpe1xyXG4gICAgICAgICAgICBjb25zdCBlbGVtID0gbm9kZSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICAgICAgaWYoZWxlbS5jbGFzc05hbWUgPT09ICd1bml2ZXJzYWwtZWRpdG9yLXRleHQtY29sb3InKXtcclxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0Q29sb3JFbGVtZW50ID0gZWxlbTtcclxuICAgICAgICAgICAgICBpZihleHBvc2VDaGFuZ2VzKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHRDb2xvciA9IHRoaXMuY3VycmVudFRleHRDb2xvckVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjdXN0b20tdGV4dC1jb2xvci1jb2RlJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkQ29sb3IgPSB0aGlzLnRleHRDb2xvcnMuZmluZChjb2xvciA9PiBjb2xvci5jb2xvckNvZGUgPT09IHRleHRDb2xvcik7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHRoaXMuaGlnaGVzdEZvcm1hdEVsZW1lbnQgPSBlbGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZihub2RlLm5vZGVOYW1lID09PSAnVUwnKXtcclxuICAgICAgICAgICAgaWYoZXhwb3NlQ2hhbmdlcyl7XHJcbiAgICAgICAgICAgICAgdGhpcy5pc0J1bGxldExpc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJ1bGxldExpc3RFbGVtZW50ID0gbm9kZSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdFbGVtZW50IHR5cGU6Jywgbm9kZS5ub2RlTmFtZSk7XHJcbiAgICAgICAgfSBcclxuICAgICAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xyXG4gICAgfVxyXG4gICAgaWYoZXhwb3NlQ2hhbmdlcyl7XHJcbiAgICAgIGlmKHRoaXMudGV4dFN0eWxlcyl7XHJcbiAgICAgICAgdGhpcy50ZXh0U3R5bGVzLnNldFN0eWxlKHRoaXMudGV4dFN0eWxlKTtcclxuICAgICAgfVxyXG4gICAgICBpZih0aGlzLnNlbGVjdGVkQ29sb3Ipe1xyXG4gICAgICAgIHRoaXMudGV4dENvbG9yUmVmLnNldENvbG9yKHRoaXMuc2VsZWN0ZWRDb2xvcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiBcclxuXHJcblxyXG5cclxuICAvLyBURVhUIENPTE9SXHJcbiAgc2VsZWN0ZWRDb2xvcjogQ29sb3IgfCB1bmRlZmluZWQ7XHJcbiAgcHJpdmF0ZSBjdXJyZW50VGV4dENvbG9yRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XHJcbiAgQFZpZXdDaGlsZCgndGV4dENvbG9yJykgcHJpdmF0ZSB0ZXh0Q29sb3JSZWYhOiBUZXh0Q29sb3JDb21wb25lbnQ7XHJcbiAgb25UZXh0Q29sb3JDaGFuZ2UoY29sb3I6Q29sb3Ipe1xyXG4gICAgaWYoZXF1YWwodGhpcy5zZWxlY3RlZENvbG9yLCBjb2xvcikpIHJldHVybjtcclxuICAgIHRoaXMuc2VsZWN0ZWRDb2xvciA9IGNvbG9yO1xyXG4gICAgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgY29uc3QgZXZlbnQgPSBuZXcgS2V5Ym9hcmRFdmVudCgna2V5ZG93bicsIHtcclxuICAgICAgY29kZTogJ0N1c3RvbVRleHRDb2xvcicsXHJcbiAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgIGNhbmNlbGFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICB9XHJcblxyXG5cclxuICAvLyBCT0xEXHJcbiAgaXNCb2xkID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBjdXJyZW50Qm9sZEVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xyXG4gIG9uU2VsZWN0Qm9sZCgpe1xyXG4gICAgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgY29uc3QgZXZlbnQgPSBuZXcgS2V5Ym9hcmRFdmVudCgna2V5ZG93bicsIHtcclxuICAgICAga2V5OiAnYicsXHJcbiAgICAgIGN0cmxLZXk6IHRydWUsXHJcbiAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgIGNhbmNlbGFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIC8vIElUQUxJQ1xyXG4gIGlzSXRhbGljID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBjdXJyZW50SXRhbGljRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XHJcbiAgb25TZWxlY3RJdGFsaWMoKXtcclxuICAgIHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEtleWJvYXJkRXZlbnQoJ2tleWRvd24nLCB7XHJcbiAgICAgIGtleTogJ2knLFxyXG4gICAgICBjdHJsS2V5OiB0cnVlLFxyXG4gICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgfVxyXG5cclxuICAvLyBVTkRFUkxJTkVcclxuICBpc1VuZGVybGluZSA9IGZhbHNlO1xyXG4gIHByaXZhdGUgY3VycmVudFVuZGVybGluZUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xyXG4gIG9uU2VsZWN0VW5kZXJsaW5lKCl7XHJcbiAgICB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICBjb25zdCBldmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KCdrZXlkb3duJywge1xyXG4gICAgICBrZXk6ICd1JyxcclxuICAgICAgY3RybEtleTogdHJ1ZSxcclxuICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgLy8gU1RSSUtFVFJPVUdIXHJcbiAgaXNTdHJpa2V0aHJvdWdoID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBjdXJyZW50U3RyaWtldGhyb3VnaEVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xyXG4gIG9uU2VsZWN0U3RyaWtldGhyb3VnaCgpe1xyXG4gICAgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgY29uc3QgZXZlbnQgPSBuZXcgS2V5Ym9hcmRFdmVudCgna2V5ZG93bicsIHtcclxuICAgICAga2V5OiAnUycsXHJcbiAgICAgIGN0cmxLZXk6IHRydWUsXHJcbiAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgIHNoaWZ0S2V5OiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgfVxyXG5cclxuICAvLyBTVUJTQ1JJUFRcclxuICBpc1N1YnNjcmlwdCA9IGZhbHNlO1xyXG4gIHByaXZhdGUgY3VycmVudFN1YnNjcmlwdEVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xyXG4gIG9uU2VsZWN0U3Vic2NyaXB0KCl7XHJcbiAgICB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICBjb25zdCBldmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KCdrZXlkb3duJywge1xyXG4gICAgICBjb2RlOiAnQ29tbWEnLFxyXG4gICAgICBjdHJsS2V5OiB0cnVlLFxyXG4gICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICBzaGlmdEtleTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgLy8gU1VQRVJTQ1JJUFRcclxuICBpc1N1cGVyc2NyaXB0ID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBjdXJyZW50U3VwZXNyc2NpcHRFbGVtZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcclxuICBvblNlbGVjdFN1cGVyc2NyaXB0KCl7XHJcbiAgICB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICBjb25zdCBldmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KCdrZXlkb3duJywge1xyXG4gICAgICBjb2RlOiAnUGVyaW9kJyxcclxuICAgICAgY3RybEtleTogdHJ1ZSxcclxuICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgc2hpZnRLZXk6IHRydWVcclxuICAgIH0pO1xyXG4gICAgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIC8vIENMRUFSIEZPUk1BVFRJTkdcclxuICBwcml2YXRlIGhpZ2hlc3RGb3JtYXRFbGVtZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcclxuICBvbkNsZWFyRm9ybWF0dGluZygpe1xyXG4gICAgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgY29uc3QgZXZlbnQgPSBuZXcgS2V5Ym9hcmRFdmVudCgna2V5ZG93bicsIHtcclxuICAgICAga2V5OiAnXFxcXCcsXHJcbiAgICAgIGN0cmxLZXk6IHRydWUsXHJcbiAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICB9KTtcclxuICAgIHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgfVxyXG5cclxuICAgXHJcblxyXG4gIC8vIE1FTlRJT04gUEFSVFxyXG4gIHByaXZhdGUgaXNNZW50aW9uRHJvcGRvd25PcGVuID0gZmFsc2U7XHJcbiAgZmlsdGVyZWRVc2VyczogYW55W10gPSBbXTtcclxuICBwcml2YXRlIHNlYXJjaFVzZXJUZXh0ID0gJyc7XHJcbiAgcHJpdmF0ZSBlbnRlcmVkVXNlcjphbnk7XHJcbiAgb25NZW50aW9uQ2xpY2soKXtcclxuICAgIHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IElucHV0RXZlbnQoJ2N1c3RvbUlucHV0Jyx7XHJcbiAgICAgIGlucHV0VHlwZTogJ2luc2VydFRleHQnLFxyXG4gICAgICBkYXRhOiAnQCcsXHJcbiAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICB9KTtcclxuICAgIHRoaXMub25JbnB1dChldmVudCk7XHJcbiAgfVxyXG4gIG9uTW91c2VFbnRlcihlbnRlcmVkVXNlcjphbnkpe1xyXG4gICAgaWYoZXF1YWwoZW50ZXJlZFVzZXIsIHRoaXMuZW50ZXJlZFVzZXIpKSByZXR1cm47XHJcbiAgICB0aGlzLmVudGVyZWRVc2VyID0gZW50ZXJlZFVzZXI7XHJcbiAgICB0aGlzLmZpbHRlcmVkVXNlcnMgPSB0aGlzLmZpbHRlcmVkVXNlcnMubWFwKHVzZXIgPT57XHJcbiAgICAgIHJldHVybntcclxuICAgICAgICAuLi51c2VyLFxyXG4gICAgICAgIGlzTW91c2VFbnRlcmVkIDogdXNlci5pZCA9PT0gZW50ZXJlZFVzZXIuaWQsXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBvblNlbGVjdFVzZXIodXNlcjphbnkpe1xyXG4gICAgaWYodGhpcy5pc01lbnRpb25Ecm9wZG93bk9wZW4pe1xyXG4gICAgICBjb25zdCB0YWcgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnVuaXZlcnNhbC10YWcnKTtcclxuICAgICAgaWYodGFnKXtcclxuICAgICAgICBsZXQgbmV3RWxlbWVudDtcclxuICAgICAgICBpZih0aGlzLklTX1BSRU1JVU0pe1xyXG4gICAgICAgICAgbmV3RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgIG5ld0VsZW1lbnQuY2xhc3NOYW1lID0gJ3VuaXZlcnNhbC1lZGl0b3ItdGFnJztcclxuICAgICAgICAgIG5ld0VsZW1lbnQuaWQgPSB1c2VyLmlkO1xyXG4gICAgICAgICAgbmV3RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsICdmYWxzZScpO1xyXG4gICAgICAgICAgbmV3RWxlbWVudC50ZXh0Q29udGVudCA9IGBAJHt1c2VyLmZpcnN0TmFtZX0gJHt1c2VyLmxhc3ROYW1lfWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICBuZXdFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYEAke3VzZXIuZmlyc3ROYW1lfSAke3VzZXIubGFzdE5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhZy5yZXBsYWNlV2l0aChuZXdFbGVtZW50KTtcclxuICAgICAgICBjb25zdCBzcGFjZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdcXHUwMEEwJyk7XHJcbiAgICAgICAgY29uc3QgcGFyZW50Tm9kZSA9IG5ld0VsZW1lbnQucGFyZW50Tm9kZTtcclxuICAgICAgICBpZihwYXJlbnROb2RlKXtcclxuICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNwYWNlLCBuZXdFbGVtZW50Lm5leHRTaWJsaW5nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRDdXJzb3JQb3NpdGlvbkFmdGVyKHNwYWNlLCBmYWxzZSk7XHJcblxyXG4gICAgICAgIHRoaXMuY2xvc2VNZW50aW9uRHJvcGRvd24oKTtcclxuICAgICAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBwcml2YXRlIG9uQ2FuY2VsU2VsZWN0VXNlcihyZW1vdmU6IGJvb2xlYW4pe1xyXG4gICAgaWYodGhpcy5pc01lbnRpb25Ecm9wZG93bk9wZW4pe1xyXG4gICAgICBjb25zdCB0YWcgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnVuaXZlcnNhbC10YWcnKTtcclxuICAgICAgaWYodGFnKXtcclxuICAgICAgICBjb25zdCBuZXdFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVtb3ZlID8gJycgOiB0YWcudGV4dENvbnRlbnQpO1xyXG4gICAgICAgIHRhZy5yZXBsYWNlV2l0aChuZXdFbGVtZW50KTtcclxuICAgICAgICB0aGlzLnNldEN1cnNvclBvc2l0aW9uQWZ0ZXIobmV3RWxlbWVudCwgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY2xvc2VNZW50aW9uRHJvcGRvd24oKTtcclxuICAgIH1cclxuICB9XHJcbiAgcHJpdmF0ZSBnZXRDYXJldENvb3JkaW5hdGVzKCkge1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xyXG4gICAgaWYgKCFzZWxlY3Rpb24gfHwgIXNlbGVjdGlvbi5yYW5nZUNvdW50KSByZXR1cm4geyB4OiAwLCB5OiAwIH07XHJcbiAgXHJcbiAgICBjb25zdCByYW5nZSA9IHNlbGVjdGlvbi5nZXRSYW5nZUF0KDApLmNsb25lUmFuZ2UoKTtcclxuICAgIGNvbnN0IGR1bW15U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgIGR1bW15U3Bhbi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnXFx1MjAwQicpKTsgLy8gWmVyby13aWR0aCBzcGFjZVxyXG4gICAgcmFuZ2UuaW5zZXJ0Tm9kZShkdW1teVNwYW4pO1xyXG4gICAgcmFuZ2UuY29sbGFwc2UodHJ1ZSk7XHJcbiAgXHJcbiAgICBjb25zdCByZWN0ID0gZHVtbXlTcGFuLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSB7IHg6IHJlY3QubGVmdCwgeTogcmVjdC50b3AgfTtcclxuICAgIFxyXG4gICAgY29uc3QgcGFyZW50ID0gZHVtbXlTcGFuLnBhcmVudE5vZGU7XHJcbiAgICBpZihwYXJlbnQpe1xyXG4gICAgICBkdW1teVNwYW4ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkdW1teVNwYW4pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xyXG4gIH1cclxuICBwcml2YXRlIG9wZW5NZW50aW9uRHJvcGRvd24oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGRyb3Bkb3duID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy51bml2ZXJzYWwtZWRpdG9yLW1lbnRpb24nKTtcclxuICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy51bml2ZXJzYWwtZWRpdG9yLW1lbnRpb24tYmFja2Ryb3AnKTtcclxuXHJcbiAgICBkcm9wZG93bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgIGJhY2tkcm9wLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgdGhpcy5pc01lbnRpb25Ecm9wZG93bk9wZW4gPSB0cnVlO1xyXG4gICAgdGhpcy5zZWFyY2hVc2VyVGV4dCA9ICcnO1xyXG4gICAgdGhpcy5maWx0ZXJVc2VycygpO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBjb25zdCBkcm9wZG93bkhlaWdodCA9IGRyb3Bkb3duLmNsaWVudEhlaWdodDtcclxuICAgICAgY29uc3QgZHJvcGRvd25XaWR0aCA9IGRyb3Bkb3duLm9mZnNldFdpZHRoO1xyXG4gICAgICBjb25zdCByaWdodFdpZHRoID0gd2luZG93LmlubmVyV2lkdGggLSB4O1xyXG4gICAgICAvL2NvbnNvbGUubG9nKHgsIHksIGRyb3Bkb3duSGVpZ2h0LCBkcm9wZG93bldpZHRoLCByaWdodFdpZHRoKTtcclxuXHJcbiAgICAgIGlmKHRoaXMuY29uZmlnLm1lbnRpb25Qb3NpdGlvbiA9PT0gJ2F1dG8nKXtcclxuICAgICAgICBpZih5ID4gZHJvcGRvd25IZWlnaHQpe1xyXG4gICAgICAgICAgZHJvcGRvd24uc3R5bGUudG9wID0gYCR7eSAtIDEwIC0gZHJvcGRvd25IZWlnaHR9cHhgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgZHJvcGRvd24uc3R5bGUudG9wID0gYCR7eSArIDMwfXB4YDtcclxuICAgICAgICB9ICAgIFxyXG4gICAgICB9ZWxzZSBpZih0aGlzLmNvbmZpZy5tZW50aW9uUG9zaXRpb24gPT09ICdiZWxvdycpe1xyXG4gICAgICAgIGRyb3Bkb3duLnN0eWxlLnRvcCA9IGAke3kgKyAzMH1weGA7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIGRyb3Bkb3duLnN0eWxlLnRvcCA9IGAke3kgLSAxMCAtIGRyb3Bkb3duSGVpZ2h0fXB4YDtcclxuICAgICAgfVxyXG4gICAgICBpZihyaWdodFdpZHRoID4gZHJvcGRvd25XaWR0aCl7XHJcbiAgICAgICAgZHJvcGRvd24uc3R5bGUubGVmdCA9IGAke3h9cHhgO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgZHJvcGRvd24uc3R5bGUubGVmdCA9IGAke3ggLSAoZHJvcGRvd25XaWR0aCAtIHJpZ2h0V2lkdGgpfXB4YDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIFxyXG4gIH1cclxuICBwcml2YXRlIGNsb3NlTWVudGlvbkRyb3Bkb3duKCkge1xyXG4gICAgY29uc3QgZHJvcGRvd24gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnVuaXZlcnNhbC1lZGl0b3ItbWVudGlvbicpO1xyXG4gICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnVuaXZlcnNhbC1lZGl0b3ItbWVudGlvbi1iYWNrZHJvcCcpO1xyXG4gICAgZHJvcGRvd24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIGJhY2tkcm9wLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICB0aGlzLmlzTWVudGlvbkRyb3Bkb3duT3BlbiA9IGZhbHNlO1xyXG4gIH1cclxuICBwcml2YXRlIGZpbHRlclVzZXJzKCkge1xyXG4gICAgaWYgKCF0aGlzLnNlYXJjaFVzZXJUZXh0KSB7XHJcbiAgICAgIHRoaXMuZmlsdGVyZWRVc2VycyA9IHRoaXMubWVudGlvblVzZXJzLm1hcCgodXNlciwgaW5kZXgpID0+e1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAuLi51c2VyLFxyXG4gICAgICAgICAgaXNNb3VzZUVudGVyZWQgOiBpbmRleCA9PT0gMCxcclxuICAgICAgICAgIGluZGV4OiBpbmRleCxcclxuICAgICAgICB9XHJcbiAgICAgIH0pOyAgICBcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGNvbnN0IHNlYXJjaExvd2VyQ2FzZSA9IHRoaXMuc2VhcmNoVXNlclRleHQudHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICB0aGlzLmZpbHRlcmVkVXNlcnMgPSB0aGlzLm1lbnRpb25Vc2Vycy5maWx0ZXIodXNlciA9PntcclxuICAgICAgICBjb25zdCBmdWxsTmFtZSA9IHVzZXIuZmlyc3ROYW1lICsgJyAnICsgdXNlci5sYXN0TmFtZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHVzZXIuZmlyc3ROYW1lPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaExvd2VyQ2FzZSkgfHxcclxuICAgICAgICB1c2VyLmxhc3ROYW1lPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaExvd2VyQ2FzZSkgfHxcclxuICAgICAgICBmdWxsTmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaExvd2VyQ2FzZSkgfHxcclxuICAgICAgICB1c2VyLmVtYWlsPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaExvd2VyQ2FzZSlcclxuICAgICAgfSkubWFwKCh1c2VyLCBpbmRleCkgPT57XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIC4uLnVzZXIsXHJcbiAgICAgICAgICBpc01vdXNlRW50ZXJlZCA6IGluZGV4ID09PSAwLFxyXG4gICAgICAgICAgaW5kZXg6IGluZGV4LFxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgfVxyXG4gICAgaWYodGhpcy5maWx0ZXJlZFVzZXJzLmxlbmd0aCA+IDApe1xyXG4gICAgICB0aGlzLmVudGVyZWRVc2VyID0gdGhpcy5maWx0ZXJlZFVzZXJzWzBdO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgdGhpcy5lbnRlcmVkVXNlciA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBpZih0aGlzLmlzTWVudGlvbkRyb3Bkb3duT3Blbil7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvb3JkcyA9IHRoaXMuZ2V0Q2FyZXRDb29yZGluYXRlcygpO1xyXG4gICAgICAgIGlmKGNvb3Jkcy54ID09PSAwIHx8IGNvb3Jkcy55ID09PSAwKXtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZHJvcGRvd24gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnVuaXZlcnNhbC1lZGl0b3ItbWVudGlvbicpO1xyXG4gICAgICAgIGNvbnN0IGRyb3Bkb3duSGVpZ2h0ID0gZHJvcGRvd24uY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IGRyb3Bkb3duV2lkdGggPSBkcm9wZG93bi5vZmZzZXRXaWR0aDtcclxuICAgICAgICBjb25zdCByaWdodFdpZHRoID0gd2luZG93LmlubmVyV2lkdGggLSBjb29yZHMueDtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNvb3Jkcy54LCBjb29yZHMueSwgZHJvcGRvd25IZWlnaHQsIGRyb3Bkb3duV2lkdGgsIHJpZ2h0V2lkdGgpXHJcbiAgICAgICAgaWYodGhpcy5jb25maWcubWVudGlvblBvc2l0aW9uID09PSAnYXV0bycpe1xyXG4gICAgICAgICAgaWYoY29vcmRzLnkgPiBkcm9wZG93bkhlaWdodCl7XHJcbiAgICAgICAgICAgIGRyb3Bkb3duLnN0eWxlLnRvcCA9IGAke2Nvb3Jkcy55IC0gMTAgLSBkcm9wZG93bkhlaWdodH1weGA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBkcm9wZG93bi5zdHlsZS50b3AgPSBgJHtjb29yZHMueSArIDMwfXB4YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgIH1lbHNlIGlmKHRoaXMuY29uZmlnLm1lbnRpb25Qb3NpdGlvbiA9PT0gJ2JlbG93Jyl7XHJcbiAgICAgICAgICBkcm9wZG93bi5zdHlsZS50b3AgPSBgJHtjb29yZHMueSArIDMwfXB4YDtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIGRyb3Bkb3duLnN0eWxlLnRvcCA9IGAke2Nvb3Jkcy55IC0gMTAgLSBkcm9wZG93bkhlaWdodH1weGA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHJpZ2h0V2lkdGggPiBkcm9wZG93bldpZHRoKXtcclxuICAgICAgICAgIGRyb3Bkb3duLnN0eWxlLmxlZnQgPSBgJHtjb29yZHMueH1weGA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICBkcm9wZG93bi5zdHlsZS5sZWZ0ID0gYCR7Y29vcmRzLnggLSAoZHJvcGRvd25XaWR0aCAtIHJpZ2h0V2lkdGgpfXB4YDtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuXHJcblxyXG4gIH1cclxuXHJcbn1cclxuIiwiPGRpdiBjbGFzcz1cInVuaXZlcnNhbC1lZGl0b3JcIj5cclxuXHJcblxyXG4gICAgPGRpdiBjbGFzcz1cInVuaXZlcnNhbC1lZGl0b3ItaGVhZGVyXCIgKm5nSWY9XCJjb25maWcuc2hvd1Rvb2xiYXJcIj5cclxuICAgICAgICA8dGV4dC1zdHlsZXNcclxuICAgICAgICBbZGlzYWJsZWRdPVwidGV4dFN0eWxlRGlzYWJsZWRcIlxyXG4gICAgICAgICpuZ0lmPVwidGhpcy5jb25maWcuZW5hYmxlVGV4dFN0eWxlc1wiXHJcbiAgICAgICAgI3RleHRTdHlsZXNcclxuICAgICAgICAob25TdHlsZUNoYW5nZSk9XCJvblN0eWxlQ2hhbmdlKCRldmVudClcIlxyXG4gICAgICAgID48L3RleHQtc3R5bGVzPlxyXG5cclxuICAgICAgICA8dmVydGljYWwtbGluZT48L3ZlcnRpY2FsLWxpbmU+XHJcblxyXG4gICAgICAgIDx1bml2ZXJzYWwtYnV0dG9uIFxyXG4gICAgICAgICpuZ0lmPVwidGhpcy5jb25maWcuZW5hYmxlQm9sZFwiXHJcbiAgICAgICAgW2lzU2VsZWN0ZWRdPVwiaXNCb2xkXCJcclxuICAgICAgICB0b29sdGlwPVwiQm9sZCBDdHJsK0JcIlxyXG4gICAgICAgIChjbGljayk9XCJvblNlbGVjdEJvbGQoKVwiXHJcbiAgICAgICAgPjxzcGFuIGNsYXNzPVwiYnV0dG9uLWljb24gYm9sZFwiPjwvc3Bhbj48L3VuaXZlcnNhbC1idXR0b24+XHJcblxyXG4gICAgICAgIDx1bml2ZXJzYWwtYnV0dG9uIFxyXG4gICAgICAgICpuZ0lmPVwidGhpcy5jb25maWcuZW5hYmxlSXRhbGljXCJcclxuICAgICAgICB0b29sdGlwPVwiSXRhbGljIEN0cmwrSVwiXHJcbiAgICAgICAgW2lzU2VsZWN0ZWRdPVwiaXNJdGFsaWNcIlxyXG4gICAgICAgIChjbGljayk9XCJvblNlbGVjdEl0YWxpYygpXCJcclxuICAgICAgICA+PHNwYW4gY2xhc3M9XCJidXR0b24taWNvbiBpdGFsaWNcIj48L3NwYW4+PC91bml2ZXJzYWwtYnV0dG9uPlxyXG5cclxuICAgICAgICA8dW5pdmVyc2FsLWJ1dHRvbiBcclxuICAgICAgICAqbmdJZj1cInRoaXMuY29uZmlnLmVuYWJsZVVuZGVybGluZVwiXHJcbiAgICAgICAgdG9vbHRpcD1cIlVuZGVybGluZSBDdHJsK1VcIlxyXG4gICAgICAgIFtpc1NlbGVjdGVkXT1cImlzVW5kZXJsaW5lXCJcclxuICAgICAgICAoY2xpY2spPVwib25TZWxlY3RVbmRlcmxpbmUoKVwiXHJcbiAgICAgICAgPjxzcGFuIGNsYXNzPVwiYnV0dG9uLWljb24gdW5kZXJsaW5lXCI+PC9zcGFuPjwvdW5pdmVyc2FsLWJ1dHRvbj5cclxuXHJcbiAgICAgICAgPHVuaXZlcnNhbC1idXR0b24gXHJcbiAgICAgICAgKm5nSWY9XCJ0aGlzLmNvbmZpZy5lbmFibGVTdHJpa2V0aHJvdWdoXCJcclxuICAgICAgICB0b29sdGlwPVwiU3RyaWtldGhyb3VnaCBDdHJsK1NoaWZ0K1NcIlxyXG4gICAgICAgIFtpc1NlbGVjdGVkXT1cImlzU3RyaWtldGhyb3VnaFwiXHJcbiAgICAgICAgKGNsaWNrKT1cIm9uU2VsZWN0U3RyaWtldGhyb3VnaCgpXCJcclxuICAgICAgICA+PHNwYW4gY2xhc3M9XCJidXR0b24taWNvbiBzdHJpa2V0aHJvdWdoXCI+PC9zcGFuPjwvdW5pdmVyc2FsLWJ1dHRvbj5cclxuXHJcbiAgICAgICAgPHVuaXZlcnNhbC1idXR0b24gXHJcbiAgICAgICAgKm5nSWY9XCJ0aGlzLmNvbmZpZy5lbmFibGVTdWJzY3JpcHRcIlxyXG4gICAgICAgIHRvb2x0aXA9XCJTdWJzY3JpcHQgQ3RybCtTaGlmdCssXCJcclxuICAgICAgICBbaXNTZWxlY3RlZF09XCJpc1N1YnNjcmlwdFwiXHJcbiAgICAgICAgKGNsaWNrKT1cIm9uU2VsZWN0U3Vic2NyaXB0KClcIlxyXG4gICAgICAgID48c3BhbiBjbGFzcz1cImJ1dHRvbi1pY29uIHN1YnNjcmlwdFwiPjwvc3Bhbj48L3VuaXZlcnNhbC1idXR0b24+XHJcblxyXG4gICAgICAgIDx1bml2ZXJzYWwtYnV0dG9uIFxyXG4gICAgICAgICpuZ0lmPVwidGhpcy5jb25maWcuZW5hYmxlU3VwZXJzY3JpcHRcIlxyXG4gICAgICAgIHRvb2x0aXA9XCJTdXBlcnNjcmlwdCBDdHJsK1NoaWZ0Ky5cIlxyXG4gICAgICAgIFtpc1NlbGVjdGVkXT1cImlzU3VwZXJzY3JpcHRcIlxyXG4gICAgICAgIChjbGljayk9XCJvblNlbGVjdFN1cGVyc2NyaXB0KClcIlxyXG4gICAgICAgID48c3BhbiBjbGFzcz1cImJ1dHRvbi1pY29uIHN1cGVyc2NyaXB0XCI+PC9zcGFuPjwvdW5pdmVyc2FsLWJ1dHRvbj5cclxuXHJcbiAgICAgICAgPHVuaXZlcnNhbC1idXR0b24gXHJcbiAgICAgICAgKm5nSWY9XCJ0aGlzLmNvbmZpZy5lbmFibGVDbGVhckZvcm1hdHRpbmdcIlxyXG4gICAgICAgIHRvb2x0aXA9XCJDbGVhciBmb3JtYXR0aW5nIEN0cmwrXFxcIlxyXG4gICAgICAgIChjbGljayk9XCJvbkNsZWFyRm9ybWF0dGluZygpXCJcclxuICAgICAgICA+PHNwYW4gY2xhc3M9XCJidXR0b24taWNvbiBjbGVhci1mb3JtYXRcIj48L3NwYW4+PC91bml2ZXJzYWwtYnV0dG9uPlxyXG5cclxuICAgICAgICA8dmVydGljYWwtbGluZT48L3ZlcnRpY2FsLWxpbmU+XHJcblxyXG4gICAgICAgIDx0ZXh0LWNvbG9yXHJcbiAgICAgICAgI3RleHRDb2xvclxyXG4gICAgICAgICpuZ0lmPVwidGhpcy5jb25maWcuZW5hYmxlVGV4dENvbG9yXCJcclxuICAgICAgICBbY29sb3JzXT1cInRleHRDb2xvcnNcIlxyXG4gICAgICAgIChvbkNvbG9yQ2hhbmdlKT1cIm9uVGV4dENvbG9yQ2hhbmdlKCRldmVudClcIlxyXG4gICAgICAgIFtkZWZhdWx0Q29sb3JOYW1lXT1cImNvbmZpZy5kZWZhdWx0VGV4dENvbG9yXCJcclxuICAgICAgICA+PC90ZXh0LWNvbG9yPlxyXG5cclxuICAgICAgICA8dmVydGljYWwtbGluZT48L3ZlcnRpY2FsLWxpbmU+XHJcblxyXG4gICAgICAgIDx1bml2ZXJzYWwtYnV0dG9uIFxyXG4gICAgICAgICpuZ0lmPVwidGhpcy5jb25maWcuZW5hYmxlQnVsbGV0TGlzdFwiXHJcbiAgICAgICAgdG9vbHRpcD1cIkJ1bGxldCBsaXN0IEN0cmwrU2hpZnQrOFwiXHJcbiAgICAgICAgW2lzU2VsZWN0ZWRdPVwiaXNCdWxsZXRMaXN0XCJcclxuICAgICAgICBbaXNEaXNhYmxlZF09XCJ0ZXh0U3R5bGUgIT09ICdwJ1wiXHJcbiAgICAgICAgKGNsaWNrKT1cIm9uQnVsbGV0TGlzdENsaWNrKClcIlxyXG4gICAgICAgID48c3BhbiBjbGFzcz1cImJ1dHRvbi1pY29uIGJ1bGxldC1saXN0XCIgW2NsYXNzLmRpc2FibGVkLWJ1bGxldC1saXN0XT1cInRleHRTdHlsZSAhPT0gJ3AnXCI+PC9zcGFuPjwvdW5pdmVyc2FsLWJ1dHRvbj5cclxuXHJcbiAgICAgICAgPHVuaXZlcnNhbC1idXR0b24gXHJcbiAgICAgICAgKm5nSWY9XCJ0aGlzLmNvbmZpZy5lbmFibGVOdW1iZXJlZExpc3RcIlxyXG4gICAgICAgIHRvb2x0aXA9XCJOdW1iZXJlZCBsaXN0IEN0cmwrU2hpZnQrN1wiXHJcbiAgICAgICAgW2lzU2VsZWN0ZWRdPVwiaXNOdW1iZXJlZExpc3RcIlxyXG4gICAgICAgIFtpc0Rpc2FibGVkXT1cInRleHRTdHlsZSAhPT0gJ3AnXCJcclxuICAgICAgICAoY2xpY2spPVwib25OdW1iZXJlZExpc3RDbGljaygpXCJcclxuICAgICAgICA+PHNwYW4gY2xhc3M9XCJidXR0b24taWNvbiBudW1iZXJlZC1saXN0XCIgW2NsYXNzLmRpc2FibGVkLW51bWJlcmVkLWxpc3RdPVwidGV4dFN0eWxlICE9PSAncCdcIj48L3NwYW4+PC91bml2ZXJzYWwtYnV0dG9uPlxyXG4gICAgICAgIFxyXG4gICAgICAgIDx2ZXJ0aWNhbC1saW5lPjwvdmVydGljYWwtbGluZT5cclxuXHJcbiAgICAgICAgPHVuaXZlcnNhbC1idXR0b24gXHJcbiAgICAgICAgY2xhc3M9XCJtZW50aW9uLWJ1dHRvblwiXHJcbiAgICAgICAgKm5nSWY9XCJ0aGlzLmNvbmZpZy5lbmFibGVNZW50aW9uXCJcclxuICAgICAgICB0b29sdGlwPVwiTWVudGlvbiBAXCJcclxuICAgICAgICAoY2xpY2spPVwib25NZW50aW9uQ2xpY2soKVwiXHJcbiAgICAgICAgPjxzcGFuIHN0eWxlPVwid2lkdGg6IDIwcHg7XCI+QDwvc3Bhbj48L3VuaXZlcnNhbC1idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICBcclxuICAgIDxkaXZcclxuICAgICAgICAjZWRpdG9yICBcclxuICAgICAgICBjbGFzcz1cInVuaXZlcnNhbC1lZGl0b3ItY29udGVudFwiXHJcbiAgICAgICAgW2F0dHIuY29udGVudGVkaXRhYmxlXT1cImNvbmZpZy5jb250ZW50ZWRpdGFibGVcIlxyXG4gICAgICAgIFthdHRyLnBsYWNlaG9sZGVyVmFsdWVdPVwiY29uZmlnLnBsYWNlaG9sZGVyVGV4dFwiXHJcbiAgICAgICAgW2lubmVySFRNTF09XCJpbm5lckh0bWxcIlxyXG4gICAgICAgIChpbnB1dCk9XCJvbklucHV0KCRldmVudClcIlxyXG4gICAgICAgIChrZXlkb3duKT1cIm9uS2V5ZG93bigkZXZlbnQpXCJcclxuICAgID5cclxuICAgIDwvZGl2PlxyXG4gICAgICAgIFxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJ1bml2ZXJzYWwtZWRpdG9yLW1lbnRpb24tYmFja2Ryb3BcIiAqbmdJZj1cInRoaXMuY29uZmlnLmVuYWJsZU1lbnRpb25cIj48L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJ1bml2ZXJzYWwtZWRpdG9yLW1lbnRpb25cIiAqbmdJZj1cInRoaXMuY29uZmlnLmVuYWJsZU1lbnRpb25cIj5cclxuICAgICAgICA8ZGl2ICpuZ0Zvcj1cImxldCB1c2VyIG9mIGZpbHRlcmVkVXNlcnNcIj5cclxuICAgICAgICAgICAgPG1lbnRpb24tdXNlciBcclxuICAgICAgICAgICAgICAgIFt1c2VyXT1cInVzZXJcIlxyXG4gICAgICAgICAgICAgICAgKGNsaWNrKT1cIm9uU2VsZWN0VXNlcih1c2VyKVwiXHJcbiAgICAgICAgICAgICAgICAobW91c2VlbnRlcik9XCJvbk1vdXNlRW50ZXIodXNlcilcIlxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICA8L21lbnRpb24tdXNlcj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2ICpuZ0lmPVwiZmlsdGVyZWRVc2Vycy5sZW5ndGggPT09IDBcIj5cclxuICAgICAgICAgICAgPG1lbnRpb24tdXNlcj5cclxuICAgICAgICAgICAgPC9tZW50aW9uLXVzZXI+XHJcbiAgICAgICAgPC9kaXY+ICAgIFxyXG4gICAgPC9kaXY+XHJcblxyXG48L2Rpdj5cclxuXHJcblxyXG4iXX0=