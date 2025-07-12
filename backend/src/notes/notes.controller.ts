import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'; // Importa HttpCode y HttpStatus
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { Tag } from './entities/tag.entity'; // Importa Tag

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  findAll(
    @Query('isArchived') isArchived?: string,
    @Query('tags') tags?: string, // Parámetro de consulta para filtrar por tags
  ): Promise<Note[]> {
    const archivedStatus =
      isArchived === 'true' ? true : isArchived === 'false' ? false : undefined;
    const filterTags = tags ? tags.split(',') : undefined; // Convierte la cadena de tags en un array

    return this.notesService.findAll(archivedStatus, filterTags);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Note> {
    return this.notesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Devuelve 204 No Content para eliminaciones exitosas
  remove(@Param('id') id: string): Promise<void> {
    return this.notesService.remove(id);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string): Promise<Note> {
    return this.notesService.archive(id);
  }

  @Patch(':id/unarchive')
  unarchive(@Param('id') id: string): Promise<Note> {
    return this.notesService.unarchive(id);
  }

  @Get('tags/all') // Nuevo endpoint para obtener todas las etiquetas disponibles
  getAllTags(): Promise<Tag[]> {
    return this.notesService.getAllTags();
  }

  @Delete('tags/:id') // Nuevo endpoint para eliminar una etiqueta
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTag(@Param('id') id: string): Promise<void> {
    return this.notesService.deleteTag(id);
  }
}
