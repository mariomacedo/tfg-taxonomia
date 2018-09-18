var root = {
  name: "Taxonomia",
  nivel: 0,
  bloco: "raiz",
  children: [
    {
      name: "Conceitual",
      nivel: 1,
      bloco: "conceitual",
      children: [
        { name: "Abordagem", nivel: 2, bloco: "conceitual" },
        { name: "Tipo de Participação", nivel: 2, bloco: "conceitual" },
        { name: "Engajamento", nivel: 2, bloco: "conceitual" },
        { name: "Dados Abertos", nivel: 2, bloco: "conceitual" }
      ]
    },
    {
      name: "Tecnologias",
      nivel: 1,
      bloco: "tecnologia",
      children: [
        { name: "Plataforma", nivel: 2, bloco: "tecnologia" },
        { name: "Hardware", nivel: 2, bloco: "tecnologia" },
        {
          name: "Desenvolvimento",
          nivel: 2,
          bloco: "tecnologia",
          children: [
            { name: "Banco de Dados", nivel: 3, bloco: "tecnologia" },
            { name: "servidor Web", nivel: 3, bloco: "tecnologia" },
            { name: "Linguagem", nivel: 3, bloco: "tecnologia" },
            { name: "Bibliotecas", nivel: 3, bloco: "tecnologia" },
            { name: "API", nivel: 3, bloco: "tecnologia" }
          ]
        }
      ]
    },
    {
      name: "Funcionalidades",
      nivel: 1,
      bloco: "funcionalidade",
      children: [
        {
          name: "Visualização da Informação",
          nivel: 2,
          bloco: "funcionalidade",
          children: [
            { name: "Técnica", nivel: 3, bloco: "funcionalidade" },
            { name: "Informação", nivel: 3, bloco: "funcionalidade" }
          ]
        },
        {
          name: "Coleta de Dados",
          nivel: 2,
          bloco: "funcionalidade",
          children: [
            { name: "Tipo de Dado", nivel: 3, bloco: "funcionalidade" },
            { name: "Estratégia", nivel: 3, bloco: "funcionalidade" },
            {
              name: "Processamento de Dados",
              nivel: 3,
              bloco: "funcionalidade"
            }
          ]
        },
        { name: "Tipo de Informação", nivel: 2, bloco: "funcionalidade" },
        {
          name: "Interação entre usuários",
          nivel: 2,
          bloco: "funcionalidade",
          children: [
            { name: "Objetivo", nivel: 3, bloco: "funcionalidade" },
            { name: "Técnica", nivel: 3, bloco: "funcionalidade" }
          ]
        },
        { name: "Moderação", nivel: 2, bloco: "funcionalidade" },
        { name: "Direcionamento", nivel: 2, bloco: "funcionalidade" },
        { name: "Autenticação", nivel: 2, bloco: "funcionalidade" }
      ]
    },
    {
      name: "Aspectos Gerais",
      nivel: 1,
      bloco: "apecto",
      children: [
        { name: "Área", nivel: 2, bloco: "apecto" },
        { name: "Localização", nivel: 2, bloco: "apecto" },
        { name: "Escopo", nivel: 2, bloco: "apecto" },
        { name: "Idioma", nivel: 2, bloco: "apecto" },
        { name: "Público Alvo", nivel: 2, bloco: "apecto" },
        { name: "Criação", nivel: 2, bloco: "apecto" }
      ]
    }
  ]
};

function montaArvore() {
  var diameter = 1060;

  var tree = d3.layout
    .tree()
    .size([360, diameter / 2 - 90])
    .separation(function(a, b) {
      return (a.parent == b.parent ? 1 : 2) / a.depth;
    });

  var diagonal = d3.svg.diagonal.radial().projection(function(d) {
    return [d.y, (d.x / 180) * Math.PI];
  });

  var svg = d3
    .select("#taxonomy_tree")
    .append("svg")
    .attr("width", diameter + 100)
    .attr("height", diameter + 100)
    .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

  var nodes = tree.nodes(root),
    links = tree.links(nodes);

  var link = svg
    .selectAll(".link")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", diagonal);

  var node = svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", function(d) {
      return d.bloco + " node";
    })
    .attr("transform", function(d) {
      if (d.nivel == 0) {
        return "rotate(60.25)translate(30)";
      } else {
        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
      }
    });

  node.append("circle").attr("r", function(d) {
    if (d.nivel == 0) {
      return 50;
    } else {
      return 25 - d.nivel * 5;
    }
  });

  // else if(d.bloco != 'apecto'){ return 0}

  node
    .append("text")
    .attr("dy", ".31em")
    .attr("text-anchor", function(d) {
      return d.x < 180 ? "start" : "end";
    })
    .attr("transform", function(d) {
      if (d.nivel == 0) {
        return "rotate(-60)translate(-40)";
      } else {
        return d.x < 180 ? "translate(30)" : "rotate(180)translate(-35)";
      }
    })
    .text(function(d) {
      return d.name;
    });

  //if(d.bloco != 'apecto' && d.bloco != 'raiz'){ return } else{

  d3.select(self.frameElement).style("height", diameter - 150 + "px");
}
