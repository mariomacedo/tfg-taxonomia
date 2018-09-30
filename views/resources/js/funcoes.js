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
    $("input.autocomplete").autocomplete({
      data: autocomplete,
      onAutocomplete: function(val) {
        // Callback function when value is autcompleted.
        console.log(val);
        $.get("/ferramenta/" + val, response => {
          alert(JSON.stringify(response));
        });
      }
    });
    blockUi.hide();
  });
}
