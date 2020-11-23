import {NumberFieldElement} from './vaadin-number-field.js';

/**
 * `<vaadin-integer-field>` is a Web Component for integer field control in forms.
 *
 * ```html
 * <vaadin-integer-field label="Number">
 * </vaadin-integer-field>
 * ```
 */
declare class IntegerFieldElement extends NumberFieldElement {
  ready(): void;
  _valueChanged(newVal: unknown|null, oldVal: unknown|null): void;
  _stepChanged(newVal: number, oldVal: number|undefined): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "vaadin-integer-field": IntegerFieldElement;
  }
}

export {IntegerFieldElement};
