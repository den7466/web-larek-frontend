import { ICard } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Card } from '../base/Card';

export interface IViewCardBasket {
	index: number;
	render(card: ICard): HTMLElement;
}

export class CardBasket extends Card implements IViewCardBasket {
	protected _index: HTMLElement;
	protected _buttonDeleteFromBasket: HTMLButtonElement;

	constructor(protected template: HTMLTemplateElement, protected blockName: string) {
		super(template, blockName);
		this._index = ensureElement<HTMLElement>(`.basket__item-index`, this._container);
		this._buttonDeleteFromBasket = ensureElement<HTMLButtonElement>(`.basket__item-delete`, this._container);
		this._buttonDeleteFromBasket.addEventListener('click', () => this.emit('remove:basket', { id: this._id }));
	}

	set index(value: number) {
		this._index.textContent = value.toString() || '';
	}

	render(card: ICard): HTMLElement {
		this.id = card.id;
		this.title = card.title;
		this.price = card.price;
		return this._container;
	}
}
