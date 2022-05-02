import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class createReviewTable1650971550804 implements MigrationInterface {
  private readonly table = 'reviews';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.table,
        columns: [
          new TableColumn({
            name: 'id',
            type: 'int',
            isPrimary: true,
            generationStrategy: 'increment',
            isGenerated: true,
            unsigned: true,
          }),
          new TableColumn({ name: 'text', type: 'text' }),
          new TableColumn({ name: 'article_id', type: 'int', isNullable: true, unsigned: true }),
          new TableColumn({ name: 'user_uuid', type: 'uuid', isNullable: true }),
          new TableColumn({ name: 'created_at', type: 'datetime', isNullable: true, default: 'current_timestamp(6)' }),
          new TableColumn({
            name: 'updated_at',
            type: 'datetime',
            isNullable: true,
            default: 'current_timestamp(6)',
            onUpdate: 'current_timestamp(6)',
          }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}

/*
* create table reviews
(
    id         int auto_increment
        primary key,
    text       text                                     not null,
    created_at datetime(6) default current_timestamp(6) null,
    updated_at datetime(6) default current_timestamp(6) null on update current_timestamp(6),
    userUuid   varchar(36)                              null,
    articleId  int                                      null,
    constraint FK_90cde62258ae42ffff87ecadb53
        foreign key (userUuid) references users (uuid),
    constraint FK_a1ddd42718529c74f6848179530
        foreign key (articleId) references posts (id)
);
* */
