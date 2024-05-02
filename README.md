# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Интерфейс карточки

```js
export interface ICard {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
```

Интерфейс заказа

```js
export interface IOrder {
  payment: TPayment;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}
```

Тип данных способа оплаты

```js
export type TPayment = 'receipt' | 'online';
```

Интерфейс модели данных заказа

```js
export interface IOrderModel {
  order: IOrder;
	clearOrder: () => void;
}
```

Интерфейс модели данных карточек

```js
export interface IStoreModel {
	cards: ICard[];
	getCard: (id: string) => ICard;
}
```

Интерфейс модели данных корзины

```js
export interface IBasketModel {
	cardsInBasket: ICard[];
	total: number;
	existsInBasket: (id: string) => boolean;
	addToBasket: (card: ICard) => void;
	removeFromBasket: (id: string) => void;
	clearBasket: () => void;
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой данных, отвечает за хранение и изменение данных;
- слой представления, отвечает за отображение данных на странице;
- слой коммуникации, отвечает за связь представления и данных.

### Базовый код

#### Класс EventEmitter
Класс `EventEmitter` реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

Конструктор класса не принимает параметров.

Поля класса:
- `_events: Map<EventName, Set<Subscriber>>` - события.

Методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on<T extends object>(eventName: EventName, callback: (event: T) => void): void` - подписаться на событие;
- `off(eventName: EventName, callback: Subscriber): void` - отписаться от события;
- `emit<T extends object>(eventName: string, data?: T): void` - инициализировать событие.

Дополнительно реализованы методы:
- `onAll(callback: (event: EmitterEvent) => void): void` - подписаться на все события;
- `offAll(): void` - отписаться от всех событий;
- `trigger<T extends object>(eventName: string, context?: Partial<T>): (data: T) => void` - сгенерировать заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса `EventEmitter`.

#### Класс Api
Класс `Api` реализует базовую логику отправки запросов на сервер с данными.

Конструктор класса принимает базовый адрес сервера и опционально объект с заголовками запросов.

Методы, реализуемые классом:
- `get(uri: string): Promise<object>` - выполняет `GET` запрос на ендпоинт, принимает один параметр - ендпоинт и возвращает ответ от сервера в виде промиса с объектом;
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - выполняет `POST` запрос на эндпоинт, принимает три параметра: ендпоинт, объект с данными, метод запроса(по умолчанию - `POST`) и возвращает ответ от сервера в виде промиса с объектом.

#### Базовый класс Card
Класс `Card`, расширяет класс `EventEmitter`, описан интерфейсом `IViewCard`, реализует базовое отображение карточки товара и является базовым классом для карточек товара.

Конструктор класса принимает два параметра: `template` - шаблон разметки блока, blockName - наименование главного блока карточки.

Поля класса:
- `_container: HTMLElement` - элемент карточки с разметкой;
- `_id: string` - id карточки;
- `_title: HTMLElement` - элемент наименования карточки товара;
- `_price: HTMLElement` - элемент цены карточки товара.

Методы, реализуемые классом:
- `protected categoryColorLabel(name: string): string` - защищенный метод, параметром принимает наименование категории, отдает наименование CSS класса.

Сеттеры, геттеры:
- `set id(value: string)` - сеттер для установки id карточки;
- `get id(): string` - геттер, возвращает id карточки;
- `set title(value: string)` - сеттер для установки наименования карточки;
- `get title(): string` - геттер, возвращает наименование карточки;
- `set price(value: number | null)` - сеттер для установки цены карточки;
- `get price(): number | null` - геттер, возвращает цену карточки.

#### Базовый класс Form
Класс `Form`, расширяет класс `EventEmitter`, реализует базовое отображение форм и является базовым классом для форм.

Конструктор класса принимает два параметра: `template` - шаблон разметки блока, blockName - наименование главного блока формы.

Поля класса:
- `_container: HTMLElement` - элемент формы с разметкой;
- `_inputs: HTMLInputElement[]` - массив элементов полей ввода;
- `_buttonSubmit: HTMLButtonElement` - элемент кнопки отправки;
- `_errors: HTMLElement` - элемент ошибки форм.

Методы, реализуемые классом:
- `private isValid(inputs: HTMLInputElement[]): boolean` - приватный метод, параметром принимает массив элементов полей ввода, возвращает true или false - на основании заполненности всех полей;
- `private disableSubmit(disabled: boolean): void` - приватный метод, параметром принимает true или false, отключает кнопку отправки формы;
- `private setValidate(inputs: HTMLInputElement[]): void` - приватный метод, параметром принимает массив элементов полей ввода,  устанавливает валидацию на все поля ввода;
- `protected findInputByName(name: string): HTMLInputElement` - защищенный метод, параметром принимает наименование поля, возвращает элемент поля ввода на основании переданного имени.

Сеттеры, геттеры:

### Слой данных

#### Класс StoreModel
Класс `StoreModel`, описан интерфейсом `IStoreModel`, реализует хранение и логику работы с данными карточек.

Конструктор класса не принимает параметров.

Поля класса:
- `_cards: ICard[]` - массив объектов карточек.

Методы, реализуемые классом:
- `getCard(id: string): ICard` - параметром принимает id карточки и возвращает карточку соответствующую переданному id.

Сеттеры, геттеры:
- `set cards(data: ICard[])` - сеттер для добавления массива карточек;
- `get cards(): ICard[]` - геттер, возвращает массив карточек.

#### Класс BasketModel
Класс `BasketModel`, описан интерфейсом `IBasketModel`, реализует хранение и логику работы с данными корзины.

Конструктор класса не принимает параметров.

Поля класса:
- `_cardsInBasket: ICard[]` - массив объектов карточек;
- `_total: number` - итоговая сумма.

Методы, реализуемые классом:
- `existsInBasket(id: string): boolean` - параметром принимает id карточки, если карточка в корзине уже есть, возвращает ответ типа `boolean`;
- `addToBasket(card: ICard): void` - параметром принимает объект карточки, добавляет карточку в массив `_cardsInBasket`;
- `removeFromBasket(id: string): void` - параметром принимает id карточки, удаляет карточку из массива `_cardsInBasket` соответствующую переданному id;
- `clearBasket(): void` - очищает массив `_cardsInBasket`, и свойство `_total`;
- `private calculateTotal(items: ICard[]): number` - приватный метод, считает итоговую цену.

Сеттеры, геттеры:
- `set cardsInBasket(data: ICard[])` - сеттер для добавления массива карточек в корзину;
- `get cardsInBasket(): ICard[]` - геттер, возвращает массив карточек в корзине;
- `get total(): number` - геттер, возвращает итоговую цену.

#### Класс OrderModel
Класс `OrderModel`, описан интерфейсом `IOrderModel`, реализует хранение и логику работы с данными заказа.

Конструктор класса не принимает параметров.

Поля класса:
- `_order: IOrder` - объект заказа.

Методы, реализуемые классом:
- `clearOrder(): void` - очищает поля объекта `_order`.

Сеттеры, геттеры:
- `set payment(value: TPayment)` - сеттер для добавления способа платежа в заказ;
- `get payment(): TPayment` - геттер, возвращает способ платежа заказа;
- `set email(value: string)` - сеттер для добавления email-а в заказ;
- `get email(): string` - геттер, возвращает email заказа;
- `set phone(value: string)` - сеттер для добавления номера телефона в заказ;
- `get phone(): string` - геттер, возвращает номер телефона заказа;
- `set address(value: string)` - сеттер для добавления адреса доставки в заказ;
- `get address(): string` - геттер, возвращает адрес доставки заказа;
- `set total(value: number)` - сеттер для добавления итоговой цены заказа;
- `get total(): number` - геттер, возвращает итоговую цену заказа;
- `set items(value: string[])` - сеттер для добавления массива элементов заказа;
- `get items(): string[]` - геттер, возвращает массив элементов заказа;
- `get order(): IOrder` - геттер, возвращает итоговые данные заказа.

### Слой представления

#### Класс Basket
Класс `Basket` расширяет класс `EventEmitter`, описан интерфейсом `IBasket`, реализует отображение блока корзины заказов.

Конструктор класса принимает один параметр: `template` - шаблон разметки блока.

Поля класса:
- `_total: HTMLElement` - элемент с итоговой ценой;
- `_container: HTMLElement` - элемент с итоговой разметкой корзины заказов;
- `_content: HTMLElement` - элемент отображения списка карточек в корзине заказов;
- `_buttonCheckout: HTMLButtonElement` - элемент кнопки оформления заказа.

Методы, реализуемые классом:
- `protected disableCheckout()` - защищенный метод для отключения кнопки оформления заказа;
- `render(list: HTMLElement[]): HTMLElement` - параметром принимает массив карточек, возвращает готовый элемент корзины со списком карточек.

Сеттеры, геттеры:
- `set total(value: number)` - сеттер для установки итоговой цены в корзине заказов;
- `set content(value: HTMLElement[])` - сеттер для установки списка элементов в корзине заказов.

#### Класс CardGallery
Класс `CardGallery`, расширяет класс `Card`, описан интерфейсом `IViewCardGallery`, реализует отображение карточки товара в галереи карточек.

Конструктор класса принимает два параметра: `template` - шаблон разметки блока, blockName - наименование главного блока карточки.

Поля класса:
- `_image: HTMLImageElement` - элемент изображения карточки товара;
- `_category: HTMLElement` - элемент категории карточки товара.

Методы, реализуемые классом:
- `render(card: ICard): HTMLElement` - параметром принимает данные карточки товара, возвращает готовую карточку с данными.

Сеттеры, геттеры:
- `set category(value: string)` - сеттер для установки наименования категории карточки;
- `get category(): string` - геттер, возвращает наименование категории карточки;
- `set image(src: string)` - сеттер для установки url изображения карточки;
- `get image(): string` - геттер, возвращает url изображения карточки.

#### Класс CardBasket
Класс `CardBasket`, расширяет класс `Card`, описан интерфейсом `IViewCardBasket`, реализует отображение карточки товара в корзине заказов.

Конструктор класса принимает два параметра: `template` - шаблон разметки блока, blockName - наименование главного блока карточки.

Поля класса:
- `_index: HTMLElement` - элемент идентификатора карточки;
- `_buttonDeleteFromBasket: HTMLButtonElement` - элемент кнопки удаления товара из корзины.

Методы, реализуемые классом:
- `render(card: ICard): HTMLElement` - параметром принимает данные карточки товара, возвращает готовую карточку с данными.

Сеттеры, геттеры:
- `set index(value: number)` - сеттер для установки индекса карточки для списка корзины товара.

#### Класс CardFull
Класс `CardFull`, расширяет класс `CardGallery`, описан интерфейсом `IViewCardFull`, реализует отображение полной карточки.

Конструктор класса принимает два параметра: `template` - шаблон разметки блока, blockName - наименование главного блока карточки.

Поля класса:
- `_description: HTMLElement` - элемент с описание товара;
- `_buttonAddToBasket: HTMLButtonElement` - элемент кнопки добавления в корзину товаров.

Методы, реализуемые классом:
- `disableAddButton(): void` - отключает кнопку добавления в корзину товара;
- `render(card: ICard): HTMLElement` - параметром принимает данные карточки товара, возвращает готовую карточку с полными данными.

Сеттеры, геттеры:
- `set description(value: string)` - сеттер для установки полного описания карточки;
- `get description(): string` - геттер, возвращает полное описание карточки.

#### Класс Modal
Класс `Modal`, описан интерфейсом `IModal`, реализует отображение модального окна.

Конструктор класса принимает два параметра: container - контейнер модального окна, pageWrapper - главный блок всей страницы.

Поля класса:
- `_closeButton: HTMLButtonElement` - элемент кнопки закрытия;
- `_content: HTMLElement` - элемент контента;
- `_pageWrapper: HTMLElement` - элемент главного блока станицы.

Методы, реализуемые классом:
- `open(): void` - открывает модальное окно;
- `close(): void` - закрывает модальное окно.

Сеттеры, геттеры:
- `set content(value: HTMLElement | string)` - сеттер для добавления контента в модальное окно.

#### Класс OrderContact
Класс `OrderContact`, расширяет класс `EventEmitter`, описан интерфейсом `IOrderContact`, реализует отображение формы с добавлением контактных данных.

Конструктор класса принимает два параметра: `template` - шаблон разметки блока, blockName - наименование главного блока формы.

Поля класса:
- `_email: HTMLInputElement` - элемент поля ввода email;
- `_phone: HTMLInputElement` - элемент поля ввода phone.

Методы, реализуемые классом:
- `render(): HTMLElement` - не принимает параметров, возвращает готовый элемент формы.

#### Класс OrderPayment
Класс `OrderPayment`, расширяет класс `Form`, описан интерфейсом `IOrderPayment`, реализует отображение формы с добавлением адреса и выбора метода оплаты.

Конструктор класса принимает два параметра: `template` - шаблон разметки блока, blockName - наименование главного блока формы.

Поля класса:
- `_payment: TPayment` - способ оплаты;
- `_address: HTMLInputElement` - элемент поля ввода адреса;
- `_onlinePaymentButton: HTMLButtonElement` - элемент кнопки выбора метода платежа "Онлайн";
- `_receiptPaymentButton: HTMLButtonElement` - элемент кнопки выбора метода платежа "При получении".

Методы, реализуемые классом:
- `private selectOnlinePayment(): void` - выбирает метод оплаты "онлайн";
- `private selectReceiptPayment(): void` - выбирает метод оплаты "при получении";
- `render(): HTMLElement` - не принимает параметров, возвращает готовый элемент формы.

#### Класс OrderSuccess
Класс `OrderSuccess`, расширяет класс `EventEmitter`, описан интерфейсом `IOrderSuccess`, реализует отображение информации об успешном оформлении заказа.

Конструктор класса принимает два параметра: `template` - шаблон разметки блока, total - итоговая цена.

Поля класса:
- `_container: HTMLElement` - элемент с итоговой разметкой блока;
- `_description: HTMLElement` - элемент описания успешного заказа;
- `_bottonSuccessClose: HTMLButtonElement` - элемент кнопки закрытия модального окна.

Методы, реализуемые классом:
- `render(): HTMLElement` - не принимает параметров, возвращает готовый элемент блока успешного заказа.

#### Класс Page
Класс `Page`, расширяет класс `EventEmitter`, описан интерфейсом `IPage`, реализует отображение общих элементов на странице.

Конструктор класса принимает один параметр: pageContainer - главный блок страницы.

Поля класса:
- `_buttonBasket: HTMLButtonElement` - элемент кнопки корзины заказов;
- `_counterBasket: HTMLElement` - элемент счетчика заказов;
- `_listContainer: HTMLElement` - элемент для отображения списка товаров.

Методы, реализуемые классом - нет.

Сеттеры, геттеры:
- `set content(cards: HTMLElement[])` - сеттер для установки контента на странице в контентной области;
- `set counter(value: number)` - сеттер для установки значения в счетчик заказов.

### Слой коммуникации

#### Класс StoreApi
Класс `StoreApi`, расширяет класс `Api`, описан интерфейсом `IStoreAPI`, реализует взаимодействие с бэкендом сервиса.

Конструктор класса принимает три параметра: cdn - базовый url для изображений, baseUrl - базовый url сервера с данными, options - заголовки, если есть.

Поля класса:
- `cdn: string` - базовый url для изображений.

Методы, реализуемые классом:
- `getCardList(): Promise<ICard[]>` - не принимает параметров, возвращает промис со списком карточек;
- `getCardItem(id: string): Promise<ICard>` - параметром принимает id карточки, возвращает промис с данными карточки, соответствующей переданному id;
- `pushOrder(data: IOrder): Promise<any>` - параметром принимает данные о заказе, передает данные на сервер, возвращает промис с ответом от сервера.

## Взаимодействие компонентов
Взаимодействие между слоем данных и слоем представления происходит в файле `index.ts`, который выполняет роль презентера.\
Данные, принятые с сервера передаются в слой модели данных, там обрабатываются, после чего готовые данные передаются в слой представления, который в свою очередь на основании переданного шаблона формирует готовый элемент с разметкой - отдает его в `index.ts`.\
Все взаимодействия осуществляются за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.\
Данные форм собираются в модели данных заказа при помощи сеттеров в `index.ts` в функциях-обработчиках, после чего - отправляются на сервер.\