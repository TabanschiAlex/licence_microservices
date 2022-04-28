import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

/*  @ManyToOne(() => User, (user) => user.articles, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @OneToMany(() => Review, (reviews) => reviews.article)
  reviews: Review[];*/

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
