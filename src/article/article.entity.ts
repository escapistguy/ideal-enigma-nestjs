import { UserEntity } from "@app/user/user.entity";
import { BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'articles'})
export class ArticleEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

    @Column()
    title: string;

    @Column({default: ''})
    description: string;

    @Column({default: ''})
    body: string;

    @Column({type: 'timestamp', default: ()=> 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type: 'timestamp', default: ()=> 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @Column({default: 0})
    favoritesCount: number;   

    @Column('simple-array')
    tagList: string[];

    @BeforeUpdate()
    updateTimestamp(){
        this.updatedAt = new Date();
    }

    @ManyToOne(()=>UserEntity, (user) => user.articles, { eager: true })
    @JoinColumn()
    author: UserEntity;
}