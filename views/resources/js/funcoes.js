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
        $("#" + l.name).autocomplete({
          data: autocomplete
        });
      } else if ($("#" + l.name).prop("nodeName") == "SELECT") {
        var select = $("#" + l.name);
        select
          .find("option")
          .remove()
          .end();
        select.formSelect();
        var optSelecione = select.prop("multiple")
          ? $('<option value="null" selected disabled >Selecione</option>')
          : $('<option value="null" selected >Selecione</option>');
        select.append(optSelecione);
        l.valores.forEach(v => {
          var opt = $("<option />");
          if (v == "true") {
            opt.val(v).text("Sim");
          } else if (v == "false") {
            opt.val(v).text("Não");
          } else {
            opt.val(v).text(v);
          }
          select.append(opt);
        });
        select.formSelect();
      } else if ($("#" + l.name).prop("nodeName") == "P") {
        var p = $("#" + l.name);
        p.find("label")
          .remove()
          .end();
        l.valores.forEach(v => {
          var label = $("<label/>");
          var input = $(
            '<input name="' + l.name + '" value="' + v + '" type="checkbox"/>'
          );
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
  var aux = $.get("/valor/" + id).done(function(r) {
    $.get("/ferramenta/findByValor/" + id, async function(response) {
      if (response.length > 0 && response != null) {
        const ul = $(".collection.with-header");
        ul.show();
        ul.empty();
        const header =
          '<li class="collection-header"><h4>' +
          (await r.label) +
          '<a onclick="dismissFerramenta()" class="secondary-content"><i class="material-icons">close</i></a></h4><p>' +
          (await r.desc_label) +
          '</p><h6 class="center">Ferramentas</h6></li>';
        ul.append(header);
        response.forEach(v => {
          var li =
            '<li class="collection-item"><div>' +
            v.name +
            "<a onclick=\"showFerramenta('" +
            v.name +
            '\')" class="secondary-content"><i class="material-icons">remove_red_eye</i></a></div></li>';
          ul.append(li);
        });
      } else {
        var liEmpty =
          '<li class="collection-item">Não há valor para a classe selecionada. </li>';
        ul.append(liEmpty);
      }
    });
  });
}

function showFerramenta(id) {
  $.get("valor/autocomplete/all").done(async function(response) {
    var ferramenta = await $.get("/ferramenta/" + id, async function(r) {
      ferramenta = r;
    });
    var table = $(
      '<div id="table_ferramenta" class="col s12 m12 l4"><div class="row center"><div class="col s12 m12 l12"><h5>' +
        id +
        '<a onclick="alert()" class="secondary-content"><i class="material-icons">edit</i></a></h5></div></div><table class="striped vertical-table"><thead><tr></tr></thead><tbody><tr></tr></tbody></table></div>'
    );
    await $(".row.cover")
      .find("#table_ferramenta")
      .remove()
      .end()
      .append(table);

    await $("thead > tr")
      .find("th")
      .remove()
      .end();

    await response.forEach(v => {
      if (ferramenta[v.name] && v.name != "name") {
        $("thead > tr").append("<th>" + v.label + "</th>");
        $("tbody > tr").append("<td>" + ferramenta[v.name] + "</td>");
      }
    });
  });
}

function dismissFerramenta(){
  $(".collection.with-header").hide();
  $("#table_ferramenta").hide();
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
