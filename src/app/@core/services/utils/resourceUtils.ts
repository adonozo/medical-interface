import {
  Bundle,
  DomainResource,
  Reference
} from "fhir/r4";
import { PaginatedResult } from "../../models/paginatedResult";

export class ResourceUtils {

  static getIdFromReference(reference: Reference): string {
    const separator = reference.reference.startsWith('#') ? '#' : '/';
    const referenceParts = reference.reference.split(separator);
    if (referenceParts.length > 1) {
      return referenceParts[1];
    }

    return '';
  }

  static getStringExtension(resource: DomainResource, url: string): string {
    const extIndex = resource?.extension?.findIndex(ext => ext.url === url)
    return !isNaN(extIndex) && extIndex >= 0 ? resource.extension[extIndex].valueString : "";
  }

  static getCodeExtension(resource: DomainResource, url: string): string {
    const extIndex = resource?.extension?.findIndex(ext => ext.url === url)
    return !isNaN(extIndex) && extIndex >= 0 ? resource.extension[extIndex].valueCode : "";
  }

  static setStringExtension(resource: DomainResource, url: string, value: string): void {
    this.setExtension(resource, url, value, 'string');
  }

  static setCodeExtension(resource: DomainResource, url: string, value: string): void {
    this.setExtension(resource, url, value, 'code');
  }

  static getPaginatedResult(bundle: Bundle, remaining: number, lastCursor: string): PaginatedResult<any> {
    if (!bundle.entry) {
      return this.getEmptyPaginatedResult();
    }

    return {
      totalResults: bundle.total,
      lastDataCursor: lastCursor,
      remainingCount: remaining,
      results: bundle.entry.map(entry => entry.resource)
    };
  }

  static getEmptyPaginatedResult(): PaginatedResult<[]> {
    return {
      totalResults: 0,
      remainingCount: 0,
      lastDataCursor: null,
      results: []
    }
  }

  private static setExtension(
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
}
