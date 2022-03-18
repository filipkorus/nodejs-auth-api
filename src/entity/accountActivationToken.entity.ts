import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class AccountActivationToken {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column()
   user_id!: number;

   @Column()
   token!: string;

   @CreateDateColumn()
   created_at!: Date;
}