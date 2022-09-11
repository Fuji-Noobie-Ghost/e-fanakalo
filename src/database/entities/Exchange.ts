import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Photo } from './Photo'

// TypeORM Entity Model Configuration for Table Exchanges

@Entity('Exchanges')
export class Exchange {

    @PrimaryGeneratedColumn('uuid', {
        name: 'id_ex',
        primaryKeyConstraintName: 'pk_exchange'
    })
    id: string

    @Column('varchar', {
        name: 'user_name',
        length: 100,
        nullable: false
    })
    username: string

    @Column('varchar', {
        name: 'contact',
        length: 20,
        nullable: false
    })
    contact: string

    @Column('varchar', {
        name: 'title',
        length: 100,
        nullable: false
    })
    title: string

    @Column('text', {
        name: 'search_for',
        nullable: false
    })
    searchFor: string

    @Column('time with time zone', {
        name: 'created_at',
        default: new Date()
    })
    createdAt: Date

    @Column('time with time zone', {
        name: 'updated_at',
        default: new Date()
    })
    updatedAt: Date

    @Column('char', {
        name: 'is_active',
        length: 1,
        default: 'Y'
    })
    isActive: string

    @OneToMany(() => Photo, photo => photo.owner, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    photos: Photo[]

}
