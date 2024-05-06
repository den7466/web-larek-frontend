import './scss/styles.scss';
import { CDN_URL, API_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { StoreApi } from './components/StoreAPI';
import { StoreModel } from './components/model/StoreModel';
import { BasketModel } from './components/model/BasketModel';
import { OrderModel } from './components/model/OrderModel';
import { ICard, TPayment } from './types';
import { CardGallery } from './components/view/CardGallery';
import { CardFull } from './components/view/CardFull';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { CardBasket } from './components/view/CardBasket';
import { OrderPayment } from './components/view/OrderPayment';
import { OrderContact } from './components/view/OrderContact';
import { OrderSuccess } from './components/view/OrderSuccess';
import { Page } from './components/view/Page';

// Шаблоны
const galleryCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardFullTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderPaymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const succesOrderTemplate = ensureElement<HTMLTemplateElement>('#success');

// Блоки элементов
const pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
const modalElement = ensureElement<HTMLElement>('.modal');

// Инициализация
const page = new Page(pageWrapper);
const modal = new Modal(modalElement, pageWrapper);
const basketData = new BasketModel();
const orderData = new OrderModel();
const api = new StoreApi(CDN_URL, API_URL);
const storeData = new StoreModel();
const cardFull = new CardFull(cardFullTemplate, 'card');
const basketList = new Basket(basketTemplate);
const orderPaymentForm = new OrderPayment(orderPaymentTemplate, 'form');
const orderContactForm = new OrderContact(orderContactTemplate, 'form');
const orderSuccess = new OrderSuccess(succesOrderTemplate);

// Обработчики
function handleOpenFullModal(data: { id: string }): void {
	if (basketData.existsInBasket(data.id)) cardFull.disableAddButton();
	else cardFull.enableAddButton();
	modal.content = cardFull.render(storeData.getCard(data.id));
	modal.open();
}

function handleOpenBasketModal(): void {
	basketList.total = basketData.total;
	modal.content = basketList.render(renderViewCardsBasket(basketData.cardsInBasket));
	modal.open();
}

function handleAddToBasket(data: { id: string }) {
	const basketItem = storeData.getCard(data.id);
	basketData.addToBasket(basketItem);
	page.counter = basketData.cardsInBasket.length;
	modal.close();
}

function handleRemoveFromBasket(data: { id: string }) {
	basketData.removeFromBasket(data.id);
	basketList.total = basketData.total;
	page.counter = basketData.cardsInBasket.length;
	modal.content = basketList.render(renderViewCardsBasket(basketData.cardsInBasket));
}

function handleCheckout() {
	orderData.order.items = basketData.cardsInBasket.map((item) => item.id);
	orderData.order.total = basketData.total;
	orderPaymentForm.clear();
  orderPaymentForm.disableSubmit(true);
	modal.content = orderPaymentForm.render('online');
}

function handleSubmitOrderPayment() {
	orderContactForm.clear();
  orderContactForm.disableSubmit(true);
	modal.content = orderContactForm.render();
}

function handleSubmitOrderContact() {
	api.pushOrder(orderData.order)
		.then((data) => {
			basketData.clearBasket();
			page.counter = basketData.cardsInBasket.length;
			orderData.clearOrder();
			orderSuccess.total = data.total.toString();
			modal.content = orderSuccess.render();
		})
		.catch((err) => {
			console.error('Ошибка отправки данных на сервер: ' + err);
		});
}

function handleCloseOrderSuccess() {
	modal.close();
}

function handleOnChangePayment(data: {payment: TPayment, address: string}) {
  orderData.order.payment = data.payment;
	orderData.order.address = data.address;
  if(orderData.checkValidation(orderData.order.payment) && orderData.checkValidation(orderData.order.address)){
    orderPaymentForm.disableSubmit(false);
    orderPaymentForm.error = '';
  }else{
    orderPaymentForm.disableSubmit(true);
    orderPaymentForm.error = 'Пожалуйста, заполните все поля!';
  }
  orderPaymentForm.render(orderData.order.payment);
}

function handleOnChangeContact(data: {email: string, phone: string}) {
  orderData.order.email = data.email;
	orderData.order.phone = data.phone;
  if(orderData.checkValidation(orderData.order.email) && orderData.checkValidation(orderData.order.phone)){
    orderContactForm.disableSubmit(false);
    orderContactForm.error = '';
  }else{
    orderContactForm.disableSubmit(true);
    orderContactForm.error = 'Пожалуйста, заполните все поля!'
  }
  orderContactForm.render();
}

// Подготовка списка карточек
function renderViewCardsBasket(data: ICard[]) {
	if (data.length !== 0) {
		let index = 0;
		const cardList = data.map((item) => {
			index++;
			const cardItem = new CardBasket(basketCardTemplate, 'card');
			cardItem.index = index;
			// Установка слушателя
			cardItem.on('remove:basket', handleRemoveFromBasket);
			return cardItem.render(item);
		});
		return cardList;
	} else {
		return null;
	}
}

function renderViewGallery(): HTMLElement[] {
	if (storeData.cards.length !== 0) {
		const cardList = storeData.cards.map((item) => {
			const cardItem = new CardGallery(galleryCatalogTemplate, 'card');
			// Установка слушателя
			cardItem.on('open:preview', handleOpenFullModal);
			return cardItem.render(item);
		});
		return cardList;
	} else {
		return null;
	}
}

// Установка слушателей
page.on('open:basket', handleOpenBasketModal);
cardFull.on('add:basket', handleAddToBasket);
basketList.on('open:checkout', handleCheckout);
orderPaymentForm.on('submit:payment', handleSubmitOrderPayment);
orderPaymentForm.on('onChange:payment', handleOnChangePayment);
orderContactForm.on('submit:contact', handleSubmitOrderContact);
orderContactForm.on('onChange:contact', handleOnChangeContact);
orderSuccess.on('close:success', handleCloseOrderSuccess);

// Отображение информации на странице
api.getCardList()
	.then((data) => {
		storeData.cards = data;
		page.content = renderViewGallery();
	})
	.catch((err) => {
		console.error('Ошибка загрузки данных с сервера: ' + err);
	});