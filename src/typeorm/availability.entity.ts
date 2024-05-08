import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class Availability {

@PrimaryGeneratedColumn("uuid")
availabilityId: string

@Column({
    nullable: false,
    default: 0,
    name: 'weekly_hours'
})
weeklyHours: number;

@Column(
    "varchar",
    {
    nullable: false,
    default: [],
    name: 'available_days'
})
availableDays: string[];

 
@Column({
    nullable: false,
    default: '',
    name: 'currently_active'
})
  currentlyActive: string;

  @OneToOne(() => Profile, profile => profile.availability)
  @JoinColumn()
  profile: Profile;
}