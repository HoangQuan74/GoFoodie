export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Implement distance calculation using Haversine formula
  const R = 6371; // Radius of the earth in km
  const dLat = this.deg2rad(lat2 - lat1);
  const dLon = this.deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km

  // Limit the maximum distance to 10 km
  const MAX_DISTANCE = 10; // Maximum distance in km
  return d <= MAX_DISTANCE ? d : Infinity; // Return Infinity if distance exceeds 10 km
}

export function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
