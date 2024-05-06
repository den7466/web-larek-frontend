import { Form } from '../base/Form';

export interface IOrderContact {
	render(): HTMLElement;
}

export class OrderContact extends Form implements IOrderContact {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(protected template: HTMLTemplateElement, protected blockName: string) {
		super(template, blockName);
		this._email = this.findInputByName('email');
		this._phone = this.findInputByName('phone');
    this._email.addEventListener('input', () => this.emit('onChange:contact', {phone: this._phone.value, email: this._email.value}));
		this._phone.addEventListener('input', () => this.emit('onChange:contact', {phone: this._phone.value, email: this._email.value}));
    this._container.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.emit('submit:contact');
    });
	}

	render(): HTMLElement {
		return this._container;
	}
}
