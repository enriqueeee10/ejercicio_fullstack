import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesModule } from './notes/notes.module';
import { Note } from './notes/entities/note.entity';
import { Tag } from './notes/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin12345',
      database: 'notes_app_db',
      entities: [Note, Tag], // Asegúrate de incluir las entidades Note y Tag
      synchronize: true, // ¡Solo para desarrollo! Usar migraciones en producción.
    }),
    NotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
