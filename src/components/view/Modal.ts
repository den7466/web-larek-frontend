import { ensureElement } from "../../utils/utils";

export interface IModal {
	content: HTMLElement | string;
	open(): void;
	close(): void;
}

export class Modal implements IModal {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	protected _pageWrapper: HTMLElement;

	constructor(protected container: HTMLElement, protected pageWrapper: HTMLElement
	) {
		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		this._content = ensureElement<HTMLElement>('.modal__content', container);
		this._pageWrapper = pageWrapper;

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (evt) => evt.stopPropagation());
	}

	set content(value: HTMLElement | string) {
		this._content.replaceChildren(value);
	}

	open(): void {
		this.container.classList.add('modal_active');
		this._pageWrapper.classList.add('page__wrapper_locked');
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this._pageWrapper.classList.remove('page__wrapper_locked');
		this.content = '';
	}
}
