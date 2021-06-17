var express = require('express');
var router = express.Router();
var axios = require('axios')
var gdb = require('../utils/graphdb')

// devolve um array com lista de nomes dos artistas
router.get('/artistas', async function(req, res) 
{
  var query = `
              select ?name where { 
                ?s a :Artista .
                ?s :nome ?name .
              } 
              `

  var result = await gdb.execQuery(query);
  var results = [];
  
  result.results.bindings.map(b => {
    results.push(b.name.value);
  })

  res.send(results);

});

// vai buscar os albuns + imagem deste artista
router.get('/artistas/:name', async function(req, res) 
{
  if (req.params.name)
  {
    var query = `
              select ?name ?image where { 
                ?artista a :Artista .
                ?artista :nome "${req.params.name}" .
                ?artista :hasAlbum ?album .
                ?album :nome ?name .
                ?album :image ?image .
              }
                `

    var result = await gdb.execQuery(query);
    var results = [];
    
    result.results.bindings.map(b => {
      info = 
      {
        "nome": b.name.value,
        "image": b.image.value
      }
      results.push(info)
    })

    res.send(results);
  }
  

});

// devolve um array com lista de nomes dos albuns
router.get('/albuns', async function(req, res) 
{
  var query = `
              select ?name where { 
                ?s a :Album .
                ?s :nome ?name .
              } 
              `

  var result = await gdb.execQuery(query);
  var results = [];
  
  result.results.bindings.map(b => {
    results.push(b.name.value);
  })

  res.send(results);

});

// vai buscar os dados do album
router.get('/albuns/:name', async function(req, res) 
{
  if (req.params.name)
  {
    var query = `
              select ?image ?numeroTracks ?data where { 
                ?album a :Album .
                ?album :nome "${req.params.name}" .
                ?album :image ?image .
                ?album :numberTracks ?numeroTracks .
                ?album :data ?data .
              }
                `

    var result = await gdb.execQuery(query);
    var results = [];
    
    result.results.bindings.map(b => {
      info = 
      {
        "image": b.image.value,
        "data": b.data.value,
        "numeroTracks": b.numeroTracks.value,
        "nome": req.params.name
      }
      results.push(info)
    })

    res.send(results);
  }
  

});

// vai buscar os nomes e duraçao de cada musica do album
router.get('/albuns/musics/:name', async function(req, res) 
{
  if (req.params.name)
  {
    var query = `
                select ?name ?duracao where { 
                  ?album a :Album .
                  ?album :nome "${req.params.name}" .
                  ?album :hasMusic ?music .
                  ?music :nome ?name .
                  ?music :duracao ?duracao .
                 }
                `

    var result = await gdb.execQuery(query);
    var results = [];
    
    result.results.bindings.map(b => {
      info = 
      {
        "nome": b.name.value,
        "duração": b.duracao.value,
      }
      results.push(info)
    })

    res.send(results);
  }
  

});

// vai buscar lista de albuns de um dado ano. (artista, album)
router.get('/albuns/ano/:ano', async function(req, res) 
{

  if (req.params.ano)
  {
    var query = `
              select ?nomeAlbum ?nartista ?data where { 
                ?album a :Album .
                ?album :nome ?nomeAlbum .
                ?album :data ?data .
                ?artista :hasAlbum ?album .
                ?artista :nome ?nartista .
              }
              `

    var result = await gdb.execQuery(query);
    var results = [];

    result.results.bindings.map(b => {
      if (b.data.value.includes(req.params.ano))
      {
        info = 
        {
          "album": b.nomeAlbum.value,
          "artista": b.nartista.value,
        }

        results.push(info)
      }
      
    })

    res.send(results);
    }
  
});

// devolve um array com lista de nomes das músicas
router.get('/musicas', async function(req, res) 
{
  var query = `
              select ?name where { 
                ?s a :Musica .
                ?s :nome ?name .
              } 
              `

  var result = await gdb.execQuery(query);
  var results = [];
  
  result.results.bindings.map(b => {
    results.push(b.name.value);
  })

  res.send(results);

});

// vai buscar lista de musicas ordenadas por popularidade (devolve nome da musica, album, artista e popularidade) 
router.get('/musicas/popularidade', async function(req, res) 
{
  var query = `
              select ?nomeMusica ?nomeAlbum ?nartista ?popularity where { 
                ?musica a :Musica .
                ?musica :nome ?nomeMusica .
                ?musica :ofAlbum ?album .
                ?musica :popularity ?popularity .
                ?album :nome ?nomeAlbum .
                ?artista :hasAlbum ?album .
                ?artista :nome ?nartista .
              }
              order by desc (?popularity) 
              `

  var result = await gdb.execQuery(query);
  var results = [];


  result.results.bindings.map(b => {
    info = 
    {
      "musica": b.nomeMusica.value,
      "album": b.nomeAlbum.value,
      "artista": b.nartista.value,
      "popularity": b.popularity.value
    }

    results.push(info)
  })

  res.send(results);
  

});

// vai buscar lista de musicas ordenadas por danceability (devolve nome da musica, album, artista e danceability) 
router.get('/musicas/danceability', async function(req, res) 
{
  var query = `
              select ?nomeMusica ?nomeAlbum ?nartista ?danceability where { 
                ?musica a :Musica .
                ?musica :nome ?nomeMusica .
                ?musica :ofAlbum ?album .
                ?musica :danceability ?danceability .
                ?album :nome ?nomeAlbum .
                ?artista :hasAlbum ?album .
                ?artista :nome ?nartista .
              }
              order by desc (?danceability) 
              `

  var result = await gdb.execQuery(query);
  var results = [];

  result.results.bindings.map(b => {
    info = 
    {
      "musica": b.nomeMusica.value,
      "album": b.nomeAlbum.value,
      "artista": b.nartista.value,
      "danceability": b.danceability.value
    }

    results.push(info)
  })

  res.send(results);
  

});

// vai buscar lista de musicas de um dado ano. (devolve nome musica, artista, album)
router.get('/musicas/ano/:ano', async function(req, res) 
{

  if (req.params.ano)
  {
    var query = `
              select ?nomeMusica ?nomeAlbum ?nartista ?data where { 
                ?musica a :Musica .
                ?musica :nome ?nomeMusica .
                ?musica :ofAlbum ?album .
                ?album :nome ?nomeAlbum .
                ?album :data ?data .
                ?artista :hasAlbum ?album .
                ?artista :nome ?nartista .
              }
              `

    var result = await gdb.execQuery(query);
    var results = [];

    result.results.bindings.map(b => {
      if (b.data.value.includes(req.params.ano))
      {
        info = 
        {
          "musica": b.nomeMusica.value,
          "album": b.nomeAlbum.value,
          "artista": b.nartista.value,
        }

        results.push(info)
      }
      
    })

    res.send(results);
    }
  
});



// vai buscar toda a informação de musicas com o nome
router.get('/musicas/:name', async function(req, res) 
{
  if (req.params.name)
  {
    var query = `
                select ?nartista ?duracao ?nome ?danceability ?popularity ?ratedR ?ano where { 
                  ?musica a :Musica .
                  ?musica :nome "${req.params.name}" .
                  ?musica :duracao ?duracao .
                  ?musica :danceability ?danceability .
                  ?musica :popularity ?popularity .
                  ?musica :ratedR ?ratedR .
                  ?musica :ofAlbum ?album .
                  ?album :nome ?nome .
                  ?album :data ?ano .
                  ?artista :hasAlbum ?album .
                  ?artista :nome ?nartista .
                }
                `

    var result = await gdb.execQuery(query);
    var results = [];
  
    result.results.bindings.map(b => {
      info = 
      {
        "artista": b.nartista.value,
        "duracao": b.duracao.value,
        "album": b.nome.value,
        "danceability": b.danceability.value,
        "popularity": b.popularity.value,
        "ratedR": b.ratedR.value,
        "data": b.ano.value
      }

      results.push(info)
    })

    res.send(results);
  }
  

});

// vai buscar todas as musicas com menor duração 
router.get('/musicas/duracao/:duracao', async function(req, res) 
{
  if (req.params.duracao)
  {
    var query = `
                select ?nomeMusica ?nomeAlbum ?nartista ?duracao where { 
                  ?musica a :Musica .
                  ?musica :nome ?nomeMusica .
                  ?musica :duracao ?duracao .
                  ?musica :ofAlbum ?album .
                  ?album :nome ?nomeAlbum .
                  ?artista :hasAlbum ?album .
                  ?artista :nome ?nartista .
                }
                `

    var result = await gdb.execQuery(query);
    var results = [];
  
    result.results.bindings.map(b => {
      if (parseInt(req.params.duracao) > parseInt(b.duracao.value.split(':')[0]))
      {
        info = 
        { 
          "musica": b.nomeMusica.value,
          "album": b.nomeAlbum.value,
          "artista": b.nartista.value,
          "duracao": b.duracao.value,
        }
        results.push(info)
      }
      
    })

    res.send(results);
  }

});

// vai buscar toda a informação de uma musica de um dado album
router.get('/musicas/:album/:name', async function(req, res) 
{
  if (req.params.name && req.params.album)
  {
    var query = `
                  select ?nartista ?duracao ?danceability ?popularity ?ratedR ?ano where { 
                    ?musica a :Musica .
                    ?musica :nome "${req.params.name}" .
                    ?musica :duracao ?duracao .
                    ?musica :danceability ?danceability .
                    ?musica :popularity ?popularity .
                    ?musica :ratedR ?ratedR .
                    ?musica :ofAlbum ?album .
                    ?album :nome "${req.params.album}" .
                    ?album :data ?ano .
                    ?artista :hasAlbum ?album .
                    ?artista :nome ?nartista .
                }
                `

    var result = await gdb.execQuery(query);
    var results = [];
  
    result.results.bindings.map(b => {
      info = 
      {
        "artista": b.nartista.value,
        "duracao": b.duracao.value,
        "album": req.params.album,
        "danceability": b.danceability.value,
        "popularity": b.popularity.value,
        "ratedR": b.ratedR.value,
        "data": b.ano.value
      }

      results.push(info)
    })

    res.send(results);
  }

});

module.exports = router;
