import { cloneTemplate, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

export interface IOrderSuccess {
	render: () => HTMLElement;
}

export class OrderSuccess extends EventEmitter implements IOrderSuccess {
	protected _container: HTMLElement;
	protected _description: HTMLElement;
	protected _bottonSuccessClose: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, total: string) {
		super();
		this._container = cloneTemplate(template);
		this._description = ensureElement<HTMLElement>('.order-success__description', this._container);
		this._description.textContent = `Списано ${total} синапсов`;
		this._bottonSuccessClose = ensureElement<HTMLButtonElement>('.order-success__close', this._container);
		this._bottonSuccessClose.addEventListener('click', () => this.emit('close:success'));
	}

	render(): HTMLElement {
		return this._container;
	}
}
