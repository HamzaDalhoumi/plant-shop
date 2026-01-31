import { model } from "@medusajs/framework/utils";
import { Language } from "./types";

export enum Season {
  SPRING = "spring",
  SUMMER = "summer",
  AUTUMN = "autumn",
  WINTER = "winter",
  ALL_YEAR = "all_year",
}

export enum TipType {
  WATERING = "watering",
  FERTILIZING = "fertilizing",
  PRUNING = "pruning",
  REPOTTING = "repotting",
  PEST_CONTROL = "pest_control",
  GENERAL = "general",
}

const PlantCareTip = model.define("plant_care_tip", {
  id: model.id().primaryKey(),

  // Link to PlantInfo
  plant_info_id: model.text(),

  // Tip details
  season: model.enum(Season),
  tip_type: model.enum(TipType),
  language: model.enum(Language),

  // Content
  title: model.text().nullable(),
  content: model.text(),

  // Priority/ordering
  display_order: model.number().default(0),
});

export default PlantCareTip;
