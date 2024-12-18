import { use, useEffect, useState } from 'react';
import { Location } from "@/app/definitions/types";
import { Button } from 'primereact/button';

const LocationItem = (option: Location) => {
    const [isToggled, setIsToggled] = useState(option.isFavourite);

    const handleToggle = () => {
        option.onFavClick(option);
        setIsToggled(!isToggled);
    };

    useEffect(() => {
        setIsToggled(option.isFavourite);
    }, [option.isFavourite]);

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
            <p>
                <span className='font-bold'>No. of events: </span> {option.eventsCount}
            </p>
            {option.isSelected && 
            <div className='flex space-x-2'>
                <button className='hover:underline space-x-2'
                    onClick={() => option.onShowDetails(option)}>
                    <span>Show details</span>
                    <i className='pi pi-arrow-right'></i>
                </button>
                <button className='hover:underline space-x-2'
                    onClick={() => option.onShowComments(option)}>
                    <span>Show Comments</span>
                    <i className='pi pi-comments'></i>
                </button>
            </div>}
        </div>
    );
};

export default LocationItem;