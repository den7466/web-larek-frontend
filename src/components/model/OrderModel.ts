import { IOrder, IOrderModel, TPayment } from '../../types';

export class OrderModel implements IOrderModel {
	protected _order: IOrder;

	constructor() {
		this._order = {
			payment: 'online',
			email: '',
			phone: '',
			address: '',
			total: 0,
			items: [],
		};
	}

	set payment(value: TPayment) {
		this._order.payment = value || 'online';
	}

	get payment(): TPayment {
		return this._order.payment;
	}

	set email(value: string) {
		this._order.email = value || '';
	}

	get email(): string {
		return this._order.email;
	}

	set phone(value: string) {
		this._order.phone = value || '';
	}

	get phone(): string {
		return this._order.phone;
	}

	set address(value: string) {
		this._order.address = value || '';
	}

	get address(): string {
		return this._order.address || '';
	}

	set total(value: number) {
		this._order.total = value || 0;
	}

	get total(): number {
		return this._order.total;
	}

	set items(value: string[]) {
		this._order.items = value;
	}

	get items(): string[] {
		return this._order.items;
	}

	get order(): IOrder {
		return this._order;
	}

  checkValidation(value: string | TPayment): boolean {
    if(typeof value === 'string'){
      if(value.length > 0) return true;
      else return false;
    }else{
      if(value === 'online' || value === 'receipt') return true;
      else return false;
    }
  }

	clearOrder(): void {
		this._order.payment = 'online';
		this._order.email = '';
		this._order.phone = '';
		this._order.address = '';
		this._order.total = 0;
		this._order.items = [];
	}
}
