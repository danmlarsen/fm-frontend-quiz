const DEFAULT_DURATION_MS = 20000;

export class ProgressBar {
    private timer: number = 0;
    private remainingDuration: number = 0;
    private intervalTime: number;
    private progressBarElement: HTMLElement;

    constructor(private parent: Element, private finishedCallback: () => void = () => null, private totalDuration: number = DEFAULT_DURATION_MS) {
        this.intervalTime = 10;
        this.progressBarElement = document.createElement('div');

        this.renderProgressBar();
    }

    start(): void {
        this.remainingDuration = this.totalDuration;
        this.timer = setInterval(this.handleInterval.bind(this), this.intervalTime);
    }

    stop(): void {
        clearInterval(this.timer);
    }

    calcRemainingPercent(): number {
        return (this.remainingDuration / this.totalDuration) * 100;
    }

    private updateProgressBarWidth(): void {
        this.progressBarElement.style.width = this.calcRemainingPercent().toString() + '%';
    }

    private renderProgressBar(): void {
        this.parent.innerHTML = '';
        this.parent.append(this.progressBarElement);
    }

    private handleInterval(): void {
        this.remainingDuration -= this.intervalTime;
        this.updateProgressBarWidth();

        if (this.remainingDuration <= 0) {
            this.finishedCallback();
            this.stop();
        }
    }
}
