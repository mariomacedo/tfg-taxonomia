var taxonomia = {
  id: "taxonomia",
  name: "Taxonomia",
  bloco: "raiz",
  nivel: 0,
  children: []
};

function toggleAll(d) {
  if (d.children) {
    d.children.forEach(toggleAll);
    toggle(d);
  }
}

function buscaDadosAndMontaArvore(nodeName) {
  $.get("/taxonomia/" + nodeName, json => {
    taxonomia.children = json;
    montaArvore(taxonomia);
  });
}
//TODO: blockui LOADING
buscaDadosAndMontaArvore("raiz");

function montaArvore(source) {
  var diameter = 1080;
  var treeRadial = d3.layout
    .tree()
    .size([360, diameter / 2 - 90])
    .separation(function(a, b) {
      return (a.parent == b.parent ? 1 : 2) / a.depth;
    });

  var diagonalTreeRadial = d3.svg.diagonal.radial().projection(function(d) {
    return [d.y, (d.x / 180) * Math.PI];
  });

  var svg = d3
    .select("#taxonomy_tree")
    .append("svg")
    .attr("width", diameter + 100)
    .attr("height", diameter + 100)
    .append("g")
    .attr(
      "transform",
      "translate(" + (diameter / 2 + 100) + "," + (diameter / 2 - 5) + ")"
    );
  var duration = d3.event && d3.event.altKey ? 5000 : 500;

  var nodes = treeRadial.nodes(source),
    links = treeRadial.links(nodes);

  var link = svg
    .selectAll(".link")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", diagonalTreeRadial);

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
      console.log("clicked ID: " + d.id);
      buscaFerramentaById(d.id);
      var toastHTML =
        "<span>" +
        d.name +
        '</span><button class="btn-flat toast-action" onclick="dismissToast()">x</button>';
      M.toast({ html: toastHTML });
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
