import { cloneTemplate, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

export interface IBasket {
	total: number;
	content: HTMLElement[];
	render: (list: HTMLElement[]) => HTMLElement;
}

export class Basket extends EventEmitter implements IBasket {
	protected _total: HTMLElement;
	protected _container: HTMLElement;
	protected _content: HTMLElement;
	protected _buttonCheckout: HTMLButtonElement;

	constructor(template: HTMLTemplateElement) {
		super();
		this._container = cloneTemplate(template);
		this._content = ensureElement<HTMLElement>(
			'.basket__list',
			this._container
		);
		this._total = ensureElement<HTMLElement>('.basket__price', this._container);
		this._buttonCheckout = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this._container
		);
		this._buttonCheckout.addEventListener('click', () =>
			this.emit('open:checkout')
		);
	}

	set total(value: number) {
		this._total.textContent = value.toString() || '';
	}

	set content(value: HTMLElement[]) {
		this._content.replaceChildren(...value);
	}

	protected disableCheckout() {
		this._buttonCheckout.setAttribute('disabled', 'disabled');
	}

	render(list: HTMLElement[]): HTMLElement {
		if (list) this.content = list;
		else this.disableCheckout();
		return this._container;
	}
}
