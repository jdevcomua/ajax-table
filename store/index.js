import Vue from 'vue';
import Vuex from 'vuex';
const axios = require('axios');

Vue.use(Vuex);


export const store = new Vuex.Store({
    state: {
        config: {
            uri: '',
            columns: []
        },
        uri: '',
        pages: 1,
        currentPage: 1,
        data: [],
        filter: {},
        sort: {}
    },
    getters: {
        URI: state => state.config.uri,
        COLUMNS: state => state.config.columns,
        DATA: state => state.data,
        SORT: state => state.sort,
        FILTER: state => state.filter,
        PAGES: state => state.pages,
        CURRENT_PAGE: state => state.currentPage,
    },
    mutations: {
        SET_URI: (state, data) => {
            state.config.uri = data;
        },
        SET_COLUMNS: (state, data) => {
            state.config.columns = data;
        },
        SET_DATA: (state, data) => {
            state.data = data;
        },
        SET_PAGES: (state, pages) => {
            state.pages = pages;
        },
        SET_CURRENT_PAGE: (state, currentPage) => {
            state.currentPage = currentPage;
        },
        SET_SORT: (state, sort) => {
            state.sort = sort
        },
        SET_FILTER: (state, filter) => {
            state.filter = filter
        }
    },
    actions: {
        ADD_COLUMN: async (context, column) => {
            let columns = context.getters.COLUMNS;

            columns.push(column);

            await context.commit('SET_COLUMNS', columns)
        },
        FETCH_DATA: async (context) => {
            let uri = context.getters.URI;

            let requestData = await axios.post(uri, {
                filter: context.getters.FILTER,
                sort: context.getters.SORT,
                page: context.getters.CURRENT_PAGE
            });

            let pagination = requestData.data.meta.pagination;

            context.commit('SET_PAGES', pagination.total_pages);

            delete requestData.data.meta;

            context.commit('SET_DATA', requestData.data);
        },

        FILTER: async (context, filters) => {
            let resultFilters = [];

            for (let index in filters) {

                if (filters[index] !== '') {
                    resultFilters.push({
                        col: index,
                        value: filters[index]
                    });
                }
            }

            context.commit('SET_FILTER', resultFilters);

            context.commit('SET_CURRENT_PAGE', 1);


            await context.dispatch('FETCH_DATA');
        },
        SORT: async (context, sort) => {
            context.commit('SET_SORT', sort);

            context.commit('SET_CURRENT_PAGE', 1);

            await context.dispatch('FETCH_DATA');
        },
        SWITCH_PAGE: async (context, page) => {
            context.commit('SET_CURRENT_PAGE', page);

            await context.dispatch('FETCH_DATA');
        }
    },
});

export default store;