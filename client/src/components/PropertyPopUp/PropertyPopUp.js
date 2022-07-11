import React, { useState, useEffect, useReducer } from "react";
import { ACTIONS } from '../Property/Property';
import TicTacToe from "../../games/TicTacToe";
import MemoryGame from "../../games/memory/MemoryGame";
import { Card, Button, Form, Row, Col } from "react-bootstrap"

import "./PropertyPopUp.css";

const display = { width: '42rem', height: '42rem' }
const display2 = { width: '32rem', height: '36rem' }
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


const PropertyPopUp = ({ id, hexId, contract, dispatch, account, price, isOwned1 }) => {
    const INITIAL_STATE = {
        id: id,
        isOwned: isOwned1,
        isOwnedByMe: false,
        game: id % 2 === 0 ? true : false,
        transfer: false,
        setNewPriceClicked: false
    }
    const [popup, dispatchPopup] = useReducer(popupReducer, INITIAL_STATE);
    const [accountId, setAccountId] = useState("");
    const [newPrice, setNewPrice] = useState(0);

    const handlePurchaseClick = async (id) => {
        try {

             const priceInEther = price / 1000000000000000000

            await contract.methods.buy(hexId, priceInEther).send({ value: price })
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
             <Card style={popup.isEven && popup.isOwned ? display : display2}>
                <Card.Header as="h5">Property {id}</Card.Header>
                <Card.Body>
                    <Card.Title>Welcome to Property {id}!</Card.Title>
                    <Card.Text>
                    Property Price: {price > 20 ? price / 1000000000000000000: price} Ethers.
                    </Card.Text>
                    {popup.isEven && popup.isOwned && <MemoryGame />}
                    {(!popup.isEven && popup.isOwned) && <TicTacToe />}
                    {!popup.isOwned && <Button variant='primary' onClick={async () => { handlePurchaseClick(id) }}>Purchase!</Button>}
                </Card.Body>
                <Card.Body>

                    {popup.isOwnedByMe && <>
                        <Row>
                            <Col>
                                <Button className="mr-3" variant='primary' onClick={async () => { dispatchPopup({ type: POPUP_ACTIONS.transferClicked }) }}>Transfer! </Button>
                            </Col>
                            <Col>
                                <Button className="mr-3" variant='primary' onClick={async () => { dispatchPopup({ type: POPUP_ACTIONS.setNewPriceClicked }) }}>Set New Price! </Button>
                            </Col>
                        </Row>
                    </>}
                    {popup.isTransferClicked &&
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Enter account Id:</Form.Label>
                                <Form.Control type="hex" defaultValue={accountId} placeholder="0x0000000000000000000000000000000000000000" onChange={(e) => setAccountId(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Button variant="primary" onClick={async (e) => { handleTransfer() }}>
                                    Submit
                                </Button>
                            </Form.Group>
                        </Form>}
                    {popup.isSetNewPriceClicked &&
                        < Form >
                            <Form.Group className="mb-3">
                                <Form.Label>Enter New Price:</Form.Label>
                                <Form.Control type="hex" placeholder={price > 20 ? price / 1000000000000000000: price} onChange={(e) => setNewPrice(e.target.value)} />
                                <Button variant="primary" onClick={async (e) => { handleSetPriceClick() }}>
                                    Change Price
                                </Button>
                            </Form.Group>
                        </Form>}
                </Card.Body>
            </Card>
        </>
    )
}

export default PropertyPopUp