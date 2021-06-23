<template>
  <v-app>
    <div>
    <v-data-table
      :headers="headers"
      :items="elementos"
      item-key="id"
      class="elevation-1"
      :search="search"
      :custom-filter="filterOnlyCapsText"
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Search for Music Names"
          class="mx-4"
        ></v-text-field>
      </template>
    </v-data-table>
  </div>
  </v-app>
</template>

<script>
  import axios from 'axios';
  export default {
    props:["site", "tema"],

    data () {
      return {
        search: '',
        elementos: [],
      }
    },
    computed: {
      headers () {
        return [
          {
            text: 'Musica',
            align: 'start',
            sortable: false,
            value: 'musica',
          },
          {
            text: 'Album',
            value: 'album',
          },
          { text: 'Artista', value: 'artista' },
          { text: 'Popularity', value: 'popularity' }
        ]
      },
    },
    created: function () {
      axios
        .get('http://localhost:8080/teste/'+ this.site)
        .then(res => {
          this.elementos = res.data;
          var id = 0
          for (var i = 0; i < this.elementos.length; i++)
          {
            this.elementos[i]["id"] = id;
            id++;
          }
            
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
