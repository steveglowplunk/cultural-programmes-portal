import { useEffect, useState } from "react";
import { Location, Event } from "@/app/definitions/types";
import axios from "axios";
import EventItem from "./EventItem";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

interface LocationDetailsPanelProps {
    onBack: () => void;
    location: Location | null;
}

const LocationDetailsPanel = ({ onBack, location }: LocationDetailsPanelProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setIsVisible(true);

        const fetchEvent = async () => {
            try {
                await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/event/venue/${location?.venueId}`).then((res) => {
                    const eventsWithSelection = res.data.map((event: Event) => ({
                        ...event,
                        isSelected: false,
                    }));
                    setEvents(eventsWithSelection);
                });
            } catch (err) {
                console.log(err);
            }
        };

        fetchEvent();
    }, [location?.venueId]);

    const handleOnClick = (clickedEvent: Event) => {
        const updatedEvents = events.map((event) =>
            event.eventId === clickedEvent.eventId
                ? { ...event, isSelected: true }
                : { ...event, isSelected: false }
        );
        setEvents(updatedEvents);
        setSelectedEvent(clickedEvent);
    };

    const filteredEvents = events.filter(event =>
        event.titleE.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!location) {
        return (
            <div className={`w-96 h-[600px] overflow-y-auto transition-transform transform ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
                <button className="space-x-2 [&>*]:text-lg my-2 hover:underline" onClick={onBack}>
                    <i className="pi pi-arrow-left" />
                    <span>Back to List</span>
                </button>
                <h2 className="text-xl font-bold">No location selected</h2>
            </div>
        );
    }

    return (
        <div className={`w-[30rem] h-[600px] px-2 overflow-y-auto transition-transform transform ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
            <Dialog header="Event Details" visible={selectedEvent !== null} onHide={() => setSelectedEvent(null)}
                className="w-[52rem]" modal={false} position="right">
                <div className="space-y-2">
                    <div>
                        <p className="font-bold text-cyan-700">Programme Title</p>
                        <p>{selectedEvent?.titleE || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-bold text-cyan-700">Date</p>
                        <p>
                            {selectedEvent?.predateE || "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="font-bold text-cyan-700">Duration</p>
                        <p>
                            {selectedEvent?.progtimeE || "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="font-bold text-cyan-700">Venue</p>
                        <p>
                            {location?.venueName || "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="font-bold text-cyan-700">Price</p>
                        <p>
                            {selectedEvent?.priceE || "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="font-bold text-cyan-700">More Details</p>
                        {selectedEvent?.urlE ? (
                            <a href={selectedEvent.urlE} target="_blank" rel="noopener noreferrer"
                                className="text-blue-600 hover:underline">
                                {selectedEvent.urlE}
                            </a>
                        ) : (
                            <p>N/A</p>
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-cyan-700">Presenter</p>
                        <p>{selectedEvent?.presenterOrgE || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-bold text-cyan-700">Description</p>
                        <p>{selectedEvent?.descE || "N/A"}</p>
                    </div>
                </div>
            </Dialog>
            <button className="space-x-2 [&>*]:text-lg my-2 hover:underline" onClick={onBack}>
                <i className="pi pi-arrow-left" />
                <span>Back to List</span>
            </button>
            <div>
                <p className="text-xl font-bold">{location.venueName}</p>
                <p className="text-gray-600">
                    <span className="font-bold">Number of Events: </span>
                    {location.eventsCount}
                </p>
                <hr className="border-gray-300 my-2" />
                <p className="font-bold text-lg mb-3">Events</p>
                <InputText
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <div className="space-y-2">
                    {filteredEvents.map((event, index) => (
                        <EventItem
                            key={index}
                            titleE={event.titleE}
                            predateE={event.predateE}
                            priceE={event.priceE}
                            isSelected={event.isSelected}
                            onClick={() => handleOnClick(event)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LocationDetailsPanel;