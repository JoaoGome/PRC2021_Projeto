<template>
  <Grid site="albuns" tema="Album" :keysSort="keysSort" :keysShow="keysShow" />
</template>

<script>
import Grid from "@/components/Grid.vue";

export default {
  data(){
      return {
        keysSort: ['Artist', 'Date', 'Name'],
        keysShow: ['Artist', 'Year'],
      };
  },

  components: {
    Grid
  },

  
    
    
  
}
          
</script>
