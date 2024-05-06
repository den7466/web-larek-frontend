import { ICard } from '../../types';
import { ensureElement } from '../../utils/utils';
import { CardGallery } from './CardGallery';

export interface IViewCardFull {
	description: string;
	disableAddButton(): void;
  enableAddButton(): void;
	render(card: ICard): HTMLElement;
}

export class CardFull extends CardGallery implements IViewCardFull {
	protected _description: HTMLElement;
	protected _buttonAddToBasket: HTMLButtonElement;

	constructor(protected template: HTMLTemplateElement, protected blockName: string) {
		super(template, blockName);
		this._description = ensureElement<HTMLElement>(`.${blockName}__text`, this._container);
		this._buttonAddToBasket = ensureElement<HTMLButtonElement>(`.${blockName}__button`, this._container);
		this._buttonAddToBasket.addEventListener('click', () => this.emit('add:basket', { id: this._id }));
	}

	set description(value: string) {
		this._description.textContent = value || '';
	}

	get description(): string {
		return this._description.textContent;
	}

	disableAddButton(): void {
		this._buttonAddToBasket.setAttribute('disabled', 'disabled');
	}

  enableAddButton(): void {
    this._buttonAddToBasket.removeAttribute('disabled');
  }

	render(card: ICard): HTMLElement {
		this.id = card.id;
		this.title = card.title;
		this.image = card.image;
		this.category = card.category;
		this.price = card.price;
		this.description = card.description;
		if (this.price === null) this.disableAddButton();
		return this._container;
	}
}
