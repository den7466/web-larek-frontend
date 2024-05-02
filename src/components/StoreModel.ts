import { ICard, IStoreModel } from '../types';

export class StoreModel implements IStoreModel {
	protected _cards: ICard[];

	constructor() {
		this._cards = [];
	}

	set cards(data: ICard[]) {
		this._cards = data;
	}

	get cards(): ICard[] {
		return this._cards;
	}

	getCard(id: string): ICard {
		return this._cards.find((item) => item.id === id);
	}
}
