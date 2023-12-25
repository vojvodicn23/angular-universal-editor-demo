export class UniversalEditorConfig {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdmVyc2FsRWRpdG9yQ29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXVuaXZlcnNhbC1lZGl0b3Ivc3JjL2xpYi9tb2RlbHMvdW5pdmVyc2FsRWRpdG9yQ29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sT0FBTyxxQkFBcUI7SUF1QjlCLFlBQVksU0FBeUMsRUFBRTtRQUNuRCxJQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFDO1FBQ3BELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxNQUFNLENBQUMscUJBQXFCLElBQUksSUFBSSxDQUFDO1FBQ2xFLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUM7UUFDNUMsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQztRQUNoRCxJQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDO1FBQ3RELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxNQUFNLENBQUMsbUJBQW1CLElBQUksSUFBSSxDQUFDO1FBQzlELElBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUM7UUFDdEQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUM7UUFDMUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQztRQUNsRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQztRQUN4RCxJQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDO1FBQ3RELElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7UUFDOUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQztRQUN0RCxJQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxlQUFlLElBQUksTUFBTSxDQUFDO1FBQ3hELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLElBQUksRUFBRSxDQUFDO1FBQ3RELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLElBQUksT0FBTyxDQUFDO1FBQzNELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDO1FBQ3hELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxNQUFNLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDO0lBQ2hFLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNhZmVIdG1sIH0gZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVbml2ZXJzYWxFZGl0b3JDb25maWcge1xyXG4gICAgcGxhY2Vob2xkZXJUZXh0OiBzdHJpbmc7XHJcbiAgICBlbmFibGVDbGVhckZvcm1hdHRpbmc6IGJvb2xlYW47XHJcbiAgICBlbmFibGVCb2xkOiBib29sZWFuO1xyXG4gICAgZW5hYmxlSXRhbGljOiBib29sZWFuO1xyXG4gICAgZW5hYmxlVW5kZXJsaW5lOiBib29sZWFuO1xyXG4gICAgZW5hYmxlU3RyaWtldGhyb3VnaDogYm9vbGVhbjtcclxuICAgIGVuYWJsZVN1YnNjcmlwdDogYm9vbGVhbjtcclxuICAgIGVuYWJsZVN1cGVyc2NyaXB0OiBib29sZWFuO1xyXG4gICAgZW5hYmxlTWVudGlvbjogYm9vbGVhbjtcclxuICAgIGVuYWJsZVRleHRTdHlsZXM6IGJvb2xlYW47XHJcbiAgICBlbmFibGVUZXh0Q29sb3I6IGJvb2xlYW47XHJcbiAgICBzaG93VG9vbGJhcjogYm9vbGVhbjtcclxuICAgIGNvbnRlbnRlZGl0YWJsZTogYm9vbGVhbjtcclxuICAgIG1lbnRpb25Qb3NpdGlvbjogJ2F1dG8nIHwgJ2Fib3ZlJyB8ICdiZWxvdyc7XHJcbiAgICBpbml0aWFsSW5uZXJIVE1MOiBzdHJpbmcgfCBTYWZlSHRtbDtcclxuICAgIGRlZmF1bHRUZXh0Q29sb3I6ICdCbGFjaycgfCAnV2hpdGUnIHwgJ1JlZCcgfCAnR3JlZW4nIHwgJ0JsdWUnIHxcclxuICAgICdZZWxsb3cnIHwgJ0N5YW4nIHwgJ01hZ2VudGEnIHwgJ1NpbHZlcicgfCAnR3JheScgfCAnTWFyb29uJyB8ICdPbGl2ZScgfFxyXG4gICAgJ1B1cnBsZScgfCAnVGVhbCcgfCAnTmF2eScgfCAnQ29yYWwnIHwgJ1R1cnF1b2lzZScgfCAnU2FsbW9uJyB8XHJcbiAgICAnTGltZScgfCAnR29sZCcgfCAnT3JjaGlkJztcclxuICAgIGVuYWJsZUJ1bGxldExpc3Q6IGJvb2xlYW47XHJcbiAgICBlbmFibGVOdW1iZXJlZExpc3Q6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBQYXJ0aWFsPFVuaXZlcnNhbEVkaXRvckNvbmZpZz4gPSB7fSkge1xyXG4gICAgICAgIHRoaXMucGxhY2Vob2xkZXJUZXh0ID0gY29uZmlnLnBsYWNlaG9sZGVyVGV4dCA/PyAnJztcclxuICAgICAgICB0aGlzLmVuYWJsZUNsZWFyRm9ybWF0dGluZyA9IGNvbmZpZy5lbmFibGVDbGVhckZvcm1hdHRpbmcgPz8gdHJ1ZTtcclxuICAgICAgICB0aGlzLmVuYWJsZUJvbGQgPSBjb25maWcuZW5hYmxlQm9sZCA/PyB0cnVlO1xyXG4gICAgICAgIHRoaXMuZW5hYmxlSXRhbGljID0gY29uZmlnLmVuYWJsZUl0YWxpYyA/PyB0cnVlO1xyXG4gICAgICAgIHRoaXMuZW5hYmxlVW5kZXJsaW5lID0gY29uZmlnLmVuYWJsZVVuZGVybGluZSA/PyB0cnVlO1xyXG4gICAgICAgIHRoaXMuZW5hYmxlU3RyaWtldGhyb3VnaCA9IGNvbmZpZy5lbmFibGVTdHJpa2V0aHJvdWdoID8/IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbmFibGVTdWJzY3JpcHQgPSBjb25maWcuZW5hYmxlU3Vic2NyaXB0ID8/IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbmFibGVTdXBlcnNjcmlwdCA9IGNvbmZpZy5lbmFibGVTdXBlcnNjcmlwdCA/PyB0cnVlO1xyXG4gICAgICAgIHRoaXMuZW5hYmxlTWVudGlvbiA9IGNvbmZpZy5lbmFibGVNZW50aW9uID8/IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbmFibGVUZXh0U3R5bGVzID0gY29uZmlnLmVuYWJsZVRleHRTdHlsZXMgPz8gdHJ1ZTtcclxuICAgICAgICB0aGlzLmVuYWJsZVRleHRDb2xvciA9IGNvbmZpZy5lbmFibGVUZXh0Q29sb3IgPz8gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNob3dUb29sYmFyID0gY29uZmlnLnNob3dUb29sYmFyID8/IHRydWU7XHJcbiAgICAgICAgdGhpcy5jb250ZW50ZWRpdGFibGUgPSBjb25maWcuY29udGVudGVkaXRhYmxlID8/IHRydWU7XHJcbiAgICAgICAgdGhpcy5tZW50aW9uUG9zaXRpb24gPSBjb25maWcubWVudGlvblBvc2l0aW9uID8/ICdhdXRvJztcclxuICAgICAgICB0aGlzLmluaXRpYWxJbm5lckhUTUwgPSBjb25maWcuaW5pdGlhbElubmVySFRNTCA/PyAnJztcclxuICAgICAgICB0aGlzLmRlZmF1bHRUZXh0Q29sb3IgPSBjb25maWcuZGVmYXVsdFRleHRDb2xvciA/PyAnQmxhY2snO1xyXG4gICAgICAgIHRoaXMuZW5hYmxlQnVsbGV0TGlzdCA9IGNvbmZpZy5lbmFibGVCdWxsZXRMaXN0ID8/IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbmFibGVOdW1iZXJlZExpc3QgPSBjb25maWcuZW5hYmxlTnVtYmVyZWRMaXN0ID8/IHRydWU7XHJcbiAgICB9XHJcbn0iXX0=