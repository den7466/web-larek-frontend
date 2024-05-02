import { EventEmitter } from './events';
import { cloneTemplate, ensureElement, ensureAllElements } from '../../utils/utils';

export class Form extends EventEmitter {
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
    this.setValidate(this._inputs);
  }

  private isValid(inputs: HTMLInputElement[]): boolean {
    return inputs.every((input) => {
      return input.value.length > 0;
    });
  }

  private disableSubmit(disabled: boolean): void {
    if(disabled){
      this._buttonSubmit.setAttribute('disabled', 'disabled');
      this._errors.textContent = 'Пожалуйста, заполните все поля!';
    }else{
      this._buttonSubmit.removeAttribute('disabled');
      this._errors.textContent = '';
    }
  }

  private setValidate(inputs: HTMLInputElement[]): void {
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        if(!this.isValid(inputs))
          this.disableSubmit(true);
        else
          this.disableSubmit(false);
      });
    });
  }

  protected findInputByName(name: string): HTMLInputElement {
    return this._inputs.find((input) => {
      return input.name === name;
    });
  }
}