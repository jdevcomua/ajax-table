# ajax-table-vue

> Vue module for asynchronous data management
---

## Getting started

### Install the package

To install this package, simply install `ajax-table-vue` with your favorite package manager:

```sh
# Using npm
npm install ajax-table-vue
```

### Import the package

#### Use the ESM build

> The [*ESM*] build (**E**cma**S**cript **M**odule) implies that your target browsers supports *ESM* **OR** you use a bundler, like [*webpack*](https://webpack.js.org/), [*rollup.js*](https://rollupjs.org/guide/en) or [*Parcel*](https://parceljs.org/).

Import & register two main components in Vue globally:

```js
import Vue from 'vue';
import {AjaxTable, Column} from 'ajax-table-vue';
```

Register two main components `globally`:
```js
Vue.component('ajax-table', AjaxTable);
Vue.component('column', Column);
```

Or `locally`:
```js
const app = new Vue({
    el: '#app',
    components: {
        'ajax-table': AjaxTable,
        'column': Column
    }
});
```


### Base usage

Use the components in your HTML or template:
> Note: uri endpoint must be `POST`
```html
<div id="app">
    <ajax-table uri="https://endpoint-for-data">
    <!-- columns base config -->
       <template #columns>
           <column label="Id" name="id"></column>
           <column label="Name" name="name"></column>
       </template>
    </ajax-table>
</div>
```

## Customize the table

### filtering and sorting
You can disable or enable filtering and sorting using the following non-required props(they are by default - `true`): `filterable`, `sortable`. Here's an expample:

```js
...
<column label="Name" name="name" :filterable="false" :sortable="true"></column>
...
```

### filtering input
You can customize filtering input in columns like this:

```js
<div id="app">
    <ajax-table uri="https://endpoint-for-data">
    <!-- columns base config -->
       <template #columns>
           <column label="Id" name="id"></column>
           <column label="Name" name="name"></column>
       </template>
       
       <!-- Note: column name should go after #filter- -->
        <template #filter-id="{filters, col}">
            <select v-model="filters[col]">
                <option value="" selected>-</option>
                <option>1</option>
                <option>2</option>
            </select>
        </template>
    </ajax-table>
</div>
```

### table values customization
```js
<div id="app">
    <ajax-table uri="https://endpoint-for-data">
    <!-- columns base config -->
       <template #columns>
           <column label="Id" name="id"></column>
           <column label="Name" name="name"></column>
       </template>
       
       <!-- Column specific value customization -->
       <!-- Note: column name should go after #value- -->
        <template #value-id="{value}">
            {{ value !== null ? value : 'No data available' }}
        </template>

       <!-- All column values customization -->
       <!-- Will be overwritten if column specific value customization is present  -->
        <template #value="{value}">
            {{value !== null ? value : 'No data'}}
        </template>
    </ajax-table>
</div>
```

### adding actions
All action components should be extended from ActionButton component:
```js
import {ActionButton} from 'ajax-table-vue';

Vue.component('action-button-delete', {
  extends: ActionButton,
  data: function () {
    return {
    }
  },
  methods: {
    alertId() {
        alert(this.row.id);
    }
},
  template: '<button @click.prevent="alertId"><slot>Delete</slot></button>'
})
```
```js
<div id="app">
    <ajax-table uri="https://endpoint-for-data">
    <!-- columns base config -->
       <template #columns>
           <column label="Id" name="id"></column>
           <!-- Actions column, name must be equal: 'actions' -->
           <column label="Actions" name="actions"></column>
           <column label="Name" name="name"></column>
       </template>

        <!-- variable row allows to access all values in a row -->
        <template #actions="{row}">
            <action-button-delete :row="row"></action-button-delete>
            <action-button-delete :row="row"></action-button-delete>
        </template>
    </ajax-table>
</div>
```

### Data structure

#### Data being received from the server
```json
{
    "0": {
        "id": 1,
        "name": "Name"
    },
    "1": {
        "id": 2,
        "name": "Another name"
    },
    "meta": {
        "pagination": {
            "total_pages": 2
        }
    }
}
```
### Data being sent to the server
Using filtering and sorting:
```json
{
"filter":[
    {
    "col":"name",
    "value":"qwe"
    }
],
"sort":{
    "col":"id",
    "order":"desc"
},
"page":1
}
```
Without using filtering and sorting:
```json
{
"filter":[],
"sort":{},
"page":1
}
```