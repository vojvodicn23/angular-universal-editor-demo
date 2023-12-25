import { SafeHtml } from "@angular/platform-browser";
import { EditorApiService } from "./editor.api.service";
export declare class EditorApi {
    private service;
    constructor(service: EditorApiService);
    clearFormatting(): void;
    triggerBold(): void;
    triggerItalic(): void;
    triggerUnderline(): void;
    triggerStrikethrough(): void;
    triggerSubscript(): void;
    triggerSuperscript(): void;
    triggerMention(): void;
    setTextStyle(style: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'): void;
    setTextColor(color: 'Black' | 'White' | 'Red' | 'Green' | 'Blue' | 'Yellow' | 'Cyan' | 'Magenta' | 'Silver' | 'Gray' | 'Maroon' | 'Olive' | 'Purple' | 'Teal' | 'Navy' | 'Coral' | 'Turquoise' | 'Salmon' | 'Lime' | 'Gold' | 'Orchid'): void;
    setInnerHTML(html: string | SafeHtml): void;
    triggerBulletList(): void;
    triggerNumberedList(): void;
}
