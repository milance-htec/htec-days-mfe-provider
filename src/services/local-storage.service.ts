export class CacheService {
  static setProperty(name: string, value: any) {
    localStorage.setItem(name, value);
  }

  static getProperty(name: string) {
    return localStorage.getItem(name);
  }

  static clearCache() {
    localStorage.clear();
  }

  static removeProperty(name: string) {
    localStorage.removeItem(name);
  }
}
