
### Adding a label to `vaadin-input`

A `<label>` tag can be added before the `<input>`, and it can be shown based on the presence of a `input.label` property or `caption`.

### Positioning the label

Setting the `vaadin-input` display to `inline-flex` the user could modify the position of the label setting `flex-direction` to the container and `order` to the label. Obviously we need to have a mixin for the label `--vaadin-input-label`

```
<custom-style>
  <style>
    vaadin-input.bottom {
      flex-direction: column;

      --vaadin-input-label: {
        order: 2;
      };
    }
  </style>
</custom-style>

<vaadin-input label="Name" placeholder="Type your Name"></vaadin-input>
```

### Floating the label

When label floats, we hide the label while the placeholder is visible.

#### Reusing the native placeholder

Here we have different approaches, but all of them seems to need a bool property in `vaadin-input` to specify this behavior, I'm using the `floating` name for the property.

1. When `input.floating == true`, the label is hidden, the placeholder mirrors the label value, and when the input has a value, the label is shown.

```
<vaadin-input label="Name" floating></vaadin-input>

```
The user can customize the label via the `--vaadin-input-label` mixin

```
<custom-style>
  <style>
  vaadin-input#md {
    height: 40px;

    --vaadin-input: {
      height: 20px;
      align-self: flex-end;
    };

    --vaadin-input-label: {
      position: absolute;
      padding: 2px 0;
      color: lightskyblue;
    };
  }
 </style>
</custom-style>
<vaadin-input id="md" floating label="First Name"></vaadin-input>
```

2. If we want an animation, additionally to this approach we could move the placeholder to the label position when the input is focused. Hence we need a new mixin `--vaadin-input-placeholder-focus`

```
<custom-style>
  <style>
  vaadin-input#md {
    height: 40px;

    --vaadin-input: {
      height: 20px;
      align-self: flex-end;
    };

    --vaadin-input-label: {
      position: absolute;
    };

    --vaadin-input-placeholder-focus: {
      transition: all 0.3s ease-in-out;
      transform: translateY(-20px);
    };

  }
</style>
</custom-style>

<vaadin-input id="md" floating label="First Name"></vaadin-input>

###### Caveats
 - `::placeholder` is not standard yet, and we have to use prefix for all browsers
 - Animation is done of focus not when the user types
 - Polymer 2.0-preview seems to have problems when setting multiple prefixed selectors to the same block.
 - In FF seems that it's not possible to move the placeholder out from the input (translate does not work).


```

3- The `input.floating` property could be removed if the user in the theme hide/shows the label based on the `placeholder-shown` pseudo selector. Also he has to set both `label` and `placeholder` attributes declaratively. This is basically the same approach that is described at the end (Maintain label always attached).

```
<custom-style>
  <style>
  vaadin-input#md {
    height: 40px;

    --vaadin-input: {
      height: 20px;
      align-self: flex-end;
    };

    --vaadin-input-label: {
      position: absolute;
      padding: 2px 0;
      color: lightskyblue;
    };

    --vaadin-input-label-placeholder-shown: {
      display: none;
    }
  }
 </style>
</custom-style>
<vaadin-input id="md" label="First Name" placeholder="First Name"></vaadin-input>
```

###### Caveats
 - `::placeholder-shown` is not supported by Edge.


#### Emulate placeholder with label

Another option is that we don't configure `placeholder`

###### Caveats
 - Placeholder is not native
 - We need to handle events in the label


#### Maintain label always attached

When label is floating, it is always attached to the dom, then, the user can show/hide/move it depending on the input value or in the `input:placeholder-shown` selector

This is the more flexible approach, and can be implemented for all browsers

 ```
 <custom-style>
   <style>
   vaadin-input#md {
     height: 40px;

     --vaadin-input: {
       height: 20px;
       align-self: flex-end;
     };

     --vaadin-input-label: {
       position: absolute;
       transition: all 0.3s ease-in-out;
       transform: translateY(0px);
       z-index: auto;
     };

     --vaadin-input-label-placeholder-shown: {
       z-index: -1;
       transform: translateY(+20px);
     }
   }
 </style>
 </custom-style>

 <vaadin-input id="md" label="First Name" placeholder="First Name"></vaadin-input>
```

###### Caveats
 - User has to play with z-index if the initial position of the label covers the input
 - `:placeholder-shown` pseudo is not supported by Edge, we can use a computed attribute though
 - In order to use `input:placeholder-shown + label` it's necessary that label after input in dom. Possible fix set `order: 2` to `input`
