import { TPayment } from '../types';
import { ensureElement } from '../utils/utils';
import { Form } from './base/Form';

export interface IOrderPayment {
	render: () => HTMLElement;
}

export class OrderPayment extends Form implements IOrderPayment {
	protected _payment: TPayment;
	protected _address: HTMLInputElement;
	protected _onlinePaymentButton: HTMLButtonElement;
	protected _receiptPaymentButton: HTMLButtonElement;

	constructor(protected template: HTMLTemplateElement, protected blockName: string) {
		super(template, blockName);
    this._address = this.findInputByName('address');
		this._onlinePaymentButton = ensureElement<HTMLButtonElement>('button[name="card"]', this._container);
		this._receiptPaymentButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this._container);
		this._onlinePaymentButton.addEventListener('click', () => this.selectOnlinePayment());
		this._receiptPaymentButton.addEventListener('click', () => this.selectReceiptPayment());
		this._container.addEventListener('submit', (evt) => this.emit('submit:payment', {evt, payment: this._payment, address: this._address.value,}));
		this.selectOnlinePayment();
	}

	private selectOnlinePayment(): void {
		this._onlinePaymentButton.classList.add('button_alt-active');
		this._receiptPaymentButton.classList.remove('button_alt-active');
		this._payment = 'online';
	}

	private selectReceiptPayment(): void {
		this._receiptPaymentButton.classList.add('button_alt-active');
		this._onlinePaymentButton.classList.remove('button_alt-active');
		this._payment = 'receipt';
	}

	render(): HTMLElement {
		return this._container;
	}
}
