const EARTH_RADIUS_M = 6_371_000;

const toRad = (deg) => (deg * Math.PI) / 180;

// 두 좌표 사이 대권 거리(미터). 반경 수 km 규모에서는 오차가 무시할 수준이다.
export function distanceInMeters(from, to) {
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;

  return Math.round(EARTH_RADIUS_M * 2 * Math.asin(Math.sqrt(a)));
}

export function formatDistance(meters) {
  if (meters == null) return null;
  return meters < 1000 ? `${meters}m` : `${(meters / 1000).toFixed(1)}km`;
}
