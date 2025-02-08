import { Base } from '../../common/bases/base.entity';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
} from 'typeorm';
import {
    Medication,
    Patient,
    Practitioner,
} from '.';

@Entity('medication_request')
export class MedicationRequest extends Base {

    @Column({
        type: 'varchar',
        nullable: false
    })
    indications: string;
    @Column({
        type: 'varchar',
        nullable: false
    })
    diagnosis: string;

    @Column({
        type: 'boolean',
        nullable: false,
        name: 'is_valid_signature',
        default: false
    })
    isValidSignature: boolean;

    @ManyToOne(() => Practitioner)
    @JoinColumn({ name: 'practitioner_id' })
    practitioner: Practitioner;

    @ManyToOne(() => Patient)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;

    @ManyToMany(() => Medication, (medicine) => medicine.id)
    @JoinTable()
    medicines: Medication[];

}
