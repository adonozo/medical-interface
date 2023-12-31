export const ResourcePath = {
  PATIENT: "Patient/",
  MEDICATION: "Medication/"
}

export const ResourceType = {
  MedicationRequest: 'MedicationRequest',
  ServiceRequest: 'ServiceRequest',
  Medication: 'Medication'
}

export const Extensions = {
  EMAIL: "http://hl7.org/fhir/StructureDefinition/Email",
  INSULIN_FLAG: "http://diabetes-assistant.com/fhir/StructureDefinition/InsulinFlag",
  ALEXA_ID: "http://diabetes-assistant.com/fhir/StructureDefinition/AlexaId",
  RESOURCE_TIMING: "http://diabetes-assistant.com/fhir/StructureDefinition/ObservationTiming",
  QUANTITY_UNIT_NAME: "http://diabetes-assistant.com/fhir/StructureDefinition/QuantityUnitName",
}

export const Headers = {
  PAGINATION_LAST: 'Pagination-Last',
  REMAINING_COUNT: 'Pagination-Remaining'
}
