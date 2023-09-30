import { Bundle, DomainResource, Reference } from "fhir/r4";
import { PaginatedResult } from "../../models/paginatedResult";

/**
 * Extracts the ID from a `Reference`. Takes into account the FHIR specification for references to resolve contained
 * and external references.
 * @param reference
 */
export function getIdFromReference(reference: Reference): string {
  if (!reference.reference) {
    return '';
  }

  const separator = reference.reference.startsWith('#') ? '#' : '/';
  const referenceParts = reference.reference.split(separator);
  return referenceParts.length > 1 ? referenceParts[1] : '';
}

/**
 * Gets a string extension from a `DomainResource`, i.e., `Patient`, `MedicationRequest`, etc. Defaults to an empty string
 * @param resource
 * @param url the URL that the extension uses as a key. Should be already defined as a constant.
 */
export function getStringExtension(resource: DomainResource, url: string): string {
  if (!resource || !resource.extension) {
    return '';
  }

  const extIndex = resource.extension.findIndex(ext => ext.url === url)
  return extIndex >= 0
    ? resource.extension[extIndex].valueString ?? ''
    : '';
}

/**
 * Gets a Code extension from a `DomainResource`, e.g., a timing code ('ACD'). Defaults to an empty string
 * @param resource
 * @param url the URL that the extension uses as a key. Should be already defined as a constant.
 */
export function getCodeExtension(resource: DomainResource, url: string): string {
  if (!resource || !resource.extension) {
    return '';
  }

  const extIndex = resource.extension.findIndex(ext => ext.url === url)
  return extIndex >= 0
    ? resource.extension[extIndex].valueCode ?? ''
    : '';
}

/**
 * Sets a string extension in a `DomainResource`
 * @param resource
 * @param url the URL that the extension uses as a key. Should be already defined as a constant.
 * @param value
 */
export function setStringExtension(resource: DomainResource, url: string, value: string): void {
  setExtension(resource, url, value, 'string');
}

/**
 * Sets a Code extension in a `DomainResource`
 * @param resource
 * @param url the URL that the extension uses as a key. Should be already defined as a constant.
 * @param value a FHIR Code in string format, e.g., a timing code ('ACD')
 */
export function setCodeExtension(resource: DomainResource, url: string, value: string): void {
  setExtension(resource, url, value, 'code');
}

/**
 * Converts a search result into a `PaginatedResult`
 * @param bundle the `Bundle` which contains the resource results
 * @param remaining how many results are remaining
 * @param lastCursor the ID of a resource to be used as a cursor
 */
export function getPaginatedResult(bundle: Bundle, remaining: number, lastCursor: string): PaginatedResult<any> {
  if (!bundle.entry) {
    return getEmptyPaginatedResult();
  }

  return {
    totalResults: bundle.total ?? bundle.entry.length,
    lastDataCursor: lastCursor,
    remainingCount: remaining,
    results: bundle.entry.map(entry => entry.resource)
  };
}

function getEmptyPaginatedResult(): PaginatedResult<[]> {
  return {
    totalResults: 0,
    remainingCount: 0,
    lastDataCursor: null,
    results: []
  }
}

function setExtension(
  resource: DomainResource,
  url: string,
  value: string,
  type: ('string' | 'code')
) {
  if (!resource || !url || url.length === 0 || !value || value.length === 0) {
    return;
  }

  let extValue;
  switch (type) {
    case "string":
      extValue = {valueString: value}
      break;
    case "code":
      extValue = {valueCode: value}
      break;
  }

  resource.extension ??= [];
  const extensionEntry = {
    url: url,
    ...extValue
  }
  const extIndex = resource.extension.findIndex(ext => ext.url === url)

  if (!isNaN(extIndex) && extIndex >= 0) {
    resource.extension[extIndex] = extensionEntry;
    return;
  }

  resource.extension.push(extensionEntry);
}
