import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from 'src/database/entities/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async upload(file: Express.Multer.File, path: string): Promise<FileEntity> {
    const newFile = new FileEntity();
    newFile.name = file.originalname;
    newFile.size = file.size;
    newFile.mimetype = file.mimetype;
    newFile.path = path;
    return this.fileRepository.save(newFile);
  }

  async delete(id: string): Promise<void> {
    await this.fileRepository.delete(id);
  }
}
