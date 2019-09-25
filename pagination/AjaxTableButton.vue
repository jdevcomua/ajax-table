<template>
    <button @click.prevent="switchPage(value)"
            :disabled="disabled"
            :class="{'active': selected}">
        <slot>{{value}}</slot>
    </button>
</template>

<script>
    export default {
        props: {
            selected: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            value: {
                type: Number,
                required: true
            }
        },
        name: 'ajax-table-button',
        data() {
            return {
            }
        },
        methods: {
            switchPage(page) {
                this.$store.dispatch('SWITCH_PAGE', page);
            },
        },
    }
</script>

<style lang="scss" scoped>
    button {
        min-width: 42px;
        margin-left: -1px;
        padding: 5px 12px;
        line-height: 1.49;
        text-decoration: none;
        color: #4a89dc;
        background-color: #ffffff;
        border: 1px solid #dddddd;

        &:not(:disabled):not(.active):hover {
            color: #2363b6;
            background-color: #eeeeee;
            border-color: #dddddd;
        }
        &.active {
            z-index: 2;
            color: #ffffff;
            background-color: #4a89dc;
            border-color: #4a89dc;
            cursor: default;
        }

        &:disabled {
            color: #666666;
            cursor: not-allowed;
        }
    }
</style>