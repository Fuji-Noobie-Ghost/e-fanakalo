import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class Exchange1662812126004 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        return await queryRunner.createTable(new Table({
            name: 'Exchanges',
            columns: [
                {
                    name: 'id_ex',
                    type: 'uuid',
                    isGenerated: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                    isNullable: false,
                    isPrimary: true,
                    primaryKeyConstraintName: 'pk_exchange'
                },
                {
                    name: 'user_name',
                    type: 'varchar',
                    length: '100',
                    isNullable: false
                },
                {
                    name: 'contact',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'title',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'search_for',
                    type: 'text',
                    isNullable: false
                },
                {
                    name: 'created_at',
                    type: 'timestamp with time zone',
                    isNullable: false,
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'updated_at',
                    type: 'timestamp with time zone',
                    isNullable: false,
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'is_active',
                    type: 'char',
                    length: '1',
                    default: '\'Y\'',
                    isNullable: false
                }
            ]
        }), true)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        return await queryRunner.dropTable('Exchanges', true)
    }

}
