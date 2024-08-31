const iconSunDark = new URL(
  '../assets/images/icon-sun-dark.svg',
  import.meta.url
);

const iconMoonDark = new URL(
  '../assets/images/icon-moon-dark.svg',
  import.meta.url
);

export class Toggle {
  private toggleElement: HTMLElement;

  constructor(private parentElement: Element) {
    this.renderToggle();

    this.toggleElement
      .querySelector('.quiz__theme-toggle')
      ?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
      });
  }

  renderToggle(): void {
    this.parentElement.innerHTML = '';

    this.toggleElement = document.createElement('div');
    this.toggleElement.classList.add('toggle__wrapper');
    this.toggleElement.innerHTML = `
        <img src="${iconSunDark}" alt="Sun icon" class="toggle__icon" />
        <label for="theme-checkbox" class="toggle">
            <input class="quiz__theme-toggle" type="checkbox" name="theme" id="theme-checkbox" />
            <span class="slider"></span>
        </label>
        <img src="${iconMoonDark}" alt="Moon icon" class="toggle__icon" />
    `;
    this.parentElement.append(this.toggleElement);
  }
}
