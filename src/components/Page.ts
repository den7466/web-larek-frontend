import { ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

export interface IPage {
	content: HTMLElement[];
	counter: number;
}

export class Page extends EventEmitter implements IPage {
	protected _buttonBasket: HTMLButtonElement;
	protected _counterBasket: HTMLElement;
	protected _content: HTMLElement;

	constructor(protected pageContainer: HTMLElement) {
		super();
		this._content = ensureElement<HTMLElement>('.gallery', pageContainer);
		this._buttonBasket = ensureElement<HTMLButtonElement>('.header__basket', pageContainer);
		this._counterBasket = ensureElement<HTMLElement>('.header__basket-counter', pageContainer);
		this._buttonBasket.addEventListener('click', () => this.emit('open:basket'));
	}

	set content(cards: HTMLElement[]) {
		if (cards) {
			this._content.replaceChildren(...cards);
		} else {
			this._content.innerHTML = '';
		}
	}

	set counter(value: number) {
		this._counterBasket.textContent = value.toString();
	}
}
