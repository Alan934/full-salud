import { Base } from "../../common/bases/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Practitioner } from "./Practitioner.entity";
import { Patient } from "./patient.entity";

@Entity('favorite')
export class Favorite extends Base{
    @Column({
        type: 'boolean',
        default:true
    })
    enabled: boolean

    @ManyToOne(()=> Patient, (patient) => patient.favorites, )
    @JoinColumn({name: 'patien_id'})
    patient: Patient

    @ManyToOne(() => Practitioner, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'practitioner_id' })
    practitioner: Practitioner;

}