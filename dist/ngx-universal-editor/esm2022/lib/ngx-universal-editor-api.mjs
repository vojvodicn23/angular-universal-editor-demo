import { Const } from "./shared/constants";
export class EditorApi {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXVuaXZlcnNhbC1lZGl0b3ItYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXVuaXZlcnNhbC1lZGl0b3Ivc3JjL2xpYi9uZ3gtdW5pdmVyc2FsLWVkaXRvci1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRzNDLE1BQU0sT0FBTyxTQUFTO0lBRXBCLFlBQW9CLE9BQXlCO1FBQXpCLFlBQU8sR0FBUCxPQUFPLENBQWtCO0lBQUcsQ0FBQztJQUUxQyxlQUFlO1FBQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQUVNLFdBQVc7UUFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVNLGFBQWE7UUFDbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVNLGdCQUFnQjtRQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxvQkFBb0I7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0lBRU0sZ0JBQWdCO1FBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVNLGtCQUFrQjtRQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFTSxjQUFjO1FBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFTSxZQUFZLENBQUMsS0FBb0Q7UUFDdEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVNLFlBQVksQ0FBQyxLQUdNO1FBQ3hCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsQ0FBQztRQUMvRCxJQUFHLElBQUksRUFBQztZQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFDO0lBQ0gsQ0FBQztJQUVNLFlBQVksQ0FBQyxJQUF1QjtRQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU0saUJBQWlCO1FBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVNLG1CQUFtQjtRQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFDLENBQUM7Q0FHRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNhZmVIdG1sIH0gZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIjtcbmltcG9ydCB7IEVkaXRvckFwaVNlcnZpY2UgfSBmcm9tIFwiLi9lZGl0b3IuYXBpLnNlcnZpY2VcIjtcbmltcG9ydCB7IENvbnN0IH0gZnJvbSBcIi4vc2hhcmVkL2NvbnN0YW50c1wiO1xuXG5cbmV4cG9ydCBjbGFzcyBFZGl0b3JBcGkge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZTogRWRpdG9yQXBpU2VydmljZSkge31cblxuICBwdWJsaWMgY2xlYXJGb3JtYXR0aW5nKCl7XG4gICAgdGhpcy5zZXJ2aWNlLmNsZWFyRm9ybWF0dGluZ1N1YmplY3QubmV4dCgpO1xuICB9XG5cbiAgcHVibGljIHRyaWdnZXJCb2xkKCl7XG4gICAgdGhpcy5zZXJ2aWNlLmJvbGRTdWJqZWN0Lm5leHQoKTtcbiAgfVxuICBcbiAgcHVibGljIHRyaWdnZXJJdGFsaWMoKXtcbiAgICB0aGlzLnNlcnZpY2UuaXRhbGljU3ViamVjdC5uZXh0KCk7XG4gIH1cblxuICBwdWJsaWMgdHJpZ2dlclVuZGVybGluZSgpe1xuICAgIHRoaXMuc2VydmljZS51bmRlcmxpbmVTdWJqZWN0Lm5leHQoKTtcbiAgfVxuXG4gIHB1YmxpYyB0cmlnZ2VyU3RyaWtldGhyb3VnaCgpe1xuICAgIHRoaXMuc2VydmljZS5zdHJpa2V0aHJvdWdoU3ViamVjdC5uZXh0KCk7XG4gIH1cblxuICBwdWJsaWMgdHJpZ2dlclN1YnNjcmlwdCgpe1xuICAgIHRoaXMuc2VydmljZS5zdWJzY3JpcHRTdWJqZWN0Lm5leHQoKTtcbiAgfVxuXG4gIHB1YmxpYyB0cmlnZ2VyU3VwZXJzY3JpcHQoKXtcbiAgICB0aGlzLnNlcnZpY2Uuc3VwZXJzY3JpcHRTdWJqZWN0Lm5leHQoKTtcbiAgfVxuXG4gIHB1YmxpYyB0cmlnZ2VyTWVudGlvbigpe1xuICAgIHRoaXMuc2VydmljZS5tZW50aW9uU3ViamVjdC5uZXh0KCk7XG4gIH1cblxuICBwdWJsaWMgc2V0VGV4dFN0eWxlKHN0eWxlOiAncCcgfCAnaDEnIHwgJ2gyJyB8ICdoMycgfCAnaDQnIHwgJ2g1JyB8ICdoNicpe1xuICAgIHRoaXMuc2VydmljZS50ZXh0U3R5bGVTdWJqZWN0Lm5leHQoc3R5bGUpO1xuICB9XG5cbiAgcHVibGljIHNldFRleHRDb2xvcihjb2xvcjogJ0JsYWNrJyB8ICdXaGl0ZScgfCAnUmVkJyB8ICdHcmVlbicgfCAnQmx1ZScgfFxuICAnWWVsbG93JyB8ICdDeWFuJyB8ICdNYWdlbnRhJyB8ICdTaWx2ZXInIHwgJ0dyYXknIHwgJ01hcm9vbicgfCAnT2xpdmUnIHxcbiAgJ1B1cnBsZScgfCAnVGVhbCcgfCAnTmF2eScgfCAnQ29yYWwnIHwgJ1R1cnF1b2lzZScgfCAnU2FsbW9uJyB8XG4gICdMaW1lJyB8ICdHb2xkJyB8ICdPcmNoaWQnKXtcbiAgICBjb25zdCBpdGVtID0gQ29uc3QuY29sb3JzLmZpbmQoY29sID0+IGNvbC5jb2xvck5hbWUgPT09IGNvbG9yKTtcbiAgICBpZihpdGVtKXtcbiAgICAgIHRoaXMuc2VydmljZS50ZXh0Q29sb3JTdWJqZWN0Lm5leHQoaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldElubmVySFRNTChodG1sOiBzdHJpbmcgfCBTYWZlSHRtbCl7XG4gICAgdGhpcy5zZXJ2aWNlLmlubmVySFRNTFN1YmplY3QubmV4dChodG1sKTtcbiAgfVxuICAgIFxuICBwdWJsaWMgdHJpZ2dlckJ1bGxldExpc3QoKXtcbiAgICB0aGlzLnNlcnZpY2UuYnVsbGV0TGlzdFN1YmplY3QubmV4dCgpO1xuICB9XG5cbiAgcHVibGljIHRyaWdnZXJOdW1iZXJlZExpc3QoKXtcbiAgICB0aGlzLnNlcnZpY2UubnVtYmVyZWRMaXN0U3ViamVjdC5uZXh0KCk7XG4gIH1cblxuICBcbn1cbiJdfQ==