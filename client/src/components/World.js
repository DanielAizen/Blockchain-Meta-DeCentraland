import React, { useState, useEffect } from "react";
import { useBuyLandContract } from "../hooks/useBuyLand";
import { pricesArray } from "../config";
import "./World.css"

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
const getOwnersArray = (owners) => {
    return owners.map((value, index) => [value, index]).filter(x => x[0] !== "0x0000000000000000000000000000000000000000").map((value) => value[1])
};

export const World = () => {
    const [contract, accounts] = useBuyLandContract();
    const [isMap, setIsMap] = useState(false);
    const [owners, setOwners] = useState([])
    // const buyLand = async (price) => {
    //     console.log("contract: ", contract);
    //     console.log("account: ", accounts);
    //     try {
    //         const tId = 1
    //         // const hexId = `0x00000000000000000000000000000000000000${props.id.toString(16)}`
    //         const hexId = `0x00000000000000000000000000000000000000${tId.toString(16)}`
    //         const priceInEther = price / 1000000000000000000

    //     //    await contract.methods.buy(hexId, priceInEther).send({ value: price })
    //     // const newOwner = await contract.methods.getOwner(id).call()
    //         // const newOwner = await contract.methods.getOwner(tId).call()
    //     //     if (newOwner === account[0]) {
    //     //        console.log("new owner: ", newOwner);
    //     //     //    dispatch({ type: ACTIONS.AsOwned })
    //     //     //    dispatchPopup({ type: POPUP_ACTIONS.isOwned })
    //     //    }
    //         const owners = await contract.methods.getOwners().call()
    //         console.log(owners);
    //    } catch (err) {
    //        console.log(err);
    //    }
    // }

    useEffect (() =>{
        async function fetchData(){
            if (contract) {
                try {
                    const owners_res = await contract.methods.getOwners().call()
                    setOwners(owners_res)
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
        <div className="parent">
            {isMap ? 
                splitArrayMap.map( row => {
                    console.log(owners)
                    return (
                        <div className="block">
                            {row.map(block => {
                                return(
                                    <div className="container" key={block.id}> <p>{block.id}</p> </div>
                                )
                            })}
                        </div>
                    )

                })
            
            
            : <div>Connect to MetaMask...</div>}
            {/* <div>
                <button onClick={() => buyLand(pricesArray[0])}>Start</button>
            </div> */}
        </div>

    )
}