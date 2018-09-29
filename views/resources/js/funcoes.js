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
