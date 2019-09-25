<template>
    <div class="paginator-wrapper">
        <div class="paginator">
            <ajax-table-button :disabled="hasPrevPage" :value="currentPage - 1">Previous</ajax-table-button>

            <ajax-table-button v-for="(page, index) in pages"
                               :key="index"
                               :value="page"
                               :selected="page === currentPage">
            </ajax-table-button>

            <ajax-table-button :disabled="hasNextPage" :value="currentPage + 1">Next</ajax-table-button>
        </div>
    </div>
</template>

<script>
    import AjaxTableButton from './AjaxTableButton';

    export default {
        props: {
            displayAmount: {
                type: Number,
                required: true
            }
        },
        name: 'ajax-table-paginator',
        components: {
            AjaxTableButton
        },
        computed: {
            currentPage() {
                return this.$store.getters.CURRENT_PAGE;
            },
            pagesAmount() {
               return this.$store.getters.PAGES
            },
            pages() {
                let current = this.currentPage;
                let displayAmount = this.displayAmount;
                let pagesAmount = this.pagesAmount;

                let pages = [];

                for (let i = 1; i <= pagesAmount; i++) {
                    pages.push(i);
                }

                if (pagesAmount > displayAmount) {
                    pages = pages.filter(function (value) {
                        let leftMax = current - displayAmount / 2;

                        let rightMax = current + displayAmount / 2;

                        let leftMaxLast = pagesAmount - displayAmount;

                        if (current >= leftMaxLast) {
                            return value >= leftMaxLast;
                        }

                        if (current >= displayAmount) {
                            return value >= leftMax && value <= rightMax
                        }

                        return value <= displayAmount;
                    });
                }

                return pages;
            },
            hasPrevPage() {
                return this.currentPage <= 1;
            },
            hasNextPage() {
                return this.currentPage >= this.pagesAmount;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .paginator-wrapper {
        display:flex;
        justify-content: flex-end;
        padding: 10px 5px;

        & .paginator {
            display: flex;
        }
    }

</style>