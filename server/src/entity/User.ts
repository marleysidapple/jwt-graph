import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType() // -> this will help to choose which field to to expose to graphql query
//@Entity() -> this also works
@Entity("users")
export class User extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column("text") //this works too
    email: string;

    @Column()
    password: string;

    @Column("int", {default: 0})
    tokenVersion: number;

}
