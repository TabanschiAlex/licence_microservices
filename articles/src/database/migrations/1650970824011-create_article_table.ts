import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class createArticleTable1650970824011 implements MigrationInterface {
  private readonly table = 'articles';

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
          new TableColumn({ name: 'title', type: 'varchar', length: '150' }),
          new TableColumn({ name: 'description', type: 'varchar', length: '255' }),
          new TableColumn({ name: 'text', type: 'text' }),
          new TableColumn({ name: 'user_uuid', type: 'uuid', isNullable: true }),
          new TableColumn({ name: 'created_at', type: 'datetime', isNullable: true, default: 'now()' }),
          new TableColumn({
            name: 'updated_at',
            type: 'datetime',
            isNullable: true,
            default: 'now()',
            onUpdate: 'now()',
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
create table articles
(
    id          int auto_increment
        primary key,
    title       varchar(150)                             not null,
    description varchar(255)                             not null,
    text        text                                     not null,
    created_at  datetime(6) default current_timestamp(6) null,
    updated_at  datetime(6) default current_timestamp(6) null on update current_timestamp(6),
    userUuid    varchar(36)                              null,
    constraint FK_986c626880f808696411a57f3d5
        foreign key (userUuid) references users (uuid)
);
*/
