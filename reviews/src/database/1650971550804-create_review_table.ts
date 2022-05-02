import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class createReviewTable1650971550804 implements MigrationInterface {
  private readonly table = 'reviews';

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
          new TableColumn({ name: 'text', type: 'text' }),
          new TableColumn({ name: 'article_id', type: 'int', unsigned: true }),
          new TableColumn({ name: 'user_uuid', type: 'char', length: '36' }),
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
