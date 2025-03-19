require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config().cloud_name;

(async () => {
  const uploadResult = await cloudinary.uploader
    .upload("cloudinary/19692a5c-b026-492e-ab52-ce873f83af57", {
      resource_type: "image",
      overwrite: true,
    })
    .then((result) => {
      console.log("successs", result);
    })
    .catch((err) => console.log("error", err));
})();
