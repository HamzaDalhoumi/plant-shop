import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260123231428 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "plant_care_tip" ("id" text not null, "plant_info_id" text not null, "season" text check ("season" in ('spring', 'summer', 'autumn', 'winter', 'all_year')) not null, "tip_type" text check ("tip_type" in ('watering', 'fertilizing', 'pruning', 'repotting', 'pest_control', 'general')) not null, "language" text check ("language" in ('en', 'fr', 'ar')) not null, "title" text null, "content" text not null, "display_order" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "plant_care_tip_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_plant_care_tip_deleted_at" ON "plant_care_tip" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "plant_info" ("id" text not null, "product_id" text not null, "scientific_name" text not null, "common_name_en" text null, "common_name_fr" text null, "common_name_ar" text null, "family" text null, "category" text check ("category" in ('indoor', 'outdoor', 'agriculture', 'decoration', 'succulent', 'herb', 'native_tunisian')) not null, "mature_height_cm" integer null, "mature_width_cm" integer null, "growth_rate" text check ("growth_rate" in ('slow', 'moderate', 'fast')) null, "foliage_type" text check ("foliage_type" in ('evergreen', 'deciduous', 'semi_evergreen')) null, "flower_colors" jsonb null, "foliage_colors" jsonb null, "bloom_seasons" jsonb null, "light_requirement" text check ("light_requirement" in ('full_sun', 'partial_sun', 'partial_shade', 'full_shade', 'indirect_light')) not null, "water_requirement" text check ("water_requirement" in ('low', 'moderate', 'high')) not null, "care_level" text check ("care_level" in ('easy', 'moderate', 'difficult', 'expert')) not null, "humidity_preference" text check ("humidity_preference" in ('low', 'moderate', 'high')) null, "temperature_min_celsius" integer null, "temperature_max_celsius" integer null, "soil_types" jsonb null, "fertilizer_frequency" text check ("fertilizer_frequency" in ('none', 'monthly', 'biweekly', 'weekly')) null, "hardiness_zones" jsonb null, "drought_tolerant" boolean not null default false, "heat_tolerant" boolean not null default false, "salt_tolerant" boolean not null default false, "wind_tolerant" boolean not null default false, "suitable_for_tunisia" boolean not null default true, "suitable_for_coastal" boolean not null default false, "suitable_for_desert" boolean not null default false, "suitable_for_mountains" boolean not null default false, "propagation_methods" jsonb null, "typical_lifespan" text null, "toxicity_pets" boolean not null default false, "toxicity_humans" boolean not null default false, "edible" boolean not null default false, "pot_sizes_available" jsonb null, "seasonality" text null, "care_tips_summary" text null, "description" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "plant_info_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_plant_info_deleted_at" ON "plant_info" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "plant_problem" ("id" text not null, "plant_info_id" text not null, "problem_category" text check ("problem_category" in ('pest', 'disease', 'nutrient_deficiency', 'watering_issue', 'light_issue', 'temperature_stress', 'environmental', 'other')) not null, "language" text check ("language" in ('en', 'fr', 'ar')) not null, "problem_name" text not null, "symptoms" text not null, "causes" text null, "solution" text not null, "prevention" text null, "severity_level" integer null, "display_order" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "plant_problem_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_plant_problem_deleted_at" ON "plant_problem" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "plant_care_tip" cascade;`);

    this.addSql(`drop table if exists "plant_info" cascade;`);

    this.addSql(`drop table if exists "plant_problem" cascade;`);
  }

}
