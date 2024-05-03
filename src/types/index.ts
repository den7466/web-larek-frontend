export interface ICard {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export type TPayment = 'receipt' | 'online';

export interface IOrder {
	payment: TPayment;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IOrderModel {
	order: IOrder;
	clearOrder(): void;
}

export interface IStoreModel {
	cards: ICard[];
	getCard(id: string): ICard;
}

export interface IBasketModel {
	cardsInBasket: ICard[];
	total: number;
	existsInBasket(id: string): boolean;
	addToBasket(card: ICard): void;
	removeFromBasket(id: string): void;
	clearBasket(): void;
}
