import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    ManyToOne,
  } from "typeorm";
  import { User } from "./User";
  
  @Entity("listings")
  export class Listing extends BaseEntity {
    @PrimaryGeneratedColumn("uuid") id: string;
  
    @Column("varchar", { length: 100 })
    make: string;
  
    @Column("varchar", { length: 100 })
    model: string;

    @Column("int")
    year: number;
  
    @Column("text", { nullable: true, array: true })
    pictureUrl: string[];
  
    @Column("varchar", { length: 1000 })
    description: string;
  
    @Column("double precision") price: number;
  
    @Column("double precision") latitude: number;
  
    @Column("double precision") longitude: number;
  
    @Column("text", { array: true })
    features: string[];
  
    @Column("uuid") userId: string;
  
    @ManyToOne(() => User, user => user.listings)
    user: User;
}
  