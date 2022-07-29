import React, {useEffect, useReducer, useState} from "react";
import PropertyPopUp from "../PropertyPopUp/PropertyPopUp";
import "./Property.css"

export const ACTIONS = {Bought: 'setBought', Road: "setRoad", Park: 'setPark', Available: 'setAvailable', NewPrice: 'setNewPrice'}

const roads = [
            4, 17, //0-19
            23, 26, 29, 32, 34, 37, //20-39 
            40,41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, //40-59
            61, 72, 75, //60-79
            81, 92, 95, // 80-99
            100,101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, //100-119
            121,123,125, //120-139
            141,145,151,152,153,156,157, //140-159
            161,164,165,169,170,171,173,176, //160-179
            181,185,191,193,194,195,196,197,198,199, // 180-199
            200,201,202,205,206,207,211,213, // 200-219
            221,225,,231,233, // 220-239
            241,245,251,253,254,255,256,257,258, // 240-259
            261,265,266,267,268,269,270,271,273,278, // 260-279
            281,282,283,284,285,291,292,293,298, //280-299
            305,312,315,316,317,318,//300-319
            325,332,333,336,//320-339
            345,353,356,//340-359
            365,366,367,368,369,370,371,372,373,376,377,378,379,//360-379
            385,395,//380-399
            414,//400-419
            433,//420-439
            440,441,442,443,444,445,446,447,448,449,450,451,452,//440-459
            465,472,//460-479
            485,493,//480-499
            505,514,//500-519
            525,535,//520-539
            545,555,//540-559
            565,575,//560-579
            585,595,//580-599
            605,615,616,617,618,619,//600-619
            625,634,//620-639
            645,653,//640-659
            665,672,//660-679
            685,686,687,688,689,690,691,//680-699
            704,,712,723,733,742,754,761,775,780,796//700-719


]
const parks = [
    18, 19, //0-20
    38, 39, //20-39
    58, 59, //40-59
    76, 77, 78, 79, //60-79
    96, 97, 98, 99, //80-99
    287,//280-299
    307,308,//300-319
    327,328,//320-339
    347,348,349,,//340-359
    //Tot: 38
]



const propertyReducer = (property, action) => {
    switch (action.type) {
        case ACTIONS.Bought:
            return {...property, pType: "house", isOwned: true, isBuyable: true}
        case ACTIONS.Road:
            return {...property, pType: "road", isBuyable: false}
        case ACTIONS.Park:
            return {...property, pType:"park", isBuyable: false}
        case ACTIONS.Available:
            return {...property, pType: "available", isBuyable: true}
        case ACTIONS.NewPrice:
            return {...property, price: action.newPrice}
        default:
            return property;
    }
}

const Property = (props) => {
    const INITIAL_STATE = {
        id: props.id,
        price: props.price,
        isOwned: false,
        isBuyable: false,
    };
    const [popup, setPopup] = useState(false);
    const [property, dispatch] = useReducer(propertyReducer, INITIAL_STATE);
    const hexId = `0x00000000000000000000000000000000000000${props.id.toString(16)}`;
    const owners = props.owners
    const setProperty = async () => {
        if (props.contract) {
            try {
                if (owners.includes(props.id)) {
                    dispatch( {type: ACTIONS.Bought})
                } else {
                    if (roads.includes(props.id)){
                        dispatch({type: ACTIONS.Road})
                    } else {
                        if (parks.includes(props.id)){
                            dispatch({type: ACTIONS.Park})
                        } else {
                            if (!owners.includes(props.id)) {
                                dispatch( {type: ACTIONS.Available})
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(error + "/n can't retrive information")
            }
        }
    }

    useEffect( () => {
        setProperty()
    }, [owners])

    const handlePopup = () => {
        if (property.isBuyable) {
            console.log(property);
            setPopup(true);
        } else {
            console.log(`${props.id}- is of type ${property.pType}`);
        }
    }

    const handleClosePopup = () => {
        setPopup(false);
    }

    return (
        <div >
            <button className={` size ${property.pType}`} onClick={handlePopup}></button>
            {popup ? 
                <PropertyPopUp 
                id={props.id}
                hexId={hexId}
                contract={props.contract} 
                account={props.accounts} 
                price={property.price} 
                isOwned1={property.isOwned}
                dispatch={dispatch}
                closePopup={handleClosePopup}
                />
            : ""}     
        </div>
    )
}

export default Property