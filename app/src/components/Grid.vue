<template>
  <v-app>
    <v-container fluid>
    <v-data-iterator
      v-model="thisone"
      :items="elementos"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
      :custom-filter="customFilter"
    >
      <template v-slot:header>
        <v-toolbar
          dark
          color="blue darken-3"
          class="mb-1"
        >
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keysSort"
              prepend-inner-icon="mdi-magnify"
              label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle
              v-model="sortDesc"
              mandatory
            >
              <v-btn
                large
                depressed
                color="blue"
                :value="false"
              >
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn
                large
                depressed
                color="blue"
                :value="true"
              >
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card height=100% :href="getURL(item.id)">
              <v-img
                lazy-src="@/assets/music-image.jpeg"
                :src="getImgUrl(item.imagem)"
              ></v-img>
              <v-card-title class="subheading font-weight-bold">
                {{ item.name }}
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item 
                  v-for="(key, index) in keysShow"
                  :key="index"
                >
                  <v-list-item-content>
                    {{ key }}:
                  </v-list-item-content>
                  <v-list-item-content
                    class="align-end"
                  >
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
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span
            class="mr-4
            grey--text"
          >
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="ml-1"
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>


  </v-app>
</template>

<script>
  import axios from 'axios';
  export default {
    props:["site", "tema", "keysSort", "keysShow"],

    data () {
      return {
        elementos:[],
        itemsPerPageArray: [8, 12, 24],
        search: '',
        filter: {},
        sortDesc: false,
        page: 1,
        itemsPerPage: 8,
        sortBy: 'name',
        filterRrated: '',
      }
    },
    created: function () {
      if (this.$route.query.rRated == "false") this.filterRrated = '?rRated=false'
      axios
        .get('http://localhost:8080/teste/' + this.site + this.filterRrated)
        .then(res => {
          this.elementos = res.data;

          this.search = ''
        })
        .catch(this.r = 'error' )
    },
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
      },
      updateItemsPerPage (number) {
        this.itemsPerPage = number
      },
      getImgUrl(imagem){
        if( !imagem.includes('/') ){
          var images = require.context('@/assets/imagens/', false, /\.jpeg$/)
          return images('./' + imagem)
        }
        else
          return imagem
      },
      getURL(id){
        if(this.tema === "Artist")
          return "/artist/" + id + this.filterRrated
        if(this.tema === "Album")
          return "/album/" + id + this.filterRrated
      },
      customFilter(items, search) {
        if (search.trim() === '') return items;

        return items.filter(item => {
          return item.name.toLowerCase().includes(search.toLowerCase());
        }, search);
      }
    },
    
  }
  
</script>
