import { EventEmitter } from './events';
import { cloneTemplate, ensureElement, ensureAllElements } from '../../utils/utils';

export interface IForm {
  error: string;
  disableSubmit(disabled: boolean): void;
  clear(): void;
}

export class Form extends EventEmitter implements IForm {
  protected _container: HTMLElement;
  protected _inputs: HTMLInputElement[];
  protected _buttonSubmit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(protected template: HTMLTemplateElement, protected blockName: string) {
    super();
    this._container = cloneTemplate(template);
    this._inputs = ensureAllElements<HTMLInputElement>(`.${blockName}__input`, this._container);
    this._buttonSubmit = ensureElement<HTMLButtonElement>('.order__button', this._container);
    this._errors = ensureElement<HTMLElement>(`.${blockName}__errors`, this._container);
  }

  set error(value: string) {
    this._errors.textContent = value;
  }

  disableSubmit(disabled: boolean): void {
    if(disabled){
      this._buttonSubmit.setAttribute('disabled', 'disabled');
    }else{
      this._buttonSubmit.removeAttribute('disabled');
    }
  }

  protected findInputByName(name: string): HTMLInputElement {
    return this._inputs.find((input) => {
      return input.name === name;
    });
  }

  clear(): void {
    this._inputs.forEach((input) => {
      input.value = '';
    });
  }
}