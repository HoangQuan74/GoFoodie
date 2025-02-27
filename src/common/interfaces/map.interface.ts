export interface ILocation {
  lat: number;
  lng: number;
}

export interface IDistanceAndDuration {
  distance: number;
  duration: number;
}

export interface IAddress {
  address: string;
  lat: number;
  lng: number;
  building: string;
  gate: string;
}
