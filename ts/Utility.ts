import iconHtml from '../assets/images/icon-html.svg';
import iconCss from '../assets/images/icon-css.svg';
import iconJs from '../assets/images/icon-js.svg';
import iconAccessibility from '../assets/images/icon-accessibility.svg';

export const numToLabel = function (index: number): string {
    switch (index) {
        default:
        case 0:
            return 'A';
        case 1:
            return 'B';
        case 2:
            return 'C';
        case 3:
            return 'D';
    }
};

export const getIcon = function (str: string): any {
    str = str.toLowerCase();

    if (str === 'html') return iconHtml;
    if (str === 'css') return iconCss;
    if (str === 'javascript') return iconJs;
    if (str === 'accessibility') return iconAccessibility;
};

export const escapeHtml = function (str: string): string {
    return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot').replaceAll("'", '&#039;');
};
