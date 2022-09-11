import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { Exchange } from "./Exchange"

@Entity('Photos')
export class Photo {

    @PrimaryColumn('varchar', {
        name: 'photo_name',
        nullable: false
    })
    name: string

    @ManyToOne(() => Exchange, exchange => exchange.photos, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({
        name: 'owner',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_exchange_photo'
    })
    owner: string

}
