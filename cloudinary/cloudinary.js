require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config().cloud_name;

(async () => {
  const pictures = [
    "efisojnxltcrqgs7avqq",
    "vaztlzlasfybreozokbs",
    "se2jf7khfhgjkuqhawzj",
  ];

  const uploadResult = await cloudinary.uploader
    .destroy(pictures[0], {
      resource_type: "image",
      invalidate: true,
    })
    .then((result) => {
      console.log("success", result);
    })
    .catch((error) => {
      console.error(error);
    });
})();
