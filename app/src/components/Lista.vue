<template>
  <v-container fluid fill-height>
    <v-card width="100vw">
      <v-data-table
        :headers="headers"
        :items="elementos"
        :sort-by="[]"
        :sort-desc="[]"
        multi-sort
        class="elevation-1"
      >
      <template v-slot:top>
          <v-text-field
            v-model="search"
            :label="label"
            class="mx-4"
          ></v-text-field>
      </template>
      </v-data-table> 
    </v-card>
  </v-container>
</template>

<script>
  import axios from 'axios';
  export default {
    props:["site", "tema"],

    data () {
      return {
        search: '',
        label: "Search for " + this.tema + " Names",
        elementos: [],
      }
    },
    computed: {
      headers () {
        return [
          {
            text: 'Musica',
            align: 'start',
            value: 'musica',
          },
          {
            text: 'Album',
            value: 'album',
          },
          { text: 'Artista', value: 'artista' },
          { text: 'Date', value: 'date' },
        ]
      },
    },
    created: function () {
      axios
        .get('http://localhost:8080/teste/'+ this.site)
        .then(res => {
          this.elementos = res.data;            
          this.search = ''
        })
        .catch(this.r = 'error' )
    },
    methods: {
      filterOnlyCapsText (value, search) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().indexOf(search) !== -1
      },
    },
  }
</script>
