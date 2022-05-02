import { MigrationInterface, QueryRunner, TableColumn, Table } from 'typeorm';
import { Roles } from '../../app/enums/Roles';

export class createUserTable1650966774707 implements MigrationInterface {
  private readonly table = 'users';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema(process.env.DB_NAME, true);
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
