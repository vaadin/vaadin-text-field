import {TextFieldElement} from './vaadin-text-field.js';

import {DomModule} from '@polymer/polymer/lib/elements/dom-module.js';

import {html} from '@polymer/polymer/lib/utils/html-tag.js';

/**
 * `<vaadin-email-field>` is a Web Component for email field control in forms.
 *
 * ```html
 * <vaadin-email-field label="Email">
 * </vaadin-email-field>
 * ```
 *
 * ### Styling
 *
 * See vaadin-text-field.html for the styling documentation
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 */
declare class EmailFieldElement extends TextFieldElement {
  ready(): void;
  _createConstraintsObserver(): void;
}

declare global {

  interface HTMLElementTagNameMap {
    "vaadin-email-field": EmailFieldElement;
  }
}

export {EmailFieldElement};
