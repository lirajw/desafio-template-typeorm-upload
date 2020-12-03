import path from 'path';
import multer from 'multer';

const fileDirectory = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: fileDirectory,
  storage: multer.diskStorage({
    destination: fileDirectory,
    filename(request, file, callBack) {
      const fileName = 'import_transactions.csv';

      return callBack(null, fileName);
    },
  }),
};
