<template>
    <div>
        <table>
            <slot name="columns"></slot>

            <tr class="headings">
                <th v-for="column in columns"
                    :class="{
                    'sortable': column.sortable,
                    'desc': sortCol === column.name && sortOrder === 'desc',
                    'asc': sortCol === column.name && sortOrder === 'asc',
                    }"
                    v-on="column.sortable ? {click: () => sortBy(column.name)} : {} ">

                    {{column.label}}
                </th>
            </tr>

            <tr class="filter">
                <th v-for="column in columns">
                    <div v-if="column.filterable">

                        <slot :name="'filter-' + column.name" v-bind="{filters, col: column.name}">
                            <input type="text" class="form-control" v-model="filters[column.name]">
                        </slot>

                    </div>
                </th>
            </tr>

            <tr v-for="datum in data">

                <td v-for="column in columns"
                    v-if="column.name !== 'actions'"
                    :set="val = resolveValue(datum, column.name)">

                    <slot :name="'value-' + column.name"
                          v-bind:value="val">

                        <slot name="value" v-bind:value="val">{{ val }}</slot>

                    </slot>
                </td>

                <td v-else>
                    <slot name="actions" v-bind:row="datum"></slot>
                </td>
            </tr>

            <tr v-show="Object.keys(data).length === 0">
                <td class="not-found" :colspan="columns.length">No results found</td>
            </tr>
        </table>

        <ajax-table-paginator :display-amount="displayPages"></ajax-table-paginator>
    </div>
</template>

<script>
    import store from './store';
    import AjaxTablePaginator from './pagination/AjaxTablePaginator.vue'

    import _ from 'lodash';

    export default {
        name: 'ajax-table',
        store,
        components: {
            AjaxTablePaginator
        },
        props: {
            uri: {
                type: String,
                required: true
            },
            displayPages: {
                type: Number,
                required: false,
                default: 6
            }
        },
        data() {
            return {
                filters: {},
                sortCol: '',
                sortOrder: '',
            };
        },
        methods: {
            filtersInit() {
                let result = {};

                this.columns.forEach(function (column) {
                    if (column.filterable) {
                        result[column.name] = '';
                    }
                });

                this.filters = result;
            },
            checkConfigColumns() {
                if (!this.$slots.columns)
                    console.error("AjaxTableComponent requires content be provided in the columns slot.")
            },
            sortBy(col) {
                this.sortCol = col;

                if (this.sortCol === col) {
                    this.sortOrder = this.sortOrder !== 'desc' ? 'desc' : 'asc';
                } else {
                    this.sortOrder = 'desc';
                }
            },
            dispatchSort() {
                this.$store.dispatch('SORT', {col: this.sortCol, order: this.sortOrder})
            },
            resolveValue(obj, accessor) {
                let objKey = accessor.split('.');
                let result = obj;

                objKey.forEach(function (item) {
                    result = result[item];
                });

                return result;
            }
        },
        watch: {
            filters: {
                handler:_.debounce(function () {
                    this.$store.dispatch('FILTER', this.filters);
                }, 100),
                deep: true
            },
            sortCol() {
                this.dispatchSort();
            },
            sortOrder() {
                this.dispatchSort();
            }
        },
        computed: {
            columns() {
                return this.$store.getters.COLUMNS;
            },
            data() {
                return this.$store.getters.DATA;
            },
            pagesAmount() {
                return this.$store.getters.PAGES;
            },
        },
        created() {
            this.$store.commit('SET_URI', this.uri);

            this.filtersInit();
        },
        mounted() {
            this.checkConfigColumns();

            this.$store.dispatch('FETCH_DATA');
        }
    }
</script>

<style lang="scss" scoped>
    table {
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;

        & td {
            min-height: 50px;
            max-height: 50px;
            max-width: 175px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &.not-found {
                text-align: center;
                font-size: 14px;
            }
        }

        & td, & th {
            border: 1px solid #ddd;
            padding: 13px;
            border-left: none;
            border-right: none;
        }

        & th {
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: left;
        }

        & tr {
            background: rgb(255, 255, 255);

            &.headings {
                & th.sortable {
                    font-weight: 600;
                    vertical-align: bottom;
                    border-bottom: 2px solid #eeeeee;
                    background-image: url("assets/images/sort_both.png");
                    background-repeat: no-repeat;
                    background-position: right;

                    &:hover {
                        cursor: pointer;
                    }

                    &.desc {
                        background-image: url("assets/images/sort_desc.png");
                    }
                    &.asc {
                        background-image: url("assets/images/sort_asc.png");
                    }
                }
            }

            &:nth-child(even) {
                background-color: #f7f7f7;
            }

            &:not([class]):hover {
                background-color: #f1f1f1;
            }
        }
    }
</style>