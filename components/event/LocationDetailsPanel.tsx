import { useEffect, useState } from "react";
import { Location } from "@/app/definitions/types";

interface LocationDetailsPanelProps {
    onBack: () => void;
    location: Location | null;
}

const LocationDetailsPanel = ({ onBack, location }: LocationDetailsPanelProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

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
        <div className={`w-96 h-[600px] overflow-y-auto transition-transform transform ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
            <button className="space-x-2 [&>*]:text-lg my-2 hover:underline" onClick={onBack}>
                <i className="pi pi-arrow-left" />
                <span>Back to List</span>
            </button>
            <div>
                <p className="text-xl font-bold">{location.venueName}</p>
                <p className="text-gray-500">
                    <span className="font-bold text-black">Number of Events: </span>
                    {location.eventCount}
                </p>
                {/* Add more details as needed */}
            </div>
        </div>
    );
};

export default LocationDetailsPanel;