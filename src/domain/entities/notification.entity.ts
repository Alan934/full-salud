import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '.';
import { Base } from 'src/common/bases/base.entity';

@Entity('notifications')
export class Notification extends Base {
  @Column({
    type: 'varchar'
  })
  text: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE', // Se elimina la notificacion cuando se elimina físicamente el usuario
    nullable: false
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
