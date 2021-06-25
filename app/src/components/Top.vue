<template>
  <v-data-iterator
    :items="elementos"
    :items-per-page="itemsPerPage"
    :page.sync="page"
    hide-default-footer
  >

    <template v-slot:default="props">
      <v-row>
        <v-col
          v-for="item in props.items"
          :key="item.id"
          cols="6"
          md="2"
        >
          <v-card height=100%>
            <v-img
              lazy-src="@/assets/music-image.jpeg"
              :src=item.imagem
            ></v-img>
            <v-card-title class="justify-center align-center">
              {{ item.nome }}
            </v-card-title>


            <v-list dense >
              <v-list-item
                v-for="(key, index) in keys"
                :key="index"
              >
                <v-list-item-content 
                  class="align-end justify-center"
                  :class="{ 'blue--text': sortBy === key }"
                >
                  <v-divider class="pa-md-2"></v-divider>
                  
                  {{ item[key.toLowerCase()] }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        </v-row>
    </template>

    

    <template v-slot:footer>
    <v-row
      class="mt-2"
      align="center"
      justify="center"
    >

      <v-spacer></v-spacer>

      <span
        class="mr-4
        grey--text"
      >
        Page {{ page }} of {{ numberOfPages }} 
      </span>
      <v-btn
        x-small
        fab
        class="mr-1"
        @click="formerPage"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn
        x-small
        fab
        class="ml-1"
        @click="nextPage"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-row>
  </template>

  </v-data-iterator> 
</template>


<script>
  export default {
    
    props:["elementos", "keys"],

    data: () => ({ 
      page: 1,
      itemsPerPage: 6,
    }),

    computed: {
      numberOfPages () {
        return Math.ceil(this.elementos.length / this.itemsPerPage)
      },
    },

    methods: {
      nextPage () {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },
      formerPage () {
        if (this.page - 1 >= 1) this.page -= 1
      }
    },

  }
</script>
