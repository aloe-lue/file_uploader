const dialog = document.querySelector(".upload_file_container");
const showDialogBtn = document.querySelector(".show_dialog");
const closeDialogBtn = document.querySelector(".close_file_upload");

function showDialog(el) {
  el.showModal();
}
function closeDialog(el) {
  el.close();
}
showDialogBtn.addEventListener("click", () => showDialog(dialog));
closeDialogBtn.addEventListener("click", () => closeDialog(dialog));

const deleteDialog = document.querySelector("dialog.deleteFileContainer");
const showDeleteDialog = document.querySelectorAll(
  "button.showDeleteFileDialog"
);
const closeDeleteDialog = document.querySelectorAll(
  "button.closeDeleteFileBtn"
);

// show delete dialog
showDeleteDialog.forEach((el) =>
  el.addEventListener("click", () => showDialog(deleteDialog))
);

// close delete dialog
closeDeleteDialog.forEach((el) =>
  el.addEventListener("click", () => closeDialog(deleteDialog))
);

const updateFileContainer = document.querySelector(".updateFileContainer");
const showUpdateFileDialogBtns = document.querySelectorAll(
  ".showUpdateFileDialog"
);
const cancelFileUpdateBtns = document.querySelectorAll(".cancelFileUpdateBtn");
// show update dialog
showUpdateFileDialogBtns.forEach((el) =>
  el.addEventListener("click", () => showDialog(updateFileContainer))
);
// close update dialog
cancelFileUpdateBtns.forEach((el) =>
  el.addEventListener("click", () => closeDialog(updateFileContainer))
);
