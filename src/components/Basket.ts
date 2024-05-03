import { cloneTemplate, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

export interface IBasket {
	total: number;
	content: HTMLElement[] | null;
	render(list: HTMLElement[]): HTMLElement;
}

export class Basket extends EventEmitter implements IBasket {
	protected _total: HTMLElement;
	protected _container: HTMLElement;
	protected _content: HTMLElement | null;
	protected _buttonCheckout: HTMLButtonElement;

	constructor(template: HTMLTemplateElement) {
		super();
		this._container = cloneTemplate(template);
		this._content = ensureElement<HTMLElement>('.basket__list', this._container);
		this._total = ensureElement<HTMLElement>('.basket__price', this._container);
		this._buttonCheckout = ensureElement<HTMLButtonElement>('.basket__button', this._container);
		this._buttonCheckout.addEventListener('click', () => this.emit('open:checkout'));
	}

	set total(value: number) {
		this._total.textContent = value.toString() || '';
	}

	set content(value: HTMLElement[] | null) {
    if(value)
		  this._content.replaceChildren(...value);
    else
      this._content.textContent = '';
	}

	protected disableCheckout(): void {
		this._buttonCheckout.setAttribute('disabled', 'disabled');
	}

  protected enableCheckout(): void {
    this._buttonCheckout.removeAttribute('disabled');
  }

	render(list: HTMLElement[]): HTMLElement {
		if (list){
      this.content = list;
      this.enableCheckout();
    }else{
      this.content = null;
      this.disableCheckout();
    }
		return this._container;
	}
}
