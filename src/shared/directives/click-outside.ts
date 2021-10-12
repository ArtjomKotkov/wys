import {DirectiveBinding} from "vue";

export const clickOutside = {
    beforeMount: (el: any, binding: DirectiveBinding) => {
        el.clickOutsideEvent = (event: Event) => {
            if (!(el == event.target || el.contains(event.target))) {
                binding.value();
            }
        };
        document.addEventListener("click", el.clickOutsideEvent);
    },
    unmounted: (el: any) => {
        document.removeEventListener("click", el.clickOutsideEvent);
    },
};