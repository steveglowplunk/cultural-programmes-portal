

interface EventDetailsProps {
    titleE: string;
    predateE: string;
    priceE: string;
    isSelected: boolean;
    onClick: (event: EventDetailsProps) => void;
}

const EventItem: React.FC<EventDetailsProps> = (event) => {
    return (
        <div
            className={`border-b border-gray-200 pb-2 ${event.isSelected ? 'bg-teal-100' : ''}`}
            onClick={() => event.onClick(event)}
        >
            <p className="text-gray-600">
                <span className="font-bold">{event.titleE}</span>
            </p>
            <p className="text-gray-600">
                <span className="font-bold">Date: </span>
                {event.predateE ? event.predateE : 'N/A'}
            </p>
            <p className="text-gray-600">
                <span className="font-bold">Price: </span>
                {event.priceE ? event.priceE : 'N/A'}
            </p>
        </div>
    );
};

export default EventItem;