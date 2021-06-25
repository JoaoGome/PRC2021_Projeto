<template>
  <v-row>

    <template>
      <v-col
        class="mt-2"
        cols="12"
      >
        <strong>Top Artists</strong>
      </v-col>

      <Top :elementos="artistas" :keys="['imagem']" :itemsPerPage="6"/>

      <v-col
        class="mt-2"
        cols="12"
      >
        <strong>Top Albuns</strong>
      </v-col>

      <Top :elementos="albuns" :keys="key" :itemsPerPage="6"/>

      <v-col
        class="mt-2"
        cols="12"
      >
        <strong>Top Musics</strong>
      </v-col>

      <Top :elementos="musicas" :keys="key" :itemsPerPage="6"/>


    </template>
  </v-row>
</template>


<script>
  import Top from '../components/Top.vue'
  import axios from 'axios';
  export default {
    components: {
      Top,
    },

    data(){
      return{ 
        artistas: [],
        albuns: [],
        musicas: [],
        key: ["Artist"],
      }
    },

    created: function () {
      axios
        .get('http://localhost:8080/teste/artistas/popularity')
        .then(res => {
          this.artistas = res.data;
        })
        .catch(this.r = 'error' )
      axios
        .get('http://localhost:8080/teste/albuns/popularity')
        .then(res => {
          this.albuns = res.data;
          var id = 0
          for (var i = 0; i < this.albuns.length; i++)
          {
            this.albuns[i]["id"] = id;
            id++;
          }
        })
        .catch(this.r = 'error' )
      axios
        .get('http://localhost:8080/teste/musicas/popularidade')
        .then(res => {
          this.musicas = res.data;
          var id = 0
          for (var i = 0; i < this.musicas.length; i++)
          {
            this.musicas[i] =
            {"name": res.data[i].musica,
              "id": id,
              "artist": res.data[i].artista,
              "imagem": res.data[i].imagem
            }
            id++;
          }
            
        })
        .catch(this.r = 'error' )
  
    },

  }
</script>
