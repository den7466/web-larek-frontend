import './scss/styles.scss';
import { CDN_URL, API_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { StoreApi } from './components/StoreAPI';
import { StoreModel } from './components/StoreModel';
import { BasketModel } from './components/BasketModel';
import { OrderModel } from './components/OrderModel';
import { ICard, TPayment } from './types';
import { CardGallery } from './components/CardGallery';
import { CardFull } from './components/CardFull';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { CardBasket } from './components/CardBasket';
import { OrderPayment } from './components/OrderPayment';
import { OrderContact } from './components/OrderContact';
import { OrderSuccess } from './components/OrderSuccess';
import { Page } from './components/Page';

// Шаблоны
const galleryCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const cardFullTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderPaymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const succesOrderTemplate = ensureElement<HTMLTemplateElement>('#success');

// Блоки элементов
const pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
const modalElement = ensureElement<HTMLElement>('.modal');

// Обработчики
function handleOpenFullModal(data: { id: string }): void {
	if (basketData.existsInBasket(data.id))
		modal.content = renderViewFull(storeData.getCard(data.id), true);
	else modal.content = renderViewFull(storeData.getCard(data.id), false);
	modal.open();
}

function handleOpenBasketModal(): void {
	modal.content = renderViewBasket();
	modal.open();
}

function handleAddToBasket(data: { id: string }) {
	const basketItem = storeData.getCard(data.id);
	basketData.addToBasket(basketItem);
	page.counter = basketData.cardsInBasket.length;
	modal.content = renderViewFull(storeData.getCard(data.id), true);
	modal.close();
}

function handleRemoveFromBasket(data: { id: string }) {
	basketData.removeFromBasket(data.id);
	page.counter = basketData.cardsInBasket.length;
	modal.content = renderViewBasket();
}

function handleCheckout() {
	orderData.order.items = basketData.cardsInBasket.map((item) => {
		return item.id;
	});
	orderData.order.total = basketData.total;
	modal.content = renderViewOrderPayment();
}

function handleSubmitOrderPayment(data: {
	evt: Event;
	payment: TPayment;
	address: string;
}) {
	data.evt.preventDefault();
	orderData.order.payment = data.payment;
	orderData.order.address = data.address;
	modal.content = renderViewOrderContact();
}

function handleSubmitOrderContact(data: {
	evt: Event;
	email: string;
	phone: string;
}) {
	data.evt.preventDefault();
	orderData.order.email = data.email;
	orderData.order.phone = data.phone;
	api
		.pushOrder(orderData.order)
		.then((data) => {
			basketData.clearBasket();
			page.counter = basketData.cardsInBasket.length;
			orderData.clearOrder();
			modal.content = renderViewOrderSuccess(data.total.toString());
		})
		.catch((err) => {
			console.error('Ошибка отправки данных на сервер: ' + err);
		});
}

function handleCloseOrderSuccess() {
	modal.close();
}

// Отображение с данными
function renderViewFull(data: ICard, addedToBasket: boolean) {
	const cardItem = new CardFull(cardFullTemplate, 'card');
	if (addedToBasket) cardItem.disableAddButton();
	cardItem.on('add:basket', handleAddToBasket.bind(this));
	const cardElement = cardItem.render(data);
	if (cardElement) {
		return cardElement;
	} else {
		return null;
	}
}

function renderViewBasket(): HTMLElement {
	const basketItems = renderViewCardsBasket(basketData.cardsInBasket);
	const basketList = new Basket(basketTemplate);
	if (basketList) {
		basketList.total = basketData.total;
		basketList.on('open:checkout', handleCheckout.bind(this));
		return basketList.render(basketItems);
	} else {
		return null;
	}
}

function renderViewCardsBasket(data: ICard[]) {
	if (data.length !== 0) {
		let index = 0;
		const cardList = data.map((item) => {
			index++;
			const cardItem = new CardBasket(basketCardTemplate, 'card');
			cardItem.on('remove:basket', handleRemoveFromBasket.bind(this));
			cardItem.index = index;
			const cardElement = cardItem.render(item);
			return cardElement;
		});
		if (cardList) {
			return cardList;
		} else {
			return null;
		}
	} else {
		return null;
	}
}

function renderViewOrderPayment(): HTMLElement {
	const orderPaymentForm = new OrderPayment(orderPaymentTemplate);
	if (orderPaymentForm) {
		orderPaymentForm.on('submit:payment', handleSubmitOrderPayment.bind(this));
		return orderPaymentForm.render();
	} else {
		return null;
	}
}

function renderViewOrderContact(): HTMLElement {
	const orderContactForm = new OrderContact(orderContactTemplate);
	if (orderContactForm) {
		orderContactForm.on('submit:contact', handleSubmitOrderContact.bind(this));
		return orderContactForm.render();
	} else {
		return null;
	}
}

function renderViewOrderSuccess(total: string): HTMLElement {
	const orderSuccess = new OrderSuccess(succesOrderTemplate, total);
	if (orderSuccess) {
		orderSuccess.on('close:success', handleCloseOrderSuccess.bind(this));
		return orderSuccess.render();
	} else {
		return null;
	}
}

function renderViewGallery(): void {
	const cardList = storeData.cards.map((item) => {
		const cardItem = new CardGallery(galleryCatalogTemplate, 'card');
		cardItem.on('open:preview', handleOpenFullModal.bind(this));
		const cardElement = cardItem.render(item);
		return cardElement;
	});
	page.content = cardList;
}

// Инициализация
const page = new Page(pageWrapper);
page.on('open:basket', handleOpenBasketModal.bind(this));
const modal = new Modal(modalElement, pageWrapper);
const basketData = new BasketModel();
const orderData = new OrderModel();
const api = new StoreApi(CDN_URL, API_URL);
const storeData = new StoreModel();

// Отображение информации на странице
api.getCardList()
  .then((data) => {
		storeData.cards = data;
		renderViewGallery();
	})
	.catch((err) => {
		console.error('Ошибка загрузки данных с сервера: ' + err);
	});
