import { ServiceRequest } from "fhir/r4";
import { ServiceRequestView } from "../../models/service-request-view";
import * as utils from "./utils";

export function mapToServiceRequestView(serviceRequest: ServiceRequest): ServiceRequestView {
  return {
    id: serviceRequest.id,
    patientInstruction: serviceRequest.patientInstruction ?? '',
    duration: utils.getTimingStringDuration(serviceRequest.occurrenceTiming.repeat),
    days: utils.getServiceRequestDays(serviceRequest),
    dayWhen: utils.getServiceRequestTimings(serviceRequest)
  };
}
