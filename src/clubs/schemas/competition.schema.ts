import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type BronzeCompetitionDocument = HydratedDocument<BronzeCompetition>;

@Schema({
  collection: "bronze_competitions",
  versionKey: false,
  autoIndex: false,
})
export class BronzeCompetition {
  @Prop({ required: true })
  competition_id: string;

  @Prop()
  competition_code?: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  type?: string;

  @Prop()
  sub_type?: string;

  @Prop()
  country_name?: string;

  @Prop()
  confederation?: string;
}

export const BronzeCompetitionSchema =
  SchemaFactory.createForClass(BronzeCompetition);
