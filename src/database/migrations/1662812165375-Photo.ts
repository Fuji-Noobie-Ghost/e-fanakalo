import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Photos1662812165375 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        return await queryRunner.createTable(new Table({
            name: 'Photos',
            columns: [
                {
                    name: 'photo_name',
                    type: 'varchar',
                    isPrimary: true,
                    primaryKeyConstraintName: 'pk_photo',
                    isNullable: false
                },
                {
                    name: 'owner',
                    type: 'uuid',
                    isNullable: false,
                    foreignKeyConstraintName: 'fk_exchange_photo'
                }
            ],
            foreignKeys: [
                {
                    name: 'fk_exchange_photo',
                    columnNames: ['owner'],
                    referencedTableName: 'Exchanges',
                    referencedColumnNames: ['id_ex'],
                    onDelete: 'CASCADE'
                }
            ]
        }), true)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        return await queryRunner.dropTable('Photos', true)
    }

}

