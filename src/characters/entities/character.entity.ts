import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Character extends Document {

    @Prop({
        unique:true,
        index: true
    })
    name: string;

    @Prop({
        index: true
    })
    lastName: string;

    @Prop({
        index: true
    })
    birth_date: string;

    @Prop({ 
        index: true
    })
    death: string;

    @Prop({
        index:true
    })
    createdAt: number;
    
    @Prop({
        index: true
    })
    updatedAt?: number

};

export const CharacterSchema = SchemaFactory.createForClass( Character );
