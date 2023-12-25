import { SafeHtml } from "@angular/platform-browser";
export declare class UniversalEditorConfig {
    placeholderText: string;
    enableClearFormatting: boolean;
    enableBold: boolean;
    enableItalic: boolean;
    enableUnderline: boolean;
    enableStrikethrough: boolean;
    enableSubscript: boolean;
    enableSuperscript: boolean;
    enableMention: boolean;
    enableTextStyles: boolean;
    enableTextColor: boolean;
    showToolbar: boolean;
    contenteditable: boolean;
    mentionPosition: 'auto' | 'above' | 'below';
    initialInnerHTML: string | SafeHtml;
    defaultTextColor: 'Black' | 'White' | 'Red' | 'Green' | 'Blue' | 'Yellow' | 'Cyan' | 'Magenta' | 'Silver' | 'Gray' | 'Maroon' | 'Olive' | 'Purple' | 'Teal' | 'Navy' | 'Coral' | 'Turquoise' | 'Salmon' | 'Lime' | 'Gold' | 'Orchid';
    enableBulletList: boolean;
    enableNumberedList: boolean;
    constructor(config?: Partial<UniversalEditorConfig>);
}
