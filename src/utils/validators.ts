export namespace Validation {
  export function isRequired(value: string): boolean {
    return value.trim().length > 0;
  }

  export function isUserIdValid(id: string): boolean {
    return /^\d+$/.test(id);
  }

  export function isYearValid(year: string): boolean {
    const currentYear = new Date().getFullYear();
    return /^\d{4}$/.test(year) && parseInt(year, 10) <= currentYear;
  }
}
