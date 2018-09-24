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
            { name: "servidor Web", bloco: "tecnologia" },
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

var m = [20, 120, 20, 120],
  w = 1280 - m[1] - m[3],
  h = 800 - m[0] - m[2],
  i = 0,
  root = {};

var tree = d3.layout.tree().size([h, w]);

var diagonal = d3.svg.diagonal().projection(function(d) {
  return [d.y, d.x];
});

var vis = d3
  .select("#body")
  .append("svg:svg")
  .attr("width", w + m[1] + m[3])
  .attr("height", h + m[0] + m[2])
  .append("svg:g")
  .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

root = taxonomia;
root.x0 = h / 2;
root.y0 = 0;

function toggleAll(d) {
  if (d.children) {
    d.children.forEach(toggleAll);
    toggle(d);
  }
}

// Initialize the root to show its children.
//root.children.forEach(toggleAll);
update(root);

function update(source) {
  var duration = d3.event && d3.event.altKey ? 5000 : 500;

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse();

  // Normalize for fixed-depth.
  nodes.forEach(function(d) {
    d.y = d.depth * 180;
  });

  // Update the nodes…
  var node = vis.selectAll("g.node").data(nodes, function(d) {
    return d.id || (d.id = ++i);
  });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node
    .enter()
    .append("svg:g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on("click", function(d) {
      toggle(d);
      update(d);
      // TODO: Insert data
      console.log(d);
    });

  nodeEnter
    .append("svg:circle")
    .attr("r", 1e-6)
    .style("fill", function(d) {
      return d._children ? "lightsteelblue" : "#fff";
    });

  nodeEnter
    .append("svg:text")
    .attr("x", function(d) {
      return d.children || d._children ? -10 : 10;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) {
      return d.children || d._children ? "end" : "start";
    })
    .text(function(d) {
      return d.name;
    })
    .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node
    .transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  nodeUpdate
    .select("circle")
    .attr("r", 4.5)
    .style("fill", function(d) {
      return d._children ? "lightsteelblue" : "#fff";
    });

  nodeUpdate.select("text").style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node
    .exit()
    .transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  nodeExit.select("circle").attr("r", 1e-6);

  nodeExit.select("text").style("fill-opacity", 1e-6);

  // Update the links…
  var link = vis.selectAll("path.link").data(tree.links(nodes), function(d) {
    return d.target.id;
  });

  // Enter any new links at the parent's previous position.
  link
    .enter()
    .insert("svg:path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = { x: source.x0, y: source.y0 };
      return diagonal({ source: o, target: o });
    })
    .transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition links to their new position.
  link
    .transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link
    .exit()
    .transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = { x: source.x, y: source.y };
      return diagonal({ source: o, target: o });
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
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
