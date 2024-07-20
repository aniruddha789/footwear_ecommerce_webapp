import {
    connectStorageEmulator,
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    getBlob,
  } from 'firebase/storage';



  // Create a reference with an initial file path and name
// const storage = getStorage();
// const pathReference = ref(storage, 'IMG20220127180432_01.jpg');

// // Create a reference from a Google Cloud Storage URI
// const gsReference = ref(storage, 'gs://urban-kicks-392619.appspot.com/IMG20220127180432_01.jpg');

// // Create a reference from an HTTPS URL
// // Note that in the URL, characters are URL escaped!
// const httpsReference = ref(storage, 'https://firebasestorage.googleapis.com/v0/b/urban-kicks-392619.appspot.com/o/IMG20220127180432_01.jpg?alt=media&token=baa13a31-2bcf-4df3-860d-9bd371fdf8ca');

// let url = "";
// getDownloadURL(pathReference).then(
//     function(value) {
//       url = value;
//     }
// )

const url = 'hello';
export default url;


