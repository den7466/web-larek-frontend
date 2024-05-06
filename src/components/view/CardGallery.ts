import { ICard } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Card } from '../base/Card';

export interface IViewCardGallery {
	image: string;
	category: string;
	render(card: ICard): HTMLElement;
}

export class CardGallery extends Card implements IViewCardGallery {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;

	constructor(template: HTMLTemplateElement, protected blockName: string) {
		super(template, blockName);
		this._category = ensureElement<HTMLElement>(`.${blockName}__category`, this._container);
		this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, this._container);
		this._container.addEventListener('click', () => this.emit('open:preview', { id: this._id }));
	}

	set category(value: string) {
		this._category.textContent = value || '';
    this._category.className = 'card__category';
		this._category.classList.add(this.categoryColorLabel(value));
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set image(src: string) {
		this._image.setAttribute('src', src || '');
		this._image.setAttribute('alt', this._title.textContent || '');
	}

	get image(): string {
		return this._image.src;
	}

	render(card: ICard): HTMLElement {
		this.id = card.id;
		this.title = card.title;
		this.image = card.image;
		this.category = card.category;
    this.price = card.price;
		return this._container;
	}
}
