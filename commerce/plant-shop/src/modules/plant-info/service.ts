import { MedusaService } from "@medusajs/framework/utils";
import PlantInfo from "./models/plant-info";
import PlantCareTip from "./models/plant-care-tip";
import PlantProblem from "./models/plant-problem";

class PlantInfoModuleService extends MedusaService({
  PlantInfo,
  PlantCareTip,
  PlantProblem,
}) {}

export default PlantInfoModuleService;
