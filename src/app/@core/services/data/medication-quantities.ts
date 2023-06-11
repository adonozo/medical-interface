import { Quantity } from "fhir/r4";
import { Extensions } from "./constants";

export const MedicationQuantities: Quantity[] = [
  {
    system: "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
    code: "TAB",
    unit: "TAB",
    extension: [{
      url: Extensions.QUANTITY_UNIT_NAME,
      valueString: 'Tablet(s)'
    }]
  },
  {
    system: "http://unitsofmeasure.org",
    code: "U",
    unit: "U",
    extension: [{
      url: Extensions.QUANTITY_UNIT_NAME,
      valueString: 'Unit(s)'
    }]
  },
  {
    system: "http://unitsofmeasure.org",
    code: "mg",
    unit: "mg",
    extension: [{
      url: Extensions.QUANTITY_UNIT_NAME,
      valueString: 'mg'
    }]
  },
  {
    system: "http://unitsofmeasure.org",
    code: "g",
    unit: "g",
    extension: [{
      url: Extensions.QUANTITY_UNIT_NAME,
      valueString: 'g'
    }]
  },
  {
    system: "http://unitsofmeasure.org",
    code: "ml",
    unit: "ml",
    extension: [{
      url: Extensions.QUANTITY_UNIT_NAME,
      valueString: 'ml'
    }]
  },
  {
    system: "http://unitsofmeasure.org",
    code: "IU",
    unit: "IU",
    extension: [{
      url: Extensions.QUANTITY_UNIT_NAME,
      valueString: 'IU'
    }]
  }
]
