import argon2 from 'argon2';
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany
} from "typeorm";
import { Listing } from "./Listing";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id: string;

  @Column("varchar", { length: 255 })
  name: string;

  @Column("varchar", { length: 255 })
  email: string;

  @Column("text") password: string;

  @Column("boolean", { default: false })
  confirmed: boolean;

  @Column("boolean", { default: false })
  forgotPasswordLocked: boolean;

  @OneToMany(() => Listing, listing => listing.user)
  listings: Listing[];

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await argon2.hash(this.password);
  }
}