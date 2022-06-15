import React, { useState, useEffect, useReducer } from "react";
import { useBuyLandContract } from "../../hooks/useBuyLand";
import { Property } from "../Property/Property";
import { pricesArray } from "../../config";

const createMapArray = () => {
    let allMapsArray = []
    let mapArray = []
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 20; j++) {
            mapArray.push({ id: (i * 20) + j, owner: null, type: "" , price: pricesArray[i*20 + j]})
        }
        allMapsArray.push(mapArray)
        mapArray = []
    }
    return allMapsArray
};

const splitArrayMap = createMapArray();
console.log(splitArrayMap);

const getOwners = (owners) => {
    return owners.map((value, index) => [value, index]).filter(x => x[0] !== "0x0000000000000000000000000000000000000000").map((value) => value[1])
};

const worldReducer = (owners, action) => {
    return getOwners(action.payload)
}

export const World = () => {
    const [contract, accounts] = useBuyLandContract();
    const [isMap, setIsMap] = useState(false);
    const [owners, dispatch] = useReducer(worldReducer, [])

    useEffect (() =>{
        async function fetchData(){
            if (contract) {
                try {
                    const owners_res = await contract.methods.getOwners().call()
                    dispatch( { type: "fetchOwners", payload: owners_res} )
                } catch (error) {
                    console.error("can't retrive owners")
                }

            }
        }
        fetchData()
    }, [contract, accounts])

    useEffect(() => {
        if(contract && accounts)
            setIsMap(true)
    },[contract, accounts])
    
    window.ethereum.on('disconnect', () => {
        console.log("MetaMask discconnected")
    })

    return(
        <div className="flexCol">
            {isMap ? 
                splitArrayMap.map( row => {
                    console.log(owners)
                    return (
                        <div className="flexRow">
                            {row.map(block => {
                                return(
                                    <>
                                        <Property 
                                            id = {block.id} 
                                            owner = {block.owner}
                                            price = {block.price}
                                            contract = {contract}
                                            accounts = {accounts}
                                            owners = {owners}
                                        />
                                    </>
                                )
                            })}
                        </div>
                    )

                })
            : <p>Connect to MetaMask...</p>}
        </div>

    )
}