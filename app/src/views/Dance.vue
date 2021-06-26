<template>
  <v-row>

    <template>

      <v-col
        class="mt-2"
        cols="12"
      >
        <strong>Top Dance Albuns</strong>
      </v-col>

      <Top :elementos="albuns" :keys="key" :itemsPerPage="6"/>

      <v-col
        class="mt-2"
        cols="12"
      >
        <strong>Top Dance Music</strong>
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
        filterRrated: '',
      }
    },

    created: function () {
      if (this.$route.query.rRated == "false") this.filterRrated = '?rRated=false'
      axios
        .get('http://localhost:8080/teste/albuns/danceability' + this.filterRrated)
        .then(res => {
          this.albuns = res.data;         
        })
        .catch(this.r = 'error' )

      axios
        .get('http://localhost:8080/teste/musicas/danceability' + this.filterRrated)
        .then(res => {
          this.musicas = res.data;
        })
        .catch(this.r = 'error' )
  
    },

  }
</script>
