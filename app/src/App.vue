<template>
  <v-app>
    <div>
    <v-data-table
      :headers="headers"
      :items="musicas"
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
    data () {
      return {
        search: '',
        musicas: []
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
        .get('http://localhost:8080/teste/musicas/popularidade')
        .then(res => {
          this.musicas = res.data;
          var id = 0
          for (var i = 0; i < this.musicas.length; i++)
          {
            this.musicas[i]["id"] = id;
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
