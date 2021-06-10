var express = require('express');
var router = express.Router();
var axios = require('axios')
var gdb = require('../utils/graphdb')

// Nomes de Superheroes não originais
// devolve um array com lista de nomes
router.get('/superheroes', async function(req, res) 
{
  var query = `
            select ?name where { 
            ?s a :Superhero .
            ?s :original "No" .
            ?s :name ?name .
            } 
              `

  var result = await gdb.execQuery(query);
  var results = [];

  result.results.bindings.map(b => {
    results.push(b.name.value);
  })

  res.send(results);

});

// buscar os dados de um superhero given o nome dele
// devolve um json
router.get('/superheroes/:name', async function(req, res) 
{
  var query = `
            select  ?full_name ?creator ?fapp ?egos where { 
              ?s a :Superhero .
              ?s :original "No" .
              ?s :name "${req.params.name}" .
              ?s :creator ?creator .
              ?s :full_name ?full_name .
              ?s :first_appearance ?fapp .
              ?s :alter_egos ?egos .
            } 
              `

  var result = await gdb.execQuery(query);
  var results = {};
    
  result.results.bindings.map(b => {
    results = 
    {
      "Full Name": b.full_name.value,
      "Creator": b.creator.value,
      "First Appearance": b.fapp.value,
      "Alter Egos": b.egos.value
    }
  })

  res.send(results);

});

// buscar os powers de um superhero given o nome dele
// devolve um array com a lista de powers
router.get('/superheroes/powers/:name', async function(req, res) 
{
  var query = `
              select ?name where { 
                ?s a :Superhero .
                ?s :original "No" .
                ?s :name "${req.params.name}" .
                ?s :hasPower ?power .
                ?power :name ?name .
              } 
              `

  var result = await gdb.execQuery(query);
  var results = [];
    
  result.results.bindings.map(b => {
    results.push(b.name.value)
  })

  res.send(results);

});

module.exports = router;
