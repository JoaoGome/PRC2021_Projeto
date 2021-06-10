const fs = require('fs')

fs.readFile('../Datasets/finalDataset.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }

    var content = JSON.parse(jsonString);
    
    for (i = 0; i < content.length; i++)
    {
        var keys = Object.keys(content[i]);
        keys.splice(0,5);
        console.log(`###  http://prc.di.uminho.pt/2021/Projeto#${content[i].Name.split(' ').join('_')}`);
        console.log(`<http://prc.di.uminho.pt/2021/Projeto#${content[i].Name.split(' ').join('_')}> rdf:type owl:NamedIndividual ,`);
        console.log(`:Superhero ;`);
        console.log(`:original "No" ;`);
        console.log(`:first_appearance "${content[i].FirstAppearance.split('"').join("")}" ;`);
        console.log(`:alter_egos "${content[i].AlterEgos.split('"').join("")}" ;`);
        console.log(`:creator "${content[i].Creator}" ;`);
        console.log(`:full_name "${content[i].FullName}" ;`);
        for (var j = 0; j < keys.length; j++)
        {
            console.log(`:hasPower :${keys[j].split('/').join('_')} ;`);
        }
                                                                 
        console.log(`:name "${content[i].Name}" .`)

        console.log('\n');

        for (var j = 0; j < keys.length; j++)
        {
            console.log(`###  http://prc.di.uminho.pt/2021/Projeto#${keys[j].split('/').join('_')}`);
            console.log(`:${keys[j].split('/').join('_')} rdf:type owl:NamedIndividual ,`);
            console.log(`:Power ;`);
            console.log(`:name "${keys[j].split('_').join(' ')}" .`);
            console.log('\n');
        }
           
                                                  
    }
})