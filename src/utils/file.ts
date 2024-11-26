import * as fs from 'fs';
import * as path from 'path';

export const saveFile = async (file: Express.Multer.File) => {
  const filePath = path.join(__dirname, `../../uploads`);
  const fileName = `${Date.now()}-${file.originalname}`;
  const fullPath = path.join(filePath, fileName);

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }

  fs.writeFileSync(fullPath, file.buffer);
  return `${fileName}`;
};

export const deleteFile = async (fileName: string) => {
  const filePath = path.join(__dirname, `../../uploads`);
  const fullPath = path.join(filePath, fileName);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }

  return true;
};
