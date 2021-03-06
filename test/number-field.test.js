import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, aTimeout } from '@open-wc/testing-helpers';
import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import '../vaadin-number-field.js';

describe('number-field', () => {
  var numberField, input, decreaseButton, increaseButton;

  function up() {
    keyDownOn(input, 38, [], 'ArrowUp');
  }

  function down() {
    keyDownOn(input, 40, [], 'ArrowDown');
  }

  beforeEach(() => {
    numberField = fixtureSync('<vaadin-number-field></vaadin-number-field>');
    input = numberField.inputElement;
    decreaseButton = numberField.shadowRoot.querySelector('[part=decrease-button]');
    increaseButton = numberField.shadowRoot.querySelector('[part=increase-button]');
  });

  describe('properties', () => {
    ['min', 'max', 'step'].forEach((prop) => {
      it(`should reflect "${prop}" property to attribute`, () => {
        var value = 5;
        numberField[prop] = value;
        expect(numberField.getAttribute(prop)).to.be.equal(String(value));
      });
    });

    it('should not throw with autoselect', async () => {
      numberField.autoselect = true;
      numberField.focus();
      await aTimeout();
    });
  });

  describe('native', () => {
    it('should have [type=number]', () => {
      expect(input.type).to.equal('number');
    });

    it('should have hidden controls', () => {
      expect(decreaseButton.hidden).to.be.true;
      expect(increaseButton.hidden).to.be.true;
    });

    ['min', 'max'].forEach(function (attr) {
      it('should set numeric attribute ' + attr, () => {
        const value = 5;
        numberField[attr] = value;
        expect(input.getAttribute(attr)).to.be.equal(String(value));
      });
    });

    it('should set value with correct decimal places regardless of step', () => {
      numberField.step = 2;
      numberField.value = 9.99;

      expect(numberField.value).equal('9.99');
    });

    it('should increment value to next multiple of step offset by the min', () => {
      numberField.step = 3;
      numberField.min = 4;
      numberField.value = 4;

      increaseButton.click();

      expect(numberField.value).equal('7');
    });

    it('should increment value on arrow up', () => {
      numberField.step = 3;

      up();

      expect(numberField.value).equal('3');
    });

    it('should decrement value on arrow down', () => {
      numberField.step = 3;

      down();

      expect(numberField.value).equal('-3');
    });

    it('should not change value on arrow keys when readonly', () => {
      numberField.readonly = true;
      numberField.value = 0;

      up();
      expect(numberField.value).to.be.equal('0');

      down();
      expect(numberField.value).to.be.equal('0');
    });
  });

  describe('value control buttons', () => {
    it('should have value controls when hasControls is set to true', () => {
      expect(decreaseButton.hidden).to.be.true;
      expect(increaseButton.hidden).to.be.true;

      numberField.hasControls = true;

      expect(decreaseButton.hidden).to.be.false;
      expect(increaseButton.hidden).to.be.false;
    });

    it('should increase value by 1 when increaseButton is clicked', () => {
      numberField.value = 0;

      increaseButton.click();

      expect(numberField.value).to.be.equal('1');
    });

    it('should dispatch change event when a button is clicked', () => {
      const changeSpy = sinon.spy();
      numberField.addEventListener('change', changeSpy);

      increaseButton.click();
      expect(changeSpy.callCount).to.equal(1);
      decreaseButton.click();
      expect(changeSpy.callCount).to.equal(2);
    });

    it('should dispatch single value-changed event when button is clicked', () => {
      const spy = sinon.spy();
      numberField.addEventListener('value-changed', spy);

      increaseButton.click();
      expect(spy.callCount).to.equal(1);
      decreaseButton.click();
      expect(spy.callCount).to.equal(2);
    });

    it('should not focus input when a button is clicked', () => {
      let hasFocus = false;
      input.focus = () => {
        hasFocus = true;
      };

      increaseButton.click();
      expect(hasFocus).to.be.false;
    });

    it('should increase value by 0.2 when step is 0.2 and increaseButton is clicked', () => {
      numberField.step = 0.2;
      numberField.value = 0.6;

      increaseButton.click();

      expect(numberField.value).to.be.equal('0.8');
    });

    it('should adjust value to exact step when increaseButton is clicked', () => {
      numberField.step = 0.2;
      numberField.value = 0.5;

      increaseButton.click();

      expect(numberField.value).to.be.equal('0.6');
    });

    it('should decrease value by 1 when decreaseButton is clicked', () => {
      numberField.value = 0;

      decreaseButton.click();

      expect(numberField.value).to.be.equal('-1');
    });

    it('should decrease value by 0.2 when decreaseButton is clicked', () => {
      numberField.value = 0;
      numberField.step = 0.2;

      decreaseButton.click();

      expect(numberField.value).to.be.equal('-0.2');
    });

    it('should adjust value to exact step when decreaseButton is clicked', () => {
      numberField.value = 7;
      numberField.step = 2;

      decreaseButton.click();

      expect(numberField.value).to.be.equal('6');
    });

    it('should adjust decimals based on the step value when control button is pressed', () => {
      numberField.value = 1;
      numberField.step = 0.001;

      increaseButton.click();
      expect(numberField.value).to.be.equal('1.001');
    });

    it('should adjust decimals based on the min value when control button is pressed', () => {
      numberField.value = 1;
      numberField.step = 0.001;
      numberField.min = 0.0001;

      increaseButton.click();
      expect(numberField.value).to.be.equal('1.0001');
    });

    it('should not increase value when increaseButton is clicked and max value is reached', () => {
      numberField.value = 0;
      numberField.max = 0;

      increaseButton.click();

      expect(numberField.value).to.be.equal('0');
    });

    it('should not decrease value when decreaseButton is clicked and min value is reached', () => {
      numberField.value = 0;
      numberField.min = 0;

      decreaseButton.click();

      expect(numberField.value).to.be.equal('0');
    });

    it('should not disable buttons if there are no limits set', () => {
      expect(decreaseButton.hasAttribute('disabled')).to.be.false;
      expect(increaseButton.hasAttribute('disabled')).to.be.false;
    });

    it('should disable plus button if max value is reached', () => {
      numberField.value = 0;
      numberField.min = 0;
      expect(decreaseButton.hasAttribute('disabled')).to.be.true;
      expect(increaseButton.hasAttribute('disabled')).to.be.false;
    });

    it('should disable minus button if min value is reached', () => {
      numberField.value = 1;
      numberField.max = 1;
      expect(decreaseButton.hasAttribute('disabled')).to.be.false;
      expect(increaseButton.hasAttribute('disabled')).to.be.true;
    });

    it('should not change value when number field is disabled and controls are clicked', () => {
      numberField.disabled = true;
      numberField.value = 0;

      increaseButton.click();
      expect(numberField.value).to.be.equal('0');

      decreaseButton.click();
      expect(numberField.value).to.be.equal('0');
    });

    it('should not change value when min limit is reached and minus button is clicked', () => {
      numberField.min = -1;
      numberField.value = 0;

      for (var i = 0; i < 5; i++) {
        decreaseButton.click();
        expect(decreaseButton.hasAttribute('disabled')).to.be.true;
        expect(numberField.value).to.be.equal('-1');
      }
    });

    it('should not change value when max limit is reached and plus button is clicked', () => {
      numberField.max = 1;
      numberField.value = 0;

      for (var i = 0; i < 5; i++) {
        increaseButton.click();
        expect(increaseButton.hasAttribute('disabled')).to.be.true;
        expect(numberField.value).to.be.equal('1');
      }
    });

    it('should not change value when max limit will be reached with the next step and plus button is clicked', () => {
      numberField.min = -10;
      numberField.max = 10;
      numberField.step = 6;
      numberField.value = 2;

      for (var i = 0; i < 5; i++) {
        increaseButton.click();
        expect(increaseButton.hasAttribute('disabled')).to.be.true;
        expect(numberField.value).to.be.equal('8');
      }
    });

    it('should prevent touchend event on value control buttons', () => {
      numberField.value = 0;
      let e = new CustomEvent('touchend', { cancelable: true });
      increaseButton.dispatchEvent(e);
      expect(e.defaultPrevented).to.be.true;
      expect(numberField.value).to.equal('1');

      e = new CustomEvent('touchend', { cancelable: true });
      decreaseButton.dispatchEvent(e);
      expect(e.defaultPrevented).to.be.true;
      expect(numberField.value).to.equal('0');
    });

    it('should decrease value to max value when value is over max and decreaseButton is clicked', () => {
      numberField.value = 50;
      numberField.max = 10;

      decreaseButton.click();

      expect(numberField.value).to.be.equal(String(numberField.max));
    });

    it('should decrease value to the closest step value when decreaseButton is clicked', () => {
      numberField.min = -17;
      numberField.value = -8;
      numberField.step = 4;

      decreaseButton.click();

      expect(numberField.value).to.be.equal('-9');
    });

    it('should correctly decrease value when decreaseButton is clicked', () => {
      numberField.min = -20;
      numberField.value = -1;
      numberField.step = 4;

      const correctSteps = [-4, -8, -12, -16, -20];
      for (var i = 0; i < correctSteps.length; i++) {
        decreaseButton.click();
        expect(numberField.value).to.be.equal(String(correctSteps[i]));
      }
    });

    it('should increase value to min value when value is under min and increaseButton is clicked', () => {
      numberField.value = -40;
      numberField.min = -10;

      increaseButton.click();

      expect(numberField.value).to.be.equal(String(numberField.min));
    });

    it('should increase value to the closest step value when increaseButton is clicked', () => {
      numberField.min = -17;
      numberField.value = -8;
      numberField.step = 4;

      increaseButton.click();

      expect(numberField.value).to.be.equal('-5');
    });

    it('should correctly increase value when increaseButton is clicked', () => {
      numberField.min = -3;
      numberField.max = 18;
      numberField.value = -1;
      numberField.step = 4;

      const correctSteps = [1, 5, 9, 13, 17];
      for (var i = 0; i < correctSteps.length; i++) {
        increaseButton.click();
        expect(numberField.value).to.be.equal(String(correctSteps[i]));
      }
    });

    it('should correctly increase value when step is a decimal number and increaseButton is clicked', () => {
      numberField.min = -0.02;
      numberField.max = 0.02;
      numberField.value = -0.03;
      numberField.step = 0.01;

      const correctSteps = [-0.02, -0.01, 0, 0.01, 0.02];
      for (var i = 0; i < correctSteps.length; i++) {
        increaseButton.click();
        expect(numberField.value).to.be.equal(String(correctSteps[i]));
      }
    });

    it('should correctly calculate the precision with decimal value', () => {
      numberField.value = 5.1;
      numberField.step = 0.01;

      increaseButton.click();
      expect(numberField.value).to.be.equal('5.11');
    });

    describe('problematic values', () => {
      it('should correctly increase value', () => {
        const configs = [
          { props: { step: 0.001, value: 1.001 }, expectedValue: '1.002' },
          { props: { step: 0.001, value: 1.003 }, expectedValue: '1.004' },
          { props: { step: 0.001, value: 1.005 }, expectedValue: '1.006' },
          { props: { step: 0.001, value: 2.002 }, expectedValue: '2.003' },
          { props: { step: 0.001, value: 4.004 }, expectedValue: '4.005' },
          { props: { step: 0.001, value: 8.008 }, expectedValue: '8.009' },
          { props: { step: 0.01, value: 16.08 }, expectedValue: '16.09' },
          { props: { step: 0.01, value: 73.1 }, expectedValue: '73.11' },
          { props: { step: 0.001, value: 1.0131, min: 0.0001 }, expectedValue: '1.0141' }
        ];
        const reset = { step: 1, min: undefined, max: undefined, value: '' };

        for (let i = 0; i < configs.length; i++) {
          const { props, expectedValue } = configs[i];
          Object.assign(numberField, reset, props);
          increaseButton.click();
          expect(numberField.value).to.be.equal(expectedValue);
        }
      });

      it('should correctly decrease value', () => {
        const configs = [
          { props: { step: 0.01, value: 72.9 }, expectedValue: '72.89' },
          { props: { step: 0.001, min: 0.0001, value: 1.0031 }, expectedValue: '1.0021' },
          { props: { step: 0.001, min: 0.0001, value: 1.0051 }, expectedValue: '1.0041' },
          { props: { step: 0.001, min: 0.0001, value: 1.0071 }, expectedValue: '1.0061' },
          { props: { step: 0.001, min: 0.0001, value: 1.0091 }, expectedValue: '1.0081' }
        ];
        const reset = { step: 1, min: undefined, max: undefined, value: '' };

        for (let i = 0; i < configs.length; i++) {
          const { props, expectedValue } = configs[i];
          Object.assign(numberField, reset, props);
          decreaseButton.click();
          expect(numberField.value).to.be.equal(expectedValue);
        }
      });
    });
  });

  describe('no initial value', () => {
    describe('min is defined and max is undefined', () => {
      it('should set value to the first step value above zero when min is below zero and increaseButton is clicked', () => {
        numberField.min = -19;
        numberField.step = 6;

        increaseButton.click();

        expect(numberField.value).to.be.equal('5');
      });

      it('should set value to the first step value above zero when min is zero and increaseButton is clicked', () => {
        numberField.min = 0;
        numberField.step = 6;

        increaseButton.click();

        expect(numberField.value).to.be.equal('6');
      });

      it('should set value to the first step value below zero when min is below zero and decreaseButton is clicked', () => {
        numberField.min = -19;
        numberField.step = 6;

        decreaseButton.click();

        expect(numberField.value).to.be.equal('-1');
      });

      it('should set value to min when min is above zero and increaseButton is clicked', () => {
        numberField.min = 19;
        numberField.step = 6;

        increaseButton.click();

        expect(numberField.value).to.be.equal('19');
      });

      it('should set value to min when min is above zero and decreaseButton is clicked', () => {
        numberField.min = 19;
        numberField.step = 6;

        decreaseButton.click();

        expect(numberField.value).to.be.equal('19');
      });

      it('should set value to 0 when min is zero and decreaseButton is clicked', () => {
        numberField.min = 0;
        numberField.step = 6;

        decreaseButton.click();

        expect(numberField.value).to.be.equal('0');
      });
    });

    describe('max is defined and min is undefined', () => {
      it('should set value to the closest to the max value when max is below zero and increaseButton is clicked', () => {
        // -19 cannot be equally divided by 6
        // The closest is -24, cause with the next stepUp it will become -18
        numberField.max = -19;
        numberField.step = 6;

        increaseButton.click();

        expect(numberField.value).to.be.equal('-24');

        // Check with max that can be equally divided
        numberField.value = '';
        numberField.max = -18;
        numberField.step = 6;

        increaseButton.click();

        expect(numberField.value).to.be.equal('-18');
      });

      it('should set value to max when max is below zero and decreaseButton is clicked', () => {
        numberField.max = -19;
        numberField.step = 6;

        decreaseButton.click();

        expect(numberField.value).to.be.equal('-19');
      });

      it('should set value to 0 when max is zero and increaseButton is clicked', () => {
        numberField.max = 0;
        numberField.step = 6;

        increaseButton.click();

        expect(numberField.value).to.be.equal('0');
      });

      it('should set value to the first step value above zero when max is above zero and increaseButton is clicked', () => {
        numberField.max = 19;
        numberField.step = 6;

        increaseButton.click();

        expect(numberField.value).to.be.equal('6');
      });

      it('should set value to the first step value below zero when max is above zero and decreaseButton is clicked', () => {
        numberField.max = 19;
        numberField.step = 6;

        decreaseButton.click();

        expect(numberField.value).to.be.equal('-6');
      });

      it('should set value to the first step value below zero when max is above zero and decreaseButton is clicked', () => {
        numberField.max = 0;
        numberField.step = 6;

        decreaseButton.click();

        expect(numberField.value).to.be.equal('-6');
      });
    });

    describe('min and max values are defined', () => {
      it('should set value to the closest to the max when min is below zero and max is below zero and increaseButton is clicked', () => {
        numberField.min = -20;
        numberField.max = -3;
        numberField.step = 6;

        increaseButton.click();

        expect(numberField.value).to.be.equal('-8');

        // Check with max that can be equally divided
        numberField.value = '';
        numberField.min = -24;
        numberField.step = 6;

        increaseButton.click();

        expect(numberField.value).to.be.equal('-6');
      });

      it('should set value to 0 when max is zero, min is zero and decreaseButton or increaseButton is clicked', () => {
        numberField.min = 0;
        numberField.max = 0;
        numberField.step = 6;

        decreaseButton.click();
        expect(numberField.value).to.be.equal('0');

        increaseButton.click();
        expect(numberField.value).to.be.equal('0');
      });

      it('should set value to min when min is above zero and max is above zero and increaseButton is clicked', () => {
        numberField.min = 3;
        numberField.max = 19;
        numberField.step = 6;

        increaseButton.click();

        expect(numberField.value).to.be.equal('3');
      });

      it('should set value to min when min is above zero and max is below zero and increaseButton is clicked', () => {
        numberField.min = 19;
        numberField.max = -3;
        numberField.step = 6;

        increaseButton.click();

        expect(numberField.value).to.be.equal('19');
      });

      it(`should set value to the first step value above zero when min is below zero
          and max is above zero and increaseButton is clicked`, () => {
        numberField.min = -19;
        numberField.max = 19;
        numberField.step = 6;

        increaseButton.click();

        expect(numberField.value).to.be.equal('5');
      });

      it('should set value to max when min is below zero and max is below zero and decreaseButton is clicked', () => {
        numberField.min = -19;
        numberField.max = -3;
        numberField.step = 6;

        decreaseButton.click();

        expect(numberField.value).to.be.equal('-3');
      });

      it('should set value to min when min is above zero and max is above zero and decreaseButton is clicked', () => {
        numberField.min = 3;
        numberField.max = 19;
        numberField.step = 6;

        decreaseButton.click();

        expect(numberField.value).to.be.equal('3');
      });

      it('should set value to max when min is above zero and max is below zero and decreaseButton is clicked', () => {
        numberField.min = 19;
        numberField.max = -3;
        numberField.step = 6;

        decreaseButton.click();

        expect(numberField.value).to.be.equal('-3');
      });

      it(`should set value to the first step value below zero when min is below zero and max
          is above zero and decreaseButton is clicked`, () => {
        numberField.min = -19;
        numberField.max = 19;
        numberField.step = 6;

        decreaseButton.click();

        expect(numberField.value).to.be.equal('-1');
      });
    });

    describe('min and max values are undefined', () => {
      it('should set value to the first step value above zero when decreaseButton is clicked', () => {
        numberField.step = 6;

        increaseButton.click();

        expect(numberField.value).to.be.equal('6');
      });

      it('should set value to the first step value below zero when decreaseButton is clicked', () => {
        numberField.step = 6;

        decreaseButton.click();

        expect(numberField.value).to.be.equal('-6');
      });
    });
  });

  describe('input validation', () => {
    it('should be valid with numeric values', () => {
      expect(numberField.validate()).to.be.true;

      numberField.value = '1';
      expect(numberField.inputElement.value).to.be.equal('1');
      expect(numberField.validate()).to.be.true;
    });

    it('should prevent setting non-numeric values', () => {
      numberField.value = 'foo';
      expect(numberField.value).to.be.empty;
      expect(numberField.validate()).to.be.true;
    });

    it('should align checkValidity with the native input element', () => {
      numberField.value = -1;
      numberField.min = 0;

      expect(numberField.checkValidity()).to.equal(numberField.inputElement.checkValidity());
    });

    it('should not validate when explicitly set to invalid', () => {
      numberField.invalid = true;

      expect(numberField.value).to.be.empty;
      expect(numberField.validate()).to.be.false;

      expect(numberField.invalid).to.be.true;
    });

    it('should validate when inherited validation constraint is provided and explicitly set to invalid', () => {
      numberField.invalid = true;
      numberField.maxlength = 5;

      expect(numberField.value).to.be.empty;
      expect(numberField.validate()).to.be.true;

      expect(numberField.invalid).to.be.false;
    });

    it('should allow setting decimals', () => {
      numberField.value = 7.6;
      expect(numberField.value).to.be.equal('7.6');
    });

    it('should not prevent invalid values applied programmatically (step)', () => {
      numberField.step = 0.1;
      numberField.value = 7.686;
      expect(numberField.value).to.be.equal('7.686');
    });

    it('should not prevent invalid values applied programmatically (min)', () => {
      numberField.min = 2;
      numberField.value = 1;
      expect(numberField.value).to.be.equal('1');
    });

    it('should not prevent invalid values applied programmatically (max)', () => {
      numberField.max = 2;
      numberField.value = 3;
      expect(numberField.value).to.be.equal('3');
    });

    it('should validate when setting limits', () => {
      numberField.min = 2;
      numberField.max = 4;

      numberField.value = '';
      expect(numberField.validate(), 'empty value is allowed because not required').to.be.true;

      numberField.value = '3';
      expect(numberField.validate(), 'valid value should be in the range').to.be.true;

      numberField.value = '1';
      expect(numberField.validate(), 'value should not be below min').to.be.false;

      numberField.value = '3';
      expect(numberField.validate(), 'invalid status should be reset when setting valid value').to.be.true;

      numberField.value = '5';
      expect(numberField.validate(), 'value should not be greater than max').to.be.false;
    });

    it('should validate by step when defined by user', () => {
      numberField.step = 1.5;

      [-6, -1.5, 0, 1.5, 4.5].forEach((validValue) => {
        numberField.value = validValue;
        expect(numberField.validate()).to.be.true;
      });

      [-3.5, -1, 2, 2.5].forEach((invalidValue) => {
        numberField.value = invalidValue;
        expect(numberField.validate()).to.be.false;
      });
    });

    it('should use min as step basis in validation when both are defined', () => {
      numberField.min = 1;
      numberField.step = 1.5;

      [1, 2.5, 4, 5.5].forEach((validValue) => {
        numberField.value = validValue;
        expect(numberField.validate()).to.be.true;
      });

      [1.5, 3, 5].forEach((invalidValue) => {
        numberField.value = invalidValue;
        expect(numberField.validate()).to.be.false;
      });
    });

    it('should not validate by step when only min and max are set', () => {
      numberField.min = 1;
      numberField.max = 5;
      numberField.value = 1.5; // would be invalid by default step=1
      expect(numberField.validate()).to.be.true;
    });

    describe('removing validation constraints', () => {
      it('should update "invalid" state when "min" is removed', () => {
        numberField.value = '42';
        numberField.min = 50;
        numberField.validate();
        expect(numberField.invalid).to.be.true;

        numberField.min = '';
        expect(numberField.invalid).to.be.false;
      });

      it('should update "invalid" state when "max" is removed', () => {
        numberField.value = '42';
        numberField.max = 20;
        numberField.validate();
        expect(numberField.invalid).to.be.true;

        numberField.max = '';
        expect(numberField.invalid).to.be.false;
      });

      it('should update "invalid" state when "step" is removed', () => {
        numberField.value = '3';
        numberField.min = 0;
        numberField.step = 2;
        numberField.validate();
        expect(numberField.invalid).to.be.true;

        numberField.step = '';
        expect(numberField.invalid).to.be.false;
      });

      it('should not set "invalid" to false when "min" is set to 0', () => {
        numberField.value = '-5';
        numberField.min = -1;
        numberField.validate();
        expect(numberField.invalid).to.be.true;

        numberField.min = 0;
        expect(numberField.invalid).to.be.true;
      });

      it('should not set "invalid" to false when "max" is set to 0', () => {
        numberField.value = '5';
        numberField.max = 1;
        numberField.validate();
        expect(numberField.invalid).to.be.true;

        numberField.max = 0;
        expect(numberField.invalid).to.be.true;
      });
    });
  });
});

describe('step attribute', () => {
  let numberField;

  beforeEach(() => {
    numberField = fixtureSync('<vaadin-number-field step="1.5"></vaadin-number-field>');
  });

  it('should validate by step when defined as attribute', () => {
    numberField.value = 1;
    expect(numberField.validate()).to.be.false;
    numberField.value = 1.5;
    expect(numberField.validate()).to.be.true;
  });
});

describe('default step attribute', () => {
  let numberField;

  beforeEach(() => {
    numberField = fixtureSync('<vaadin-number-field step="1"></vaadin-number-field>');
  });

  it('should validate by step when default value defined as attribute', () => {
    numberField.value = 1.5;
    expect(numberField.validate()).to.be.false;
    numberField.value = 1;
    expect(numberField.validate()).to.be.true;
  });
});
