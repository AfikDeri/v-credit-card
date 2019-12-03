<template>
    <div class="vue-credit-card" :class="className">
        <div class="card-form-and-image" :style="{flexDirection: direction}">
            <div class="credit-card-image" v-if="!noCard">
                <div class="creditcard" :class="{flipped}" @click="flipped = !flipped">
                    <Front :cardNumber="form.cardNumber"
                        :expiration="form.expiration"
                        :name="form.name"
                        :isTwoDigitsYear="isTwoDigitsYear"
                        :color="color">
                        <div slot="card-icon" id="ccsingle">
                            <component :is="cardInnerIcon"/>
                        </div>
                    </Front>
                    <Back :nameBack="form.name"
                        :security="form.security"
                        :color="color"/>
                </div>
            </div>
            <div class="credit-card-form">
                <div class="field">
                    <label for="name">{{ trans.name.label }}</label>
                    <input maxlength="20"
                        name="name"
                        id="name"
                        type="text"
                        :placeholder="trans.name.placeholder"
                        v-model="form.name"
                        @focus="flipped = false">
                </div>
                <div class="field">
                    <label for="card-number">{{ trans.card.label}}</label>
                    <input type="text"
                        name="card_number"
                        id="card-number"
                        ref="cardNumber"
                        pattern="[0-9 ]*"
                        inputmode="numeric"
                        :placeholder="trans.card.placeholder"
                        @focus="flipped = false">
                    <svg class="ccicon" width="750" height="471" viewBox="0 0 750 471" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <component :is="cardIcon"/>
                    </svg>
                </div>
                <div class="field-group">
                    <div class="field">
                        <label for="expirationdate">{{ trans.expiration.label}} (mm/{{isTwoDigitsYear ? 'yy' : 'yyyy'}})</label>
                        <input type="text"
                            name="expiration_date"
                            id="expirationdate"
                            pattern="[0-9\/]*"
                            ref="expiration"
                            :placeholder="isTwoDigitsYear ? 'MM/YY' : 'MM/YYYY'"
                            inputmode="numeric"
                            @focus="flipped = false">
                    </div>
                    <div class="field">
                        <label for="securitycode">{{ trans.security.label}}</label>
                        <input type="text"
                            name="security_code"
                            id="securitycode"
                            ref="security"
                            pattern="[0-9]*"
                            :placeholder="trans.security.placeholder"
                            inputmode="numeric"
                            @focus="flipped = true">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IMask from 'imask';
import cardTypes from './cardTypes';
import {cardMasks, expirationMask, securityMask} from './masks';
import {Front, Back} from './components/cards';
import * as InputIcons from './components/icons';
import * as CardIcons from './components/singles';

const formDefaults = {
    name: '',
    cardNumber: '',
    expiration: '',
    security: ''
};

const masksDefaults = {
    cardNumberMask: null,
    expirationDateMask: null,
    securityCodeMask: null
};

const defaultColor = 'grey';

const defaultTranslations = {
    name: {
        label: 'Name',
        placeholder: 'Full Name'
    },
    card: {
        label: 'Card Number',
        placeholder: 'Card Number'
    },
    expiration: {
        label: 'Expiration'
    },
    security: {
        label: 'Security Code',
        placeholder: 'Code'
    }
}

// Source reference: https://codepen.io/quinlo/pen/YONMEa
export default {
    props: {
        trans: {
            type: Object,
            default: () => (defaultTranslations)
        },
        direction: {
            type: String,
            default: 'column',
            validator(value) {
                return ['row', 'column'].includes(value)
            }
        },
        className: {
            type: String,
            default: ''
        },
        noCard: {
            type: Boolean,
            default: false
        },
        yearDigits: {
            type: Number,
            default: 2,
            validator(value) {
                return [2, 4].includes(value)
            }
        }
    },
    mounted() {
        this.defineMasks();
        this.setMasksListeners();
    },
    data() {
        return {
            flipped: false,
            cardIcon: null,
            cardInnerIcon: null,
            color: 'grey',
            masks: masksDefaults,
            form: formDefaults
        };
    },
    methods: {
        defineMasks() {
            //Mask the Credit Card Number Input
            this.cardNumberMask = new IMask(this.$refs.cardNumber, cardMasks);

            //Mask the Expiration Date
            this.expirationDateMask = new IMask(this.$refs.expiration, expirationMask(this.isTwoDigitsYear));

            //Mask the security code
            this.securityCodeMask = new IMask(this.$refs.security, securityMask);
        },
        setMasksListeners() {
            // Update expiration date field
            this.expirationDateMask.on('accept', () => this.form.expiration = this.expirationDateMask.value);

            // Update security code field
            this.securityCodeMask.on('accept', () => this.form.security = this.securityCodeMask.value);

            // Update card number field and card icon
            this.cardNumberMask.on('accept', () => {
                const cardName = this.cardNumberMask.masked.currentMask.cardtype;
                this.form.cardNumber = this.cardNumberMask.value;

                if (cardTypes.hasOwnProperty(cardName)) {
                    const card = cardTypes[cardName];

                    this.cardIcon = InputIcons[card.name];
                    this.cardInnerIcon = CardIcons[card.name];
                    this.setColor(card.color);
                    return;
                }

                this.resetCardDefaults();
            });
        },
        resetCardDefaults() {
            this.cardIcon = null;
            this.cardInnerIcon = null;
            this.setColor();
        },
        setColor(colorName) {
            this.color = colorName || defaultColor;
        }
    },
    computed: {
        isTwoDigitsYear() {
            return this.yearDigits === 2;
        },
        fields() {
            return [this.form.name, this.form.cardNumber, this.form.expiration, this.form.security].join('');
        }
    },
    watch: {
        fields() {
            this.$emit('change', Object.assign({}, this.$data.form));
        }
    },
    components: {
        Front,
        Back
    }
}
</script>

<style lang="scss">
.vue-credit-card {
    display: flex;
    align-items: stretch;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;

    .card-form-and-image {
        display: flex;
        align-items: center;
        justify-content: center;

        .credit-card-form {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: space-between;
            max-width: 400px;
            padding: 20px;
            color: #707070;

            .field-group {
                display: flex;

                .field:first-child {
                    margin-right: 10px;
                }
            }

            .field {
                position: relative;
                width: 100%;
                margin: 10px 0;

                label {
                    padding-bottom: 5px;
                    font-size: 13px;
                }

                input {
                    box-sizing: border-box;
                    margin-top: 3px;
                    padding: 15px;
                    font-size: 16px;
                    width: 100%;
                    border-radius: 3px;
                    border: 1px solid #dcdcdc;
                }
            }
        }
    }

    .ccicon {
        height: 38px;
        position: absolute;
        right: 6px;
        top: calc(50% - 9px);
        width: 60px;
    }

    .credit-card-image {
        width: 100%;
        max-width: 400px;
        max-height: 251px;
        height: 54vw;
        padding: 20px;
        perspective: 1000px;
    }

    #ccsingle {
        position: absolute;
        right: 15px;
        top: 20px;

        svg {
            width: 100px;
            max-height: 60px;
        }
    }

    .creditcard {
        width: 100%;
        max-width: 400px;
        transform-style: preserve-3d;
        transition: transform 0.6s;
        cursor: pointer;

        .front,
        .back {
            position: absolute;
            width: 100%;
            max-width: 400px;
            backface-visibility: hidden;
            color: #47525d;
        }

        .back {
            transform: rotateY(180deg);
        }

        &.flipped {
            transform: rotateY(180deg);
        }

        svg#cardfront,
        svg#cardback {
            width: 100%;
            box-shadow: 1px 5px 6px 0px black;
            border-radius: 22px;
        }

        .lightcolor,
        .darkcolor {
            transition: fill .5s;
        }

        .lightblue {
            fill: #03A9F4;
        }

        .lightbluedark {
            fill: #0288D1;
        }

        .red {
            fill: #ef5350;
        }

        .reddark {
            fill: #d32f2f;
        }

        .purple {
            fill: #ab47bc;
        }

        .purpledark {
            fill: #7b1fa2;
        }

        .cyan {
            fill: #26c6da;
        }

        .cyandark {
            fill: #0097a7;
        }

        .green {
            fill: #66bb6a;
        }

        .greendark {
            fill: #388e3c;
        }

        .lime {
            fill: #d4e157;
        }

        .limedark {
            fill: #afb42b;
        }

        .yellow {
            fill: #ffeb3b;
        }

        .yellowdark {
            fill: #f9a825;
        }

        .orange {
            fill: #ff9800;
        }

        .orangedark {
            fill: #ef6c00;
        }

        .grey {
            fill: #bdbdbd;
        }

        .greydark {
            fill: #616161;
        }
    }

    #svgname {
        text-transform: uppercase;
    }

    #cardfront {
        .st2 {
            fill: #FFFFFF;
        }

        .st3 {
            font-family: 'Source Code Pro', monospace;
            font-weight: 600;
        }

        .st4 {
            font-size: 54.7817px;
        }

        .st5 {
            font-family: 'Source Code Pro', monospace;
            font-weight: 400;
        }

        .st6 {
            font-size: 33.1112px;
        }

        .st7 {
            opacity: 0.6;
            fill: #FFFFFF;
        }

        .st8 {
            font-size: 24px;
        }

        .st9 {
            font-size: 36.5498px;
        }

        .st10 {
            font-family: 'Source Code Pro', monospace;
            font-weight: 300;
        }

        .st11 {
            font-size: 16.1716px;
        }

        .st12 {
            fill: #4C4C4C;
        }
    }

    #cardback {
        .st0 {
            fill: none;
            stroke: #0F0F0F;
            stroke-miterlimit: 10;
        }

        .st2 {
            fill: #111111;
        }

        .st3 {
            fill: #F2F2F2;
        }

        .st4 {
            fill: #D8D2DB;
        }

        .st5 {
            fill: #C4C4C4;
        }

        .st6 {
            font-family: 'Source Code Pro', monospace;
            font-weight: 400;
        }

        .st7 {
            font-size: 27px;
        }

        .st8 {
            opacity: 0.6;
        }

        .st9 {
            fill: #FFFFFF;
        }

        .st10 {
            font-size: 24px;
        }

        .st11 {
            fill: #EAEAEA;
        }

        .st12 {
            font-family: 'Rock Salt', cursive;
        }

        .st13 {
            font-size: 37.769px;
        }
    }
}
</style>
