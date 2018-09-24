var taxonomia = {
  name: "Taxonomia",
  bloco: "raiz",
  children: [
    {
      name: "Conceitual",
      bloco: "conceitual",
      children: [
        { name: "Abordagem", bloco: "conceitual" },
        { name: "Tipo de Participação", bloco: "conceitual" },
        { name: "Engajamento", bloco: "conceitual" },
        { name: "Dados Abertos", bloco: "conceitual" }
      ]
    },
    {
      name: "Tecnologias",
      bloco: "tecnologia",
      children: [
        { name: "Plataforma", bloco: "tecnologia" },
        { name: "Hardware", bloco: "tecnologia" },
        {
          name: "Desenvolvimento",
          bloco: "tecnologia",
          children: [
            { name: "Banco de Dados", bloco: "tecnologia" },
            { name: "Servidor Web", bloco: "tecnologia" },
            { name: "Linguagem", bloco: "tecnologia" },
            { name: "Bibliotecas", bloco: "tecnologia" },
            { name: "API", bloco: "tecnologia" }
          ]
        }
      ]
    },
    {
      name: "Funcionalidades",
      bloco: "funcionalidade",
      children: [
        {
          name: "Visualização da Informação",
          bloco: "funcionalidade",
          children: [
            { name: "Técnica", bloco: "funcionalidade" },
            { name: "Informação", bloco: "funcionalidade" }
          ]
        },
        {
          name: "Coleta de Dados",
          bloco: "funcionalidade",
          children: [
            { name: "Tipo de Dado", bloco: "funcionalidade" },
            { name: "Estratégia", bloco: "funcionalidade" },
            {
              name: "Processamento de Dados",
              bloco: "funcionalidade"
            }
          ]
        },
        { name: "Tipo de Informação", bloco: "funcionalidade" },
        {
          name: "Interação entre usuários",
          bloco: "funcionalidade",
          children: [
            { name: "Objetivo", bloco: "funcionalidade" },
            { name: "Técnica", bloco: "funcionalidade" }
          ]
        },
        { name: "Moderação", bloco: "funcionalidade" },
        { name: "Direcionamento", bloco: "funcionalidade" },
        { name: "Autenticação", bloco: "funcionalidade" }
      ]
    },
    {
      name: "Aspectos Gerais",
      bloco: "apecto",
      children: [
        { name: "Área", bloco: "apecto" },
        { name: "Localização", bloco: "apecto" },
        { name: "Escopo", bloco: "apecto" },
        { name: "Idioma", bloco: "apecto" },
        { name: "Público Alvo", bloco: "apecto" },
        { name: "Criação", bloco: "apecto" }
      ]
    }
  ]
};

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

function toggleAll(d) {
  if (d.children) {
    d.children.forEach(toggleAll);
    toggle(d);
  }
}

montaArvore(taxonomia);

function montaArvore(source) {
  var duration = d3.event && d3.event.altKey ? 5000 : 500;

  var nodes = tree.nodes(source),
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
      if (d.depth == 0) {
        return "rotate(60.25)translate(30)";
      } else {
        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
      }
    });

  node
    .append("circle")
    .attr("r", function(d) {
      if (d.depth == 0) {
        return 50;
      } else {
        return 25 - d.depth * 5;
      }
    })
    .on("click", function(d) {
      // TODO: Insert data
      var toastHTML =
        '<span>'+ d.name+'</span><button class="btn-flat toast-action" onclick="dismissToast()">x</button>';
      M.toast({ html: toastHTML });
      console.log(d);
    });

  node
    .append("text")
    .attr("dy", ".31em")
    .attr("text-anchor", function(d) {
      return d.x < 180 ? "start" : "end";
    })
    .attr("transform", function(d) {
      if (d.depth == 0) {
        return "rotate(-60)translate(-40)";
      } else {
        return d.x < 180 ? "translate(30)" : "rotate(180)translate(-35)";
      }
    })
    .text(function(d) {
      return d.name;
    })
    .on("click", function(d) {
      // TODO: Insert data
      toggle(d);
      console.log(d);
    });

  d3.select(self.frameElement).style("height", diameter - 150 + "px");
}

// Toggle children.
function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}
