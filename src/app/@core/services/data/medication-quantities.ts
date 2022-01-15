import { Quantity } from "fhir/r4";

export const MedicationQuantities: Quantity[] = [
  {
    system: "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
    code: "TAB",
    unit: "TAB",
    extension: [{
      url: 'http://localhost/unitName',
      valueString: 'Tablet(s)'
    }]
  },
  {
    system: "http://unitsofmeasure.org",
    code: "U",
    unit: "U",
    extension: [{
      url: 'http://localhost/unitName',
      valueString: 'Unit(s)'
    }]
  },
  {
    system: "http://unitsofmeasure.org",
    code: "mg",
    unit: "mg",
    extension: [{
      url: 'http://localhost/unitName',
      valueString: 'mg'
    }]
  },
  {
    system: "http://unitsofmeasure.org",
    code: "g",
    unit: "g",
    extension: [{
      url: 'http://localhost/unitName',
      valueString: 'g'
    }]
  },
  {
    system: "http://unitsofmeasure.org",
    code: "ml",
    unit: "ml",
    extension: [{
      url: 'http://localhost/unitName',
      valueString: 'ml'
    }]
  },
  {
    system: "http://unitsofmeasure.org",
    code: "IU",
    unit: "IU",
    extension: [{
      url: 'http://localhost/unitName',
      valueString: 'IU'
    }]
  }
]
