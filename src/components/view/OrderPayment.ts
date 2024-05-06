import { TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Form } from '../base/Form';

export interface IOrderPayment {
	render(payment: TPayment): HTMLElement;
}

export class OrderPayment extends Form implements IOrderPayment {
	protected _address: HTMLInputElement;
  protected _payment: TPayment;
	protected _onlinePaymentButton: HTMLButtonElement;
	protected _receiptPaymentButton: HTMLButtonElement;

	constructor(protected template: HTMLTemplateElement, protected blockName: string) {
		super(template, blockName);
    this._address = this.findInputByName('address');
		this._onlinePaymentButton = ensureElement<HTMLButtonElement>('button[name="card"]', this._container);
		this._receiptPaymentButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this._container);
		this._onlinePaymentButton.addEventListener('click', () => {
      this.selectOnlinePayment();
      this.emit('onChange:payment', {payment: this._payment, address: this._address.value});
    });
		this._receiptPaymentButton.addEventListener('click', () => {
      this.selectReceiptPayment();
      this.emit('onChange:payment', {payment: this._payment, address: this._address.value});
    });
		this._address.addEventListener('input', () => this.emit('onChange:payment', {payment: this._payment, address: this._address.value}));
    this._container.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.emit('submit:payment')
    });
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

	render(payment: TPayment): HTMLElement {
		if(payment === 'online') this.selectOnlinePayment();
    else this.selectReceiptPayment();
    return this._container;
	}
}
