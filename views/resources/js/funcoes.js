var optSelecione = $("<option value='null' selected>Selecione</option>");

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

function displayNovaFerramentaStepper(action) {
  if (action == "show") {
    buscarValores();
    $("#nova_ferramenta").show();
    $("#taxonomy_tree")
      .removeClass("l12")
      .addClass("l8");
    $("#body")
      .removeClass("l12")
      .addClass("l8");
  } else {
    $("#nova_ferramenta").hide();
    $("#taxonomy_tree")
      .removeClass("l8")
      .addClass("l12");
    $("#body")
      .removeClass("l8")
      .addClass("l12");
  }
}

function buscarValores() {
  $.get("valor/autocomplete/all", function(response) {
    response.forEach(l => {
      if ($("#" + l.name).prop("nodeName") == "INPUT") {
        var autocomplete = {};
        l.valores.forEach(v => {
          autocomplete[v] = null;
        });
        $("#" + l.label).autocomplete({
          data: autocomplete
        });
      } else if ($("#" + l.name).prop("nodeName") == "SELECT") {
        var select = $("#" + l.name);
        select
          .find("option")
          .remove()
          .end()
          .append(optSelecione);
        l.valores.forEach(v => {
          var opt = $("<option />");
          opt.val(v).text(v);
          select.append(opt);
        });
        select.formSelect();
      } else if ($("#" + l.name).prop("nodeName") == "P") {
        var p = $("#" + l.name);
        console.log(l.name);
        l.valores.forEach(v => {
          var label = $("<label/>");
          var input = $("<input name='" + l.name + "' type='checkbox'/>");
          var span = $("<span/>").text(v);
          label.append(input).append(span);
          p.append(label);
        });
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
    console.log("id: " + id);
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

function carregaModal(id) {
  var printValores = $("#fill_valores");
  printValores.empty();
  var newId = "new_" + id;
  $("#modal_new_col input")
    .prop("name", newId)
    .prop("id", newId);
  $("#modal_new_col label").prop("for", newId);
  updateListValores(id);
}

function saveNewValor() {
  var name = $("#modal_new_col input")
    .prop("name")
    .replace("new_", "");
  var newValor = $("#modal_new_col input").val();
  console.log("POST " + name + " : " + newValor);
  $.post(
    "/valor/new",
    {
      name: name,
      newValor: newValor
    },
    async function() {
      await updateListValores(name);
      await buscarValores();
      var toastHTML =
        '<span>Valor adicionado!</span><button class="btn-flat toast-action" onclick="dismissToast()">x</button>';
      M.toast({ html: toastHTML });
    }
  );
}

function updateListValores(id) {
  console.log("updatelv:" + id);
  $.get("/valor/" + id, function(response) {
    if (response != undefined) {
      $("#fill_valores").empty();
      $("#new_" + id).val("");
      response.valores.forEach(v => {
        var input = $("#new_" + id);
        var button = $("#btn_fill_valores");
        input.on("keyup", function() {
          if (input.val() != "" && !response.valores.includes(input.val())) {
            button.removeClass("disabled");
          } else {
            button.addClass("disabled");
          }
        });

        var p = $("<p class='valores-list'>" + v + "</p>");
        $("#fill_valores").append(p);
      });
    } else {
      var emptyP = $("<p class='valores-list'>Nenhum valor encontrado.</p>");
      $("#fill_valores").append(emptyP);
    }
  });
}
