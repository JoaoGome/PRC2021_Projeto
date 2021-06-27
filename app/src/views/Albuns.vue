<template>
  <Grid :elementos="elementos" tema="Album" :keysSort="keysSort" :keysShow="keysShow" />
</template>

<script>
import Grid from "@/components/Grid.vue";
import axios from 'axios';

export default {
  data(){
      return {
        filterRrated:'',
        elementos: [],
        keysSort: ['Artist', 'Date', 'Name'],
        keysShow: ['Artist', 'Year'],
      };
  },

  created: function () {
      if (this.$route.query.rRated == "false") this.filterRrated = '?rRated=false'
      axios
        .get('http://localhost:8080/teste/albuns'+ this.filterRrated)
        .then(res => {
          this.elementos = res.data;
        })
        .catch(this.r = 'error' )
    },

  components: {
    Grid
  },

  
    
    
  
}
          
</script>
