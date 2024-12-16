import { useState } from 'react';
import { Location } from "@/app/definitions/types";
import { Button } from 'primereact/button';

const LocationItem = (option: Location) => {
    const [isToggled, setIsToggled] = useState(false);

    const handleToggle = () => {
        setIsToggled(!isToggled);
    };

    return (
        <div className='border-b border-gray-200 pb-2'>
            <div className=" flex justify-between items-center">
                <div>
                    <div>{option.venueName}</div>
                </div>
                <Button
                    icon={isToggled ? 'pi pi-heart-fill' : 'pi pi-heart'}
                    className="p-button-text"
                    onClick={handleToggle}
                />
            </div>
            {option.isSelected && <button className='hover:underline space-x-2'>
                <span>Show details</span>
                <i className='pi pi-arrow-right'></i>
            </button>}
        </div>
    );
};

export default LocationItem;