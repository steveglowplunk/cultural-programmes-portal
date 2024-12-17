export interface Location {
    _id: string;
    venueId: string;
    venueName: string;
    latitude: string;
    longitude: string;
    eventCount: number;
    isSelected?: boolean;
    onShowDetails: (location: Location) => void;
}