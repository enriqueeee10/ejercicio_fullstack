import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'; // Importa ConflictException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // Importa In
import { Note } from './entities/note.entity';
import { Tag } from './entities/tag.entity'; // Importa Tag
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    @InjectRepository(Tag) // Inyecta el repositorio de Tag
    private tagsRepository: Repository<Tag>,
  ) {}

  private async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    if (!tagNames || tagNames.length === 0) return [];
    const existingTags = await this.tagsRepository.find({
      where: { name: In(tagNames) },
    });
    const existingTagNames = new Set(existingTags.map((tag) => tag.name));
    const newTagNames = tagNames.filter((name) => !existingTagNames.has(name));

    const newTags = newTagNames.map((name) =>
      this.tagsRepository.create({ name }),
    );
    await this.tagsRepository.save(newTags);

    return [...existingTags, ...newTags];
  }

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const { tags: tagNames, ...noteData } = createNoteDto;
    const newNote = this.notesRepository.create(noteData);

    if (tagNames && tagNames.length > 0) {
      newNote.tags = await this.findOrCreateTags(tagNames);
    }

    return this.notesRepository.save(newNote);
  }

  async findAll(isArchived?: boolean, filterTags?: string[]): Promise<Note[]> {
    const query = this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.tags', 'tag'); // Carga las etiquetas relacionadas

    if (isArchived !== undefined) {
      query.where('note.isArchived = :isArchived', { isArchived });
    }

    if (filterTags && filterTags.length > 0) {
      // Filtra por notas que tienen AL MENOS UNA de las etiquetas especificadas
      query.andWhere('tag.name IN (:...filterTags)', { filterTags });
    }

    query.orderBy('note.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id },
      relations: ['tags'], // Carga las etiquetas cuando buscas una nota por ID
    });
    if (!note) {
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id);
    const { tags: tagNames, ...noteData } = updateNoteDto;

    Object.assign(note, noteData);

    if (tagNames !== undefined) {
      // Si se proporcionan tags, actualiza la relación
      note.tags = await this.findOrCreateTags(tagNames);
    }

    return this.notesRepository.save(note);
  }

  async remove(id: string): Promise<void> {
    const result = await this.notesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }
  }

  async archive(id: string): Promise<Note> {
    const note = await this.findOne(id);
    note.isArchived = true;
    return this.notesRepository.save(note);
  }

  async unarchive(id: string): Promise<Note> {
    const note = await this.findOne(id);
    note.isArchived = false;
    return this.notesRepository.save(note);
  }

  async getAllTags(): Promise<Tag[]> {
    return this.tagsRepository.find();
  }

  // Nuevo método para eliminar una etiqueta
  async deleteTag(id: string): Promise<void> {
    const tag = await this.tagsRepository.findOne({
      where: { id },
      relations: ['notes'],
    });
    if (!tag) {
      throw new NotFoundException(`Tag with ID "${id}" not found`);
    }
    if (tag.notes && tag.notes.length > 0) {
      throw new ConflictException(
        `Tag "${tag.name}" cannot be deleted because it is still associated with ${tag.notes.length} note(s).`,
      );
    }
    await this.tagsRepository.delete(id);
  }
}
