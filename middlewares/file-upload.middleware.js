const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

const uploadFileUtility = async (file, filename, folder) => {
  const storage = getStorage();
  const storageRef = ref(storage, `${folder}/${filename}`);
  await uploadBytes(storageRef, file.buffer);
  let downloadUrl = "";
  await getDownloadURL(storageRef).then(async (url) => {
    downloadUrl = url;
  });

  return downloadUrl;
};

module.exports = { uploadFileUtility };
