const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// put something in user db
async function createUser({ firstName, lastName, username, email, password }) {
  await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: password,
    },
  });
}

/**
 * use this to find existing username
 * @param username => String
 */
async function findUserByUsername({ username }) {
  const user = prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  return user;
}

// user shouldn't use the same email
async function findUserByEmail({ email }) {
  const user = prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
}

/**
 * deserialized user put user
 * @param {} param0 well a user id
 * @returns
 */

async function findUserById({ id }) {
  const user = prisma.user.findUnique({
    select: {
      firstName: true,
      lastName: true,
      username: true,
      email: false,
      password: false,
      folder: true,
      id: true,
    },
    where: {
      id: id,
    },
  });

  return user;
}

/**
 * @param {*} param0
 */

async function createFolder({ folderName, userId, dateTime, id }) {
  await prisma.folder.create({
    data: {
      folderName: folderName,
      userId: userId,
      createdAt: dateTime,
      id: id,
    },
  });
}

/**
 * run validation on the parameter of the link to know if the user folder exist
 * @param {*} param0
 * @returns
 */

async function findFolderExistence({ folderName, id, userId }) {
  const folder = await prisma.folder.findUnique({
    where: {
      folderName: folderName,
      id: id,
      userId: userId,
    },
    include: {
      file: false,
      user: false,
    },
  });

  return folder;
}

async function findFolderByNameAndId({ folderName, id }) {
  const uniqueFolder = await prisma.folder.findUnique({
    where: {
      folderName: folderName,
      id: id,
    },
    include: {
      file: true,
    },
  });

  return uniqueFolder;
}

/**
 *
 * @param {*} param0 // folderName String, userId Int and id Int
 *
 */
async function updateFolder({ folderName, folderRename, userId, id }) {
  await prisma.folder.update({
    where: {
      folderName: folderName,
      userId: userId,
      id: id,
    },
    data: {
      folderName: folderRename,
    },
  });
}

/**
 *
 * @param {*} param0 // folderName String  userId Int and id Int
 * well to delete folder
 */
async function deleteFolder({ folderName, id }) {
  // deletes all the file that contains a related folderId
  await prisma.file.deleteMany({
    where: {
      folderId: id,
    },
  });

  //  finally delete the folder1
  await prisma.folder.delete({
    where: {
      folderName: folderName,
      id: id,
    },
  });
}

async function updateFileToFolder({
  folderName,
  id,
  userId,
  fileName,
  url,
  size,
  publicId,
  uploadedAt,
  randomName,
}) {
  await prisma.folder.update({
    where: {
      folderName: folderName,
      userId: userId,
      id: id,
    },
    data: {
      file: {
        create: {
          name: fileName,
          url: url,
          size: size,
          uploadedAt: uploadedAt,
          publicId: publicId,
          randomName: randomName,
        },
      },
    },
  });
}

async function readFileFolder({ folderName, folderId }) {
  const files = await prisma.folder.findUnique({
    where: {
      folderName: folderName,
      id: folderId,
    },
    include: {
      file: true,
    },
  });

  return files;
}

async function deleteFile({ publicId, id }) {
  await prisma.file.delete({
    where: {
      id: id,
      publicId: publicId,
    },
  });
}

// rename the name of the file
async function updateFile({ id, rename }) {
  await prisma.file.update({
    where: {
      id: id,
    },
    data: {
      name: rename,
    },
  });
}

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
  findUserByEmail,
  createFolder,
  findFolderByNameAndId,
  findFolderExistence,
  updateFolder,
  deleteFolder,
  updateFileToFolder,
  readFileFolder,
  deleteFile,
  updateFile,
};
