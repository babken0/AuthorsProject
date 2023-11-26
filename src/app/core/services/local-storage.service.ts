import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }


  public saveDataToLS<T>(data: T[], key: string): void {
    localStorage.setItem(key, JSON.stringify(data));
  }


  public _getDataFromLS<T>(key: string): T[] {
    const valueStr = localStorage.getItem(key);
    if (valueStr && valueStr?.length > 0) {
      return JSON.parse(valueStr);
    }
    return [];
  }
}
