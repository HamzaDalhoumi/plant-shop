import { model } from "@medusajs/framework/utils";
import { Language } from "./types";

export enum ProblemCategory {
  PEST = "pest",
  DISEASE = "disease",
  NUTRIENT_DEFICIENCY = "nutrient_deficiency",
  WATERING_ISSUE = "watering_issue",
  LIGHT_ISSUE = "light_issue",
  TEMPERATURE_STRESS = "temperature_stress",
  ENVIRONMENTAL = "environmental",
  OTHER = "other",
}

const PlantProblem = model.define("plant_problem", {
  id: model.id().primaryKey(),

  // Link to PlantInfo
  plant_info_id: model.text(),

  // Problem details
  problem_category: model.enum(ProblemCategory),
  language: model.enum(Language),

  // Content
  problem_name: model.text(),
  symptoms: model.text(),
  causes: model.text().nullable(),
  solution: model.text(),
  prevention: model.text().nullable(),

  // Metadata
  severity_level: model.number().nullable(), // 1-5 scale
  display_order: model.number().default(0),
});

export default PlantProblem;
