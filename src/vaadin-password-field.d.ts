/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   src/vaadin-password-field.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.

import {TextFieldElement} from './vaadin-text-field.js';

import {DomModule} from '@polymer/polymer/lib/elements/dom-module.js';

import {html} from '@polymer/polymer/lib/utils/html-tag.js';

/**
 * `<vaadin-password-field>` is a Web Component for password field control in forms.
 *
 * ```html
 * <vaadin-password-field label="Password">
 * </vaadin-password-field>
 * ```
 *
 * ### Styling
 *
 * See vaadin-text-field.html for the styling documentation
 *
 * In addition to vaadin-text-field parts, here's the list of vaadin-password-field specific parts
 *
 * Part name       | Description
 * ----------------|----------------------------------------------------
 * `reveal-button` | The eye icon which toggles the password visibility
 *
 * In addition to vaadin-text-field state attributes, here's the list of vaadin-password-field specific attributes
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `password-visible` | Set when the password is visible | :host
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 */
declare class PasswordFieldElement extends TextFieldElement {

  /**
   * Set to true to hide the eye icon which toggles the password visibility.
   * @attr {boolean} reveal-button-hidden
   */
  revealButtonHidden: boolean;

  /**
   * True if the password is visible ([type=text]).
   * @attr {boolean} password-visible
   */
  readonly passwordVisible: boolean;
  ready(): void;
  _onChange(e: Event): void;
}

declare global {

  interface HTMLElementTagNameMap {
    "vaadin-password-field": PasswordFieldElement;
  }
}

export {PasswordFieldElement};