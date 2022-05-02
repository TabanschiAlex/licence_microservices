import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class createArticleTable1650970824011 implements MigrationInterface {
  private readonly table = 'articles';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema(process.env.DB_NAME, true);
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
