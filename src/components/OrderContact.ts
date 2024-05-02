import { Form } from './base/Form';

export interface IOrderContact {
	render: () => HTMLElement;
}

export class OrderContact extends Form implements IOrderContact {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(protected template: HTMLTemplateElement, protected blockName: string) {
		super(template, blockName);
		this._email = this.findInputByName('email');
		this._phone = this.findInputByName('phone');
		this._container.addEventListener('submit', (evt) => this.emit('submit:contact', {evt, email: this._email.value, phone: this._phone.value,}));
	}

	render(): HTMLElement {
		return this._container;
	}
}
