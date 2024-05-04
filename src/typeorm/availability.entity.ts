import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class Availability {

@PrimaryGeneratedColumn("uuid")
availabilityId: any

@Column({
    nullable: false,
    default: 0,
    name: 'weekly_hours'
})
weeklyHours: number;

@Column({
    nullable: false,
    default: [],
    name: 'available_days'
})
availableDays: string[];

 
@Column({
    nullable: false,
    default: '',
    name: 'currently_ctive'
})
  currentlyActive: string;

  @OneToOne(() => Profile, profile => profile.availability)
  @JoinColumn()
  profile: Profile;
}