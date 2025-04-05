const addFolderBtn = document.querySelector(".add_folder");
// show folder form dialog
const addFolderDlg = document.querySelector(".create_folder_container");
addFolderBtn.addEventListener("click", () => {
  addFolderDlg.showModal();
});
// close the dialog within the dialog
const closeCreateFolder = document.querySelector(".close_create_folder");
closeCreateFolder.addEventListener("click", () => {
  addFolderDlg.close();
});
// show the update dialog
const folderUpdate = document.querySelectorAll("button.update_folder");
const folderAct = document.querySelector('dialog[class="folderAct"]');
folderUpdate.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // grab elements data attribute
    const id = e.target.getAttribute("data-folderId");
    const name = e.target.getAttribute("data-folderName");

    // compare and contrast
    folderAct.showModal();
  });
});
// close update dialog
const closeUpdate = document.querySelector("button.close_update");
closeUpdate.addEventListener("click", () => {
  folderAct.close();
});

const folderDelete = document.querySelectorAll("button.delete_folder");
const folderDeleteDialog = document.querySelector("dialog.deleteFolderDialog");
folderDelete.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    folderDeleteDialog.showModal();
  });
});
const closeDelete = document.querySelector("button.close_delete");
closeDelete.addEventListener("click", () => {
  folderDeleteDialog.close();
});
