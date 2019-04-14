import Vue from 'vue';
import VCreditCard from "./CreditCard.vue";

export default {
    install(Vue) {
        Vue.component('v-credit-card', VCreditCard);
    }
};

export {VCreditCard};
