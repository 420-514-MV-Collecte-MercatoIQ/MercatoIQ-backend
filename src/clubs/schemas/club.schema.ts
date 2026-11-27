import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type BronzeClubDocument = HydratedDocument<BronzeClub>;

// Lecture seule : le pipeline remplit la collection et ses index
@Schema({ collection: "bronze_clubs", versionKey: false, autoIndex: false })
export class BronzeClub {
  @Prop({ required: true })
  club_id: number;

  @Prop()
  club_code?: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  domestic_competition_id?: string;

  @Prop()
  squad_size?: number;

  @Prop()
  average_age?: number;

  @Prop()
  stadium_name?: string;

  @Prop()
  stadium_seats?: number;

  @Prop()
  coach_name?: string;

  @Prop()
  last_season?: number;
}

export const BronzeClubSchema = SchemaFactory.createForClass(BronzeClub);
