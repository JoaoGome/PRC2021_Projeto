<template>
  <Grid :elementos="elementos" tema="Artist" :keysSort="['Name']"/>
</template>

<script>
import Grid from "@/components/Grid.vue";
import axios from 'axios';

export default {
  components: {
    Grid
  },

    data(){
      return {
        filterRrated:'',
        elementos: [],
      };
  },

  created: function () {
      if (this.$route.query.rRated == "false") this.filterRrated = '?rRated=false'
      axios
        .get('http://localhost:8080/teste/artistas'+ this.filterRrated)
        .then(res => {
          this.elementos = res.data;
        })
        .catch(this.r = 'error' )
    },

};
</script>
