<template>
  <Lista tema="Music" :elementos="elementos" :headers="headers" :sort="[]" :sortdesc="[]" />
</template>

<script>
import Lista from "@/components/Lista.vue";

import axios from 'axios';
export default {
  components: {
    Lista
  },

  data () {
    return {
      elementos:[],
      filterRrated: '',
    }
  },

  created: function () {
    if (this.$route.query.rRated == "false") this.filterRrated = '?rRated=false'
    
    axios
      .get('http://localhost:8080/teste/musicas' + this.filterRrated)
      .then(res => {
        this.elementos = res.data;            
        this.search = ''
      })
      .catch(this.r = 'error' )
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
};
</script>
