## v-credit-card

Beautiful card form component for VueJS inspired by Adam Quinlan https://codepen.io/quinlo/pen/YONMEa

<img src="./card.gif">

#### Installation

```
npm install --save v-credit-card
```

#### usage

Register the component as a plugin and use it globally


```js
import Vue from 'vue';
import VCreditCard from 'v-credit-card';

Vue.component('v-credit-card', VCreditCard);

// usage
<v-credit-card/>
```

Or, import inside a component


```html
<template>
    <VCreditCard/>
</template>

<script>
import VCreditCard from 'v-credit-card';

export default {
    components: {
        VCreditCard
    }
}
</script>
```

#### Styles
You must import the CSS to get all the card styles
```js
import VCreditCard from 'v-credit-card';
import 'v-credit-card/dist/VCreditCard.css';
```

#### Available props

|  props     | required | options      | default    | explenation                                       |
|------------|----------|--------------|------------|---------------------------------------------------|
| direction  | no       | column, row  |    row     | Card and form side-by-side or top to bottom       |
| className  | no       | any string   |    none    | For any custom design, add your own wrapper class |
| yearDigits | no       | 2,4 (number) |    2       | construct the expiration year (YY or YYYY)        |
| noCard     | no       | true, false  |    false   | Show only the form without the credit card image  |

#### Events

You can listen for the `@change` event to get an object of all the form fields with their current values

```html
<template>
    <VCreditCard @change="creditInfoChanged"/>
</template>

<script>
import VCreditCard from 'v-credit-card';

export default {
    // ...
    methods: {
        creditInfoChanged(values) {
            console.log('Credit card fields', values); 
        }
    }
    // ...
}
</script>
```

## License

MIT © 2018-present
