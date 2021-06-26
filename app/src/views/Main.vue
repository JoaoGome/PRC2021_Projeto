<template>
  <v-row>

    <template>
      <v-col
        class="mt-2"
        cols="12"
      >
        <strong>Top Artists</strong>
      </v-col>

      <Top :elementos="artistas" :itemsPerPage="6"/>

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

      <Top :elementos="musicas" :keys="key" :itemsPerPage="6" :rRated="this.rRated" />


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

    props:["rRated"],

    data(){
      return{ 
        artistas: [],
        albuns: [],
        musicas: [],
        key: ["Artist"],
        filterRrated: ''
      }
    },

    computed: {
      numberOfPages () {
        return Math.ceil(this.elementos.length / this.itemsPerPage)
      },

    },

    created: function () {

      if (this.$route.query.rRated == "false") this.filterRrated = '?rRated=false'
      
      axios
        .get('http://localhost:8080/teste/artistas/popularity' + this.filterRrated)
        .then(res => {
          this.artistas = res.data;
        })
        .catch(this.r = 'error' )
      axios
        .get('http://localhost:8080/teste/albuns/popularity' + this.filterRrated)
        .then(res => {
          this.albuns = res.data;
        })
        .catch(this.r = 'error' )
      axios
        .get('http://localhost:8080/teste/musicas/popularidade' + this.filterRrated)
        .then(res => {
          this.musicas = res.data;
          
        })
        .catch(this.r = 'error' )
  
    },

  }
</script>
