<template>
  <v-container fluid fill-height>
    <v-card width="100vw">
      <v-data-table
        v-model="musica"
        :headers="headers"
        :items="elementos"
        :search="search"
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
            filterable: false
          },
          { 
            text: 'Artista', 
            value: 'artista', 
            filterable: false
          },
          { 
            text: 'Date', 
            value: 'date', 
            filterable: false
          },
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
    }
  }
</script>
