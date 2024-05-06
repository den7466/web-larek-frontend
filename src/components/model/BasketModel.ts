import { IBasketModel, ICard } from '../../types';

export class BasketModel implements IBasketModel {
	protected _cardsInBasket: ICard[];
	protected _total: number;

	constructor() {
		this._cardsInBasket = [];
		this._total = 0;
	}

	set cardsInBasket(data: ICard[]) {
		this._cardsInBasket = data;
	}

	get cardsInBasket(): ICard[] {
		return this._cardsInBasket;
	}

	get total(): number {
		return this._total;
	}

	private calculateTotal(items: ICard[]): number {
		let result: number = 0;
		items.forEach((item) => {
			result += item.price;
		});
		return result;
	}

	existsInBasket(id: string): boolean {
		if (this._cardsInBasket.find((item) => item.id === id)) return true;
		else return false;
	}

	addToBasket(card: ICard): void {
		this._cardsInBasket.push(card);
		this._total = this.calculateTotal(this._cardsInBasket);
	}

	removeFromBasket(id: string): void {
		this._cardsInBasket = this._cardsInBasket.filter((item) => item.id !== id);
		this._total = this.calculateTotal(this._cardsInBasket);
	}

	clearBasket(): void {
		this._cardsInBasket = [];
		this._total = 0;
	}
}
