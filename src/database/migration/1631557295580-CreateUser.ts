import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUser1631557295580 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "idUser",
                        type: "int",
                        isPrimary: true,
                        isUnique: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "password_hash",
                        type: "varchar",
                    },
                    {
                        name: "age",
                        type: "int",
                    },
                    {
                        name: "height",
                        type: "double precision",
                    },
                    {
                        name: "homeTeam",
                        type: "varchar",
                        isNullable: true,
                    },

                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "NOW()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        onUpdate: "NOW()",
                        isNullable: true,
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable("users");
    }
}
