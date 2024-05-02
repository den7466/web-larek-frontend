import { cloneTemplate, ensureElement } from '../../utils/utils';
import { EventEmitter } from './events';

export interface IViewCard {
	id: string;
	title: string;
	price: number | null;
}

export class Card extends EventEmitter implements IViewCard {
	protected _container: HTMLElement;
	protected _id: string;
	protected _title: HTMLElement;
	protected _price: HTMLElement;

	constructor(protected template: HTMLTemplateElement, protected blockName: string) {
		super();
		this._container = cloneTemplate(template);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, this._container);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, this._container);
	}

	set id(value: string) {
		this._id = value;
	}

	get id(): string {
		return this._id || '';
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: number | null) {
		if (typeof value === 'number' && value !== 0)
			this._price.textContent = value.toString() || '';
		else this._price.textContent = '';
	}

	get price(): number | null {
		if (this._price.textContent.length !== 0)
			return Number(this._price.textContent);
		else return null;
	}

	protected categoryColorLabel(name: string): string {
		switch (name.toLowerCase()) {
			case 'софт-скил':
				return 'card__category_soft';
				break;
			case 'дополнительное':
				return 'card__category_additional';
				break;
			case 'кнопка':
				return 'card__category_button';
				break;
			case 'хард-скил':
				return 'card__category_hard';
				break;
			default:
				return 'card__category_other';
		}
	}
}
