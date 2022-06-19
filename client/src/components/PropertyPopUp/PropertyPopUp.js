import React, { useState, useEffect, useReducer } from "react";
import { ACTIONS } from '../Property';

import "./PropertyPopUp.css";

const POPUP_ACTIONS = { isOwned: "isOwned", isOwnedByMe: "isOwnedByMe", isNotOwnedByMe: "isNotOwnedByMe", transferClicked: "transferClicked", setNewPriceClicked: "newPriceClicked" }
const popupReducer = (popup, action) => {
    switch (action.type) {
        case POPUP_ACTIONS.isOwned:
            return { ...popup, isOwned: true }
        case POPUP_ACTIONS.isOwnedByMe:
            return { ...popup, isOwnedByMe: true, isOwned: true }
        case POPUP_ACTIONS.isNotOwnedByMe:
            return { ...popup, isOwnedByMe: false, transfer: false }
        case POPUP_ACTIONS.transferClicked:
            return { ...popup, transfer: !popup.transfer }
        case POPUP_ACTIONS.setNewPriceClicked:
            return { ...popup, setNewPriceClicked: !popup.isSetNewPriceClicked }
        default:
            return popup;
    }
}


export const PropertyPopUp = (props) => {
    const INITIAL_STATE = {
        id: props.proprety.id,
        isOwned: props.proprety.isOwned,
        isOwnedByMe: false,
        game: id%2 === 0 ? true : false,
        transfer: false,
        setNewPriceClicked: false
    }
    const [popup, dispatchPopup] = useReducer(popupReducer, INITIAL_STATE);
    const [account, setAccount] = useState("");
    const [newPrice, setNewPrice] = useState(0);

    const handlePurchaseClick = async (id) => {
        try {

             const priceInEther = price / 1000000000000000000

            await contract.methods.purchase(hexId, priceInEther).send({ value: price })
            const newOwner = await contract.methods.getOwner(id).call()
            if (newOwner === account[0]) {
                dispatch({ type: ACTIONS.AsOwned })
                dispatchPopup({ type: POPUP_ACTIONS.isOwned })
            }
        } catch (err) {
            console.log(err);
        }
    }
    const handleSetPriceClick = async () => {
        console.log(newPrice, id)
        try {
            await contract.methods.setPrice(id, newPrice).send()
            dispatch({ type: ACTIONS.priceChanged, price: newPrice })

        } catch (err) {
            console.log("setPrice rejected");
        }
    }

    const isValidAccountId = (accountId) => {
        var re = /[0-9A-Fa-f]{6}/g;
        return (re.test(accountId) && accountId.length === 42) ? true : false
    }

    const handleTransfer = async () => {
        if (isValidAccountId(accountId)) {
            console.log(account[0], accountId, id);
            try {
                await contract.methods.transferFrom(account[0], accountId, id).send()
                dispatchPopup({ type: POPUP_ACTIONS.isNotOwnedByMe })
                console.log("transfer succeeded")

            } catch (e) {
                console.log(e);
            }
        }
    }

    useEffect(() => {
        const checkIfOwnedByMe = async () => {
            try {
                const newOwner = await contract.methods.ownerOf(hexId).call()
                if (newOwner === account[0]) {
                    dispatchPopup({ type: POPUP_ACTIONS.isOwnedByMe })
                }
            } catch (e) {
                console.log("owner is not found");
            }
        }

        checkIfOwnedByMe()
    })


    return (
        <>

        </>
    )
}