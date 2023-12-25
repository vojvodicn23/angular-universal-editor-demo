import { Directive, HostListener, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class TooltipDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtdW5pdmVyc2FsLWVkaXRvci9zcmMvbGliL3NoYXJlZC90b29sdGlwLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFjLFlBQVksRUFBRSxLQUFLLEVBQWEsTUFBTSxlQUFlLENBQUM7O0FBS3RGLE1BQU0sT0FBTyxnQkFBZ0I7SUFVM0IsWUFBb0IsRUFBYyxFQUFVLFFBQW1CO1FBQTNDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBVHRELGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLHFCQUFnQixHQUFHLE9BQU8sQ0FBQztRQUMzQiwyQkFBc0IsR0FBNEIsVUFBVSxDQUFDO0lBT0osQ0FBQztJQUV2QyxZQUFZO1FBQ3RDLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ2xDO1FBQ0QsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFMkIsWUFBWTtRQUN0QyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUM5QjtRQUNELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDdkQsSUFBRyxJQUFJLENBQUMsY0FBYyxFQUFDO29CQUNyQixJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO29CQUNuRCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBRXRFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUM7b0JBQzlELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMscUJBQXFCLEVBQUUsQ0FBQztvQkFFL0QsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztvQkFDOUMsSUFBRyxJQUFJLENBQUMsZ0JBQWdCLEtBQUssUUFBUSxFQUFDO3dCQUNwQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztxQkFDNUM7b0JBQ0QsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFFakUsSUFBRyxJQUFJLENBQUMsc0JBQXNCLEtBQUssVUFBVSxFQUFDO3dCQUM1QyxHQUFHLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7d0JBQzdCLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDL0M7b0JBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7b0JBQ3BFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQztvQkFDL0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDO2lCQUNsRTthQUNGO1FBQ0gsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsQ0FBQztJQUVELGNBQWM7UUFDWixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNsQztRQUVELElBQUksQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNuQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDdEUsSUFBSSxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUM7YUFDakM7UUFDSCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDVixDQUFDOytHQXBFVSxnQkFBZ0I7bUdBQWhCLGdCQUFnQjs7NEZBQWhCLGdCQUFnQjtrQkFINUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtpQkFDMUI7eUhBRVUsV0FBVztzQkFBbkIsS0FBSztnQkFDRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBQ0csc0JBQXNCO3NCQUE5QixLQUFLO2dCQVNzQixZQUFZO3NCQUF2QyxZQUFZO3VCQUFDLFlBQVk7Z0JBT0UsWUFBWTtzQkFBdkMsWUFBWTt1QkFBQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3Rvb2x0aXBUZXh0XSdcbn0pXG5leHBvcnQgY2xhc3MgVG9vbHRpcERpcmVjdGl2ZSB7XG4gIEBJbnB1dCgpIHRvb2x0aXBUZXh0ID0gJyc7XG4gIEBJbnB1dCgpIHRvb2x0aXBQb3N0aXRpb24gPSAnYWJvdmUnO1xuICBASW5wdXQoKSB0b29sdGlwRWxlbWVudFBvc2l0aW9uOiAncmVsYXRpdmUnIHwgJ2Fic29sdXRlJyA9ICdyZWxhdGl2ZSc7XG5cbiAgdG9vbHRpcEVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gIHRpbWVvdXRJZDogYW55O1xuICBoaWRlVGltZW91dElkOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKSBvbk1vdXNlRW50ZXIoKSB7XG4gICAgaWYgKHRoaXMuaGlkZVRpbWVvdXRJZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuaGlkZVRpbWVvdXRJZCk7XG4gICAgfVxuICAgIHRoaXMuY3JlYXRlVG9vbHRpcCgpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpIG9uTW91c2VMZWF2ZSgpIHtcbiAgICBpZiAodGhpcy50aW1lb3V0SWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XG4gICAgfVxuICAgIHRoaXMuZGVzdHJveVRvb2x0aXAoKTtcbiAgfVxuXG4gIGNyZWF0ZVRvb2x0aXAoKSB7XG4gICAgdGhpcy50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghdGhpcy50b29sdGlwRWxlbWVudCkge1xuICAgICAgICB0aGlzLnRvb2x0aXBFbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLnRvb2x0aXBFbGVtZW50LCAndG9vbHRpcCcpO1xuICAgICAgICBpZih0aGlzLnRvb2x0aXBFbGVtZW50KXtcbiAgICAgICAgICB0aGlzLnRvb2x0aXBFbGVtZW50LnRleHRDb250ZW50ID0gdGhpcy50b29sdGlwVGV4dDtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgdGhpcy50b29sdGlwRWxlbWVudCk7XG4gICAgICAgICAgXG4gICAgICAgICAgY29uc3QgaG9zdFBvcyA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICBjb25zdCB0b29sdGlwUG9zID0gdGhpcy50b29sdGlwRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgIGxldCB0b3AgPSBob3N0UG9zLnRvcCAtIHRvb2x0aXBQb3MuaGVpZ2h0IC0gNTtcbiAgICAgICAgICBpZih0aGlzLnRvb2x0aXBQb3N0aXRpb24gPT09ICdiZWxsb3cnKXtcbiAgICAgICAgICAgIHRvcCA9IGhvc3RQb3MudG9wICsgdG9vbHRpcFBvcy5oZWlnaHQgKyAxMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IGxlZnQgPSBob3N0UG9zLmxlZnQgKyAoaG9zdFBvcy53aWR0aCAtIHRvb2x0aXBQb3Mud2lkdGgpIC8gMjtcblxuICAgICAgICAgIGlmKHRoaXMudG9vbHRpcEVsZW1lbnRQb3NpdGlvbiA9PT0gJ2Fic29sdXRlJyl7XG4gICAgICAgICAgICB0b3AgPSB0b29sdGlwUG9zLmhlaWdodCArIDEwO1xuICAgICAgICAgICAgbGVmdCA9IChob3N0UG9zLndpZHRoIC0gdG9vbHRpcFBvcy53aWR0aCkgLyAyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy50b29sdGlwRWxlbWVudCwgJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLnRvb2x0aXBFbGVtZW50LCAndG9wJywgYCR7dG9wfXB4YCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLnRvb2x0aXBFbGVtZW50LCAnbGVmdCcsIGAke2xlZnR9cHhgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIDQwMCk7XG4gIH1cblxuICBkZXN0cm95VG9vbHRpcCgpIHtcbiAgICBpZiAodGhpcy5oaWRlVGltZW91dElkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5oaWRlVGltZW91dElkKTtcbiAgICB9XG5cbiAgICB0aGlzLmhpZGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnRvb2x0aXBFbGVtZW50KSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQodGhpcy5lbC5uYXRpdmVFbGVtZW50LCB0aGlzLnRvb2x0aXBFbGVtZW50KTtcbiAgICAgICAgdGhpcy50b29sdGlwRWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9LCA0MDApO1xuICB9XG59XG4iXX0=