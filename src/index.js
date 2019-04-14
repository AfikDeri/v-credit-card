import CreditCard from "./CreditCard.vue";

export default {
    install(Vue) {
        Vue.component('v-credit-card', CreditCard);
    }
};

export {CreditCard};
