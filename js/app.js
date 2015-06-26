//guardo la pokedex
//ajax es una peticion asincronica
var pokemonObj={};
var pokedexEncontrada = function(data){
  var pokedex=data.pokemon;

  for (var i = 0; i < pokedex.length; i++) {
    pokemonObj[pokedex[i].name]=pokedex[i];
  }

}

var capitalize=function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

$.ajax({
  url: "http://pokeapi.co/api/v1/pokedex/1/",
  type: "GET",
  success: pokedexEncontrada
});


var teclaPresionada = function(event) {
  if (event.which == 13 || event.keyCode == 13){
    console.log("tecla presionada");
    //logica de busqueda
    var valor=$("#pokemon").val();

    var pok = pokemonObj[valor];

    $.ajax({
      url: "http://pokeapi.co/"+ pok["resource_uri"],
      type: "GET",
      success: function(data){
        $("#tipo li").remove();
        var name = data.name;
        var divNombre=$("#nombre");
        divNombre.text(name);

        var tipos = data.types;
        for (var i = 0; i < tipos.length; i++) {
          var tipo=tipos[i];
          var li= $("<li>");
          li.text(capitalize(tipo.name));
          $("#tipo").prepend(li);
        }
        var sprite= data.sprites[0];
        $.ajax({
          url: "http://pokeapi.co/"+ sprite.resource_uri,
          type: "GET",
          success: function(data){
            $("#imagen img").remove();
            var imagen = data.image;
            var imagenTag= $("<img>");
            imagenTag.attr("src", "http://pokeapi.co/"+imagen);
            $("#imagen").prepend(imagenTag);
          }
        })



      }
    })

    return false;
  }

  return true;
}

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};


$("input#pokemon").on("keyup", teclaPresionada );

$('#pokemon').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'states',
  source: substringMatcher(pokemonObj)
});
