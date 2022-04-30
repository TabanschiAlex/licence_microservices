import { MigrationInterface, QueryRunner, TableColumn, Table } from 'typeorm';
import { Roles } from '../../app/enums/Roles';

export class createUserTable1650966774707 implements MigrationInterface {
  private readonly table = 'users';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.table,
        columns: [
          new TableColumn({
            name: 'uuid',
            type: 'char',
            length: '36',
            isPrimary: true,
            /*generationStrategy: 'uuid',
            isGenerated: true,*/
          }),
          new TableColumn({ name: 'name', type: 'varchar', length: '150', isNullable: true }),
          new TableColumn({ name: 'email', type: 'varchar', length: '100', isUnique: true }),
          new TableColumn({ name: 'password', type: 'varchar', length: '100' }),
          new TableColumn({ name: 'role', type: 'enum', enum: [Roles.ADMIN, Roles.USER] }),
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
* create table users
(
    uuid       varchar(36)                                         not null
        primary key,
    name       varchar(150)                                        null,
    email      varchar(100)                                        not null,
    password   varchar(100)                                        not null,
    role       enum ('admin', 'user') default 'user'               not null,
    created_at datetime(6)            default current_timestamp(6) null,
    updated_at datetime(6)            default current_timestamp(6) null on update current_timestamp(6),
    constraint IDX_97672ac88f789774dd47f7c8be
        unique (email)
);
* */
