function dismissToast() {
  var toastElement = $(".toast");
  var toastInstance = M.Toast.getInstance(toastElement);
  toastInstance.dismiss();
}

function toggleAll(d) {
  if (d.children) {
    d.children.forEach(toggleAll);
    toggle(d);
  }
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

function buscarValores() {
  $.get("valor/autocomplete/all", function(response) {
    response.forEach(l => {
      if ($("#" + l.label).prop("nodeName") == "INPUT") {
        var autocomplete = {};
        l.valores.forEach(v => {
          autocomplete[v] = null;
        });
        $("#" + l.label).autocomplete({
          data: autocomplete
        });
      } else if ($("#" + l.label).prop("nodeName") == "SELECT") {
        var select = $("#" + l.label);
        l.valores.forEach(v => {
          var opt = $("<option />");
          opt.val(v).text(v);
          select.append(opt);
        });
        select.formSelect();
      }
    });
  });
}

function buscarFerramentas() {
  var blockUi = $("#loader");
  const tr = "<tr>",
    bTr = "</tr>",
    td = "<td>",
    bTd = "</td>";
  var container = $("#show_ferramentas tbody");
  blockUi.show();
  $.get("/ferramenta/all", response => {
    var autocomplete = {};
    response.ferramentas.forEach(f => {
      autocomplete[f.name] = null;
      var toAppend = tr + td + f.name + bTd + td + f.abordagem + bTd + bTr;
      container.append(toAppend);
    });
    $("#buscar-ferramenta-autocomplete").autocomplete({
      data: autocomplete,
      onAutocomplete: function(val) {
        // Callback function when value is autcompleted.
        console.log(val);
        $.get("/ferramenta/" + val, response => {
          alert(JSON.stringify(response));
        });
      }
    });
    $("#name").autocomplete({
      data: autocomplete
    });
    blockUi.hide();
  });
}

function buscaFerramentaById(id) {
  $.get("/valor/" + id, response => {
    var label = response[0].label.toUpperCase();
    const ul = $(".collection.with-header");
    ul.show();
    ul.empty();
    const header = '<li class="collection-header"><h4>' + label + "</h4></li>";
    ul.append(header);
    if (response.length > 0) {
      response[0].valores.forEach(v => {
        var li =
          '<li class="collection-item"><div>' +
          v +
          '<a href="#!" class="secondary-content"><i class="material-icons">send</i></a></div></li>';
        ul.append(li);
      });
    } else {
      var liEmpty =
        '<li class="collection-item">Não há valor para a classe selecionada. </li>';
      ul.append(liEmpty);
    }
  });
}
