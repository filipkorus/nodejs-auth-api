import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Post {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column()
   title!: string;

   @Column('text')
   body!: string;

   @Column()
   user_id!: number;

   @CreateDateColumn()
   created_at!: Date;
}