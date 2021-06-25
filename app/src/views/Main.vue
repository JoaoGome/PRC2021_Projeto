<template>
  <v-row>

    <template>
      <v-col
        class="mt-2"
        cols="12"
      >
        <strong>Top Artists</strong>
      </v-col>

      <Top :elementos="albuns" />

      <v-col
        class="mt-2"
        cols="12"
      >
        <strong>Top Albuns</strong>
      </v-col>

      <Top :elementos="albuns" :keys="key" />

      <v-col
        class="mt-2"
        cols="12"
      >
        <strong>Top Musics</strong>
      </v-col>

      <Top :elementos="musicas" :keys="key" />


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
        key: ["Artista"],
      }
    },

    created: function () {
      axios
        .get('http://localhost:8080/teste/albuns')
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

     /* axios
        .get('http://localhost:8080/teste/albuns')
        .then(res => {
          this.artistas = res.data;
          var id = 0
          for (var i = 0; i < this.artistas.length; i++)
          {
            this.artistas[i]["id"] = id;
            id++;
          }
            
        })
        .catch(this.r = 'error' )
*/
      axios
        .get('http://localhost:8080/teste/musicas/popularidade')
        .then(res => {
          this.musicas = res.data;
          var id = 0
          for (var i = 0; i < this.musicas.length; i++)
          {
            this.musicas[i] =
            {"nome": res.data[i].musica,
              "id": id,
              "artista": res.data[i].artista,
            }
            id++;
          }
            
        })
        .catch(this.r = 'error' )
  
    },

  }
</script>
