from math import asin, cos, radians, sin, sqrt


def route_eta(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float) -> dict:
    earth_radius = 6371
    d_lat = radians(dest_lat - origin_lat)
    d_lng = radians(dest_lng - origin_lng)
    h = sin(d_lat / 2) ** 2 + cos(radians(origin_lat)) * cos(radians(dest_lat)) * sin(d_lng / 2) ** 2
    km = 2 * earth_radius * asin(sqrt(h))
    eta = round((km / 22) * 60 + 8)
    return {
        "provider": "Ola Maps compatible adapter",
        "distanceKm": round(km, 1),
        "etaMinutes": eta,
        "routeMode": "fastest",
    }
