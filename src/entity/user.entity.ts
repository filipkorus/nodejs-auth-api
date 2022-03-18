import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column({
      unique: true
   })
   username!: string;

   @Column({
      unique: true
   })
   email!: string;

   @Column()
   password!: string;

   @Column()
   role!: string;

   @Column()
   account_activated!: boolean;
}