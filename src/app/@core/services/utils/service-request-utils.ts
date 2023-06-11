import { ServiceRequest } from "fhir/r4";
import { ServiceRequestView } from "../../models/service-request-view";
import * as utils from "./utils";
import { DayCode, TimeCode } from "../../models/types";
import { dayStringFromCode, sortDayCodes, timingToString } from "./utils";

/**
 * Maps a `ServiceRequest` into a `ServiceRequestView`, useful for displaying information.
 * @param serviceRequest
 */
export function mapToServiceRequestView(serviceRequest: ServiceRequest): ServiceRequestView {
  return {
    id: serviceRequest.id,
    patientInstruction: serviceRequest.patientInstruction ?? '',
    duration: utils.getStringDuration(serviceRequest.occurrenceTiming.repeat),
    days: getServiceRequestDays(serviceRequest),
    dayWhen: getServiceRequestTimings(serviceRequest)
  };
}

/**
 * Extracts the days on which a `ServiceRequest` is active in a single string. E.g, 'Monday, Friday, Sunday`. The days
 * are sorted from Mon to Sun
 * @param serviceRequest must have contained `ServiceRequest`, otherwise the function will return an empty string
 */
function getServiceRequestDays(serviceRequest: ServiceRequest): string {
  if (!serviceRequest.contained || !Array.isArray(serviceRequest.contained)) {
    return '';
  }

  return serviceRequest.contained
    .map((request: ServiceRequest) => request.occurrenceTiming.repeat.dayOfWeek)
    .flat()
    .sort(sortDayCodes)
    .map(dayStringFromCode)
    .join(', ');
}

/**
 * Extracts the days on which a ServiceRequest is active along with their timings. E.g.,
 * `[ { day: 'Monday', when: 'before breakfast, after breakfast' } ]`
 * @param serviceRequest must have contained ServiceRequest, otherwise the function will return an empty array
 */
function getServiceRequestTimings(serviceRequest: ServiceRequest): { day: string, when: string }[] {
  if (!serviceRequest.contained || !Array.isArray(serviceRequest.contained)) {
    return [];
  }

  return serviceRequest.contained
    .map((request: ServiceRequest) => {
      const repeat = request.occurrenceTiming.repeat;
      const dayMap = (day: DayCode) => {
        return {day, when: repeat.when as TimeCode[]}
      };

      return repeat.dayOfWeek.map(dayMap)
    })
    .flat()
    .sort((a, b) => sortDayCodes(a.day, b.day))
    .map(({day, when}) => {
      const dayString = dayStringFromCode(day);
      const whenString = when
        .map(whenCode => timingToString(whenCode))
        .join(', ');
      return {day: dayString, when: whenString}
    });
}
