import { ICard, IOrder } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface IStoreAPI {
	getCardList(): Promise<ICard[]>;
	getCardItem(id: string): Promise<ICard>;
	pushOrder(data: IOrder): Promise<any>;
}

export class StoreApi extends Api implements IStoreAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCardList(): Promise<ICard[]> {
		return this.get('/product').then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getCardItem(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	pushOrder(data: IOrder): Promise<any> {
		return this.post('/order', data).then((data: any) => data);
	}
}
