import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn({ unsigned: true, type: 'int' })
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ length: 255 })
  description: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'uuid', unique: true, nullable: true })
  user_uuid: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
