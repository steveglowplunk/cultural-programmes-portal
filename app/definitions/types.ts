export interface Location {
    _id: string;
    venueId: string;
    venueName: string;
    latitude: string;
    longitude: string;
    __v: number;
    isSelected?: boolean;
}