import { Module } from "@medusajs/framework/utils";
import PlantInfoModuleService from "./service";

export const PLANT_INFO_MODULE = "plant_info";

export default Module(PLANT_INFO_MODULE, {
  service: PlantInfoModuleService,
});

export * from "./models/types";
export * from "./models/plant-info";
export * from "./models/plant-care-tip";
export * from "./models/plant-problem";
