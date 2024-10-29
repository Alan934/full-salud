import { Base } from 'src/common/bases/base.entity';
import { Column, Entity, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { Specialist, Tag } from '.';
import { ApiProperty } from '@nestjs/swagger';

@Entity('specialities')
export class Speciality extends Base {
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false
  })
  @ApiProperty({ example: 'Medicina Clínica' })
  name: string;

  @Column({
    type: 'boolean',
    nullable: false,
    name: 'can_prescribe'
  })
  canPrescribe: boolean;

  @OneToMany(() => Specialist, (specialist) => specialist.speciality)
  specialists: Specialist[];

  @ManyToMany(() => Tag, {
    eager: true,
    cascade: true,
    orphanedRowAction: 'soft-delete'
  })
  @JoinTable({
    name: 'specialities_tags',
    joinColumn: {
      name: 'speciality_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id'
    }
  })
  tags: Tag[];
}
