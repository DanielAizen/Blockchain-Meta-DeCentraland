import React, { useState, useEffect } from "react";
import { useBuyLandContract } from "../hooks/useBuyLand";
import { pricesArray } from "../config";

export const World = () => {
    const [contract, account] = useBuyLandContract();

    const buyLand = async ({price}) => {
        try {
            const tId = 0
            // const hexId = `0x00000000000000000000000000000000000000${props.id.toString(16)}`
            const hexId = `0x00000000000000000000000000000000000000${tId.toString(16)}`
            const priceInEther = price / 1000000000000000000

           await contract.methods.buy(hexId, priceInEther).send({ value: price })
           const newOwner = await contract.methods.getOwner(id).call()
           if (newOwner === account[0]) {
               console.log("new owner: ", newOwner);
            //    dispatch({ type: ACTIONS.AsOwned })
            //    dispatchPopup({ type: POPUP_ACTIONS.isOwned })
           }
       } catch (err) {
           console.log(err);
       }
    }

    return(
        <div>
            <button onClick={buyLand(pricesArray[0])}>Start</button>
        </div>
    )
}