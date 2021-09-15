import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate,
} from "typeorm";
import {
    IsEmail,
    IsNumber,
    IsString,
    MaxLength,
    Length,
    Min,
} from "class-validator";
import { compare, hash } from "bcrypt";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn("increment")
    idUser: number;

    @Column("varchar")
    @Length(2, 100)
    @IsString()
    name: string;

    @Column("varchar", { unique: true })
    @Length(3, 100)
    @IsEmail()
    email: string;

    @Column("varchar", { name: "password_hash" })
    @Length(6, 100)
    @IsString()
    password: string;

    @Column("int")
    @Min(0,)
    @IsNumber()
    age: number;

    @Column("double precision")
    @Min(0)
    @IsNumber()
    height: number;

    @Column("varchar", { nullable: true })
    @MaxLength(100)
    @IsString()
    homeTeam: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async passwordHash() {
        if (this.password) this.password = await hash(this.password, 15);
    }

    async passwordValidate(password: string) {
        const isEquals = await compare(password, this.password);
        return isEquals;
    }
}
