import { cloneTemplate, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

export interface IOrderSuccess {
  total: string;
	render(): HTMLElement;
}

export class OrderSuccess extends EventEmitter implements IOrderSuccess {
	protected _container: HTMLElement;
	protected _description: HTMLElement;
	protected _bottonSuccessClose: HTMLButtonElement;

	constructor(template: HTMLTemplateElement) {
		super();
		this._container = cloneTemplate(template);
		this._description = ensureElement<HTMLElement>('.order-success__description', this._container);
		this._bottonSuccessClose = ensureElement<HTMLButtonElement>('.order-success__close', this._container);
		this._bottonSuccessClose.addEventListener('click', () => this.emit('close:success'));
	}

  set total(value: string) {
    this._description.textContent = `Списано ${value || '0'} синапсов`;
  }

	render(): HTMLElement {
		return this._container;
	}
}
