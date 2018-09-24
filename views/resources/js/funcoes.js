function dismissToast() {
    var toastElement = $(".toast");
    var toastInstance = M.Toast.getInstance(toastElement);
    toastInstance.dismiss();
  }
