const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="text-field-styles" theme-for="vaadin-text-field vaadin-text-area">
  <template>
    <style>
      :host(.hidden-caret) [part="value"] {
        font-size: 0;
        height: 24px;
      }
    </style>
  </template>
</dom-module><style>
  fieldset {
    display: inline-block;
  }
</style>`;

document.head.appendChild($_documentContainer.content);
