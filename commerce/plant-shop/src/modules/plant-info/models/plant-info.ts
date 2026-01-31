import { model } from "@medusajs/framework/utils";

// Enums for plant attributes
export enum PlantCategory {
  INDOOR = "indoor",
  OUTDOOR = "outdoor",
  AGRICULTURE = "agriculture",
  DECORATION = "decoration",
  SUCCULENT = "succulent",
  HERB = "herb",
  NATIVE_TUNISIAN = "native_tunisian",
}

export enum GrowthRate {
  SLOW = "slow",
  MODERATE = "moderate",
  FAST = "fast",
}

export enum FoliageType {
  EVERGREEN = "evergreen",
  DECIDUOUS = "deciduous",
  SEMI_EVERGREEN = "semi_evergreen",
}

export enum LightRequirement {
  FULL_SUN = "full_sun",
  PARTIAL_SUN = "partial_sun",
  PARTIAL_SHADE = "partial_shade",
  FULL_SHADE = "full_shade",
  INDIRECT_LIGHT = "indirect_light",
}

export enum WaterRequirement {
  LOW = "low",
  MODERATE = "moderate",
  HIGH = "high",
}

export enum CareLevel {
  EASY = "easy",
  MODERATE = "moderate",
  DIFFICULT = "difficult",
  EXPERT = "expert",
}

export enum HumidityPreference {
  LOW = "low",
  MODERATE = "moderate",
  HIGH = "high",
}

export enum FertilizerFrequency {
  NONE = "none",
  MONTHLY = "monthly",
  BIWEEKLY = "biweekly",
  WEEKLY = "weekly",
}

const PlantInfo = model.define("plant_info", {
  id: model.id().primaryKey(),

  // Link to Medusa product
  product_id: model.text(),

  // Classification
  scientific_name: model.text(),
  common_name_en: model.text().nullable(),
  common_name_fr: model.text().nullable(),
  common_name_ar: model.text().nullable(),
  family: model.text().nullable(),
  category: model.enum(PlantCategory),

  // Physical Characteristics
  mature_height_cm: model.number().nullable(),
  mature_width_cm: model.number().nullable(),
  growth_rate: model.enum(GrowthRate).nullable(),
  foliage_type: model.enum(FoliageType).nullable(),
  flower_colors: model.json().nullable(), // Array of colors
  foliage_colors: model.json().nullable(), // Array of colors
  bloom_seasons: model.json().nullable(), // Array of seasons

  // Care Requirements
  light_requirement: model.enum(LightRequirement),
  water_requirement: model.enum(WaterRequirement),
  care_level: model.enum(CareLevel),
  humidity_preference: model.enum(HumidityPreference).nullable(),
  temperature_min_celsius: model.number().nullable(),
  temperature_max_celsius: model.number().nullable(),
  soil_types: model.json().nullable(), // Array of soil types
  fertilizer_frequency: model.enum(FertilizerFrequency).nullable(),

  // Climate & Location
  hardiness_zones: model.json().nullable(), // Array of zones
  drought_tolerant: model.boolean().default(false),
  heat_tolerant: model.boolean().default(false),
  salt_tolerant: model.boolean().default(false),
  wind_tolerant: model.boolean().default(false),
  suitable_for_tunisia: model.boolean().default(true),
  suitable_for_coastal: model.boolean().default(false),
  suitable_for_desert: model.boolean().default(false),
  suitable_for_mountains: model.boolean().default(false),

  // Growing Information
  propagation_methods: model.json().nullable(), // Array of methods
  typical_lifespan: model.text().nullable(),
  toxicity_pets: model.boolean().default(false),
  toxicity_humans: model.boolean().default(false),
  edible: model.boolean().default(false),

  // Commercial Info
  pot_sizes_available: model.json().nullable(), // Array of pot sizes
  seasonality: model.text().nullable(),

  // Additional info
  care_tips_summary: model.text().nullable(),
  description: model.text().nullable(),
});

export default PlantInfo;
