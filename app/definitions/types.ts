export interface Location {
    _id: string;
    venueId: string;
    venueName: string;
    latitude: string;
    longitude: string;
    eventsCount: number;
    isSelected?: boolean;
    userName: string;
    isFavourite: boolean;
    onShowDetails: (location: Location) => void;
    onFavClick: (location: Location) => void;
}

export interface Event {
    _id: string;
    eventId: string;
    titleE: string;
    cat1: string;
    cat2: string;
    predateE: string;
    progtimeE: string;
    venueId: string;
    ageLimitE: string;
    priceE: string;
    descE: string;
    urlE: string;
    tagentUrlE: string;
    remarkE: string;
    enquiry: string;
    saleDate: string;
    interBook: string;
    presenterOrgE: string;
    progImage: string;
    detailImage1: string;
    detailImage2: string;
    detailImage3: string;
    detailImage4: string;
    detailImage5: string;
    videoLink: string;
    video2Link: string;
    submitDate: string;
    __v: number;
    isSelected: boolean;
  }