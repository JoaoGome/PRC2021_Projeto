<template>
  <v-container fluid fill-height>
    <v-card width="100vw">
      <v-data-table
        dense 
        v-model="musica"
        :headers="headers"
        :items="elementos"
        :search="search"
        :sort-by="sort"
        :sort-desc="sortdesc"
        multi-sort
        class="elevation-1"
        @click:row="handleClick"
      >
      <template v-slot:top>
          <v-text-field
            v-model="search"
            :label="label"
            class="mx-4"
          >{{elementos}}</v-text-field>
      </template>
      </v-data-table> 
    </v-card>
  </v-container>
</template>

<script>
  export default {
    props:["tema", "elementos", "headers", "sort", "sortdesc"],

    data () {
      return {
        search: '',
        label: "Search for " + this.tema + " Names",
        filterRrated: '',
      }
    },

    methods:{
      handleClick(row){
        window.location.href = '/' + this.tema.toLowerCase() + '/' + row.id + this.filterRrated ;
      }
    }
  }
</script>
