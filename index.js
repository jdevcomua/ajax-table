import AjaxTable from './src/AjaxTable';
import Column from './src/Column';
import ActionButton from './src/actions/ActionButton';

export default {
    install(Vue) {
        Vue.component('ajax-table', AjaxTable);
        Vue.component('column', Column);
    },
};

export { AjaxTable, Column, ActionButton };