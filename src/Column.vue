<script>
    export default {
        props: {
            label: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            filterable: {
                type: Boolean,
                required: false,
                default: true
            },
            sortable: {
                type: Boolean,
                required: false,
                default: true
            }
        },
        render: () => {
            return '';
        },
        computed: {
           column() {
               let actionsType = this.name === 'actions';

               return {
                   label: this.label,
                   name: this.name,
                   filterable: !actionsType ? this.filterable : false,
                   sortable: !actionsType ? this.sortable : false
               }
           }
        },
        created() {
            this.$store.dispatch('ADD_COLUMN', this.column);
        }
    }
</script>