import iconSunDark from 'url:../assets/images/icon-sun-dark.svg';
import iconMoonDark from 'url:../assets/images/icon-moon-dark.svg';
import iconSunLight from 'url:../assets/images/icon-sun-light.svg';
import iconMoonLight from 'url:../assets/images/icon-moon-light.svg';

export class Toggle {
    private toggleActive: boolean = false;
    private toggleElement: HTMLElement;
    private toggleCheckboxElement: HTMLInputElement;
    private sunIconElement: HTMLImageElement;
    private moonIconElement: HTMLImageElement;

    constructor(private parentElement: Element) {
        if (!localStorage.getItem('dark-mode')) {
            this.toggleActive = true;
        } else {
            this.toggleActive = localStorage.getItem('dark-mode') === 'true';
        }

        this.toggleElement = document.createElement('div');

        this.renderToggle();

        this.toggleCheckboxElement = this.toggleElement.querySelector('#theme-checkbox') as HTMLInputElement;

        this.sunIconElement = this.toggleElement.querySelector('.toggle__icon--sun') as HTMLImageElement;
        this.moonIconElement = this.toggleElement.querySelector('.toggle__icon--moon') as HTMLImageElement;

        this.updateToggle();

        this.toggleCheckboxElement.addEventListener('click', this.onToggleClick.bind(this));
    }

    onToggleClick(): void {
        this.toggleActive = !this.toggleActive;
        localStorage.setItem('dark-mode', '' + this.toggleActive);

        this.updateToggle();
    }

    updateToggle(): void {
        this.toggleCheckboxElement.checked = this.toggleActive;

        if (this.toggleActive) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        this.updateIcons();
    }

    updateIcons(): void {
        if (this.toggleActive) {
            this.sunIconElement.setAttribute('src', iconSunLight);
            this.moonIconElement.setAttribute('src', iconMoonLight);
        } else {
            this.sunIconElement.setAttribute('src', iconSunDark);
            this.moonIconElement.setAttribute('src', iconMoonDark);
        }
    }

    renderToggle(): void {
        this.parentElement.innerHTML = '';

        this.toggleElement.classList.add('toggle__wrapper');
        this.toggleElement.innerHTML = `
        <img src="${this.toggleActive ? iconSunLight : iconSunDark}" alt="Sun icon" class="toggle__icon toggle__icon--sun" />
        <label for="theme-checkbox" class="toggle">
            <input class="quiz__theme-toggle" type="checkbox" name="theme" id="theme-checkbox" aria-label="Dark mode toggle" />
            <span class="slider"></span>
        </label>
        <img src="${this.toggleActive ? iconMoonLight : iconMoonDark}" alt="Moon icon" class="toggle__icon toggle__icon--moon" />
    `;

        this.parentElement.append(this.toggleElement);
    }
}
