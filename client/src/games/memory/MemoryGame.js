import   React, { useEffect, useState } from "react"
import {Container} from "react-bootstrap" 
import { images } from "./images"

function MemoryGame() {
    const BLANK_CARD = "https://progitek.no/privat/bp/wp-content/uploads/2021/09/pexels-pixabay-235985-scaled.jpg"
    const [imagesArray, setImagesArray] = useState([])
    const [cardsChosen, setCardsChosen] = useState([])
    const [cardsChosenIds, setCardsChosenIds] = useState([])
    const [points, setPoints] = useState(0)

    const [openCards, setOpenCards] = useState([])

    function createCardBoard() {
        var imagesGenerated = images.concat(...images)
        console.log(imagesGenerated)
        const shuffledArray = shuffleArray(imagesGenerated)
        setImagesArray(shuffledArray)
    }

    function flipImage(image, index) {
        // CHECK IF IMAGE IS SELECTED
        console.log(image, index)

        if (cardsChosenIds.length === 1 && cardsChosenIds[0] === index) {
            return
        }

        // Check if 
        if (cardsChosen.length < 2) {

            setCardsChosen(cardsChosen => cardsChosen.concat(image))
            setCardsChosenIds(cardsChosenIds => cardsChosenIds.concat(index))

            if (cardsChosen.length === 1) {
                // Check if images are the same
                if (cardsChosen[0] === image) {
                    setPoints(points => points + 2)
                    setOpenCards(openCards => openCards.concat([cardsChosen[0], image]))
                }
                setTimeout(() => {
                    setCardsChosenIds([])
                    setCardsChosen([])
                }, 700)
                
            } 
        }
    }

    function isCardChosen(image, index) {
        return cardsChosenIds.includes(index) || openCards.includes(image)
    }


    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        console.log(array)
        return array
    }

    function startOver() {
        setCardsChosenIds([])
        setCardsChosen([])
        setPoints(0)
        setOpenCards([])
    }

    useEffect(() => {
        createCardBoard()
    }, [])

    return (
        <Container className="container">
            <header>MemoryGame</header>
            <p>Points: {points}</p>
            <button onClick={startOver}>Start over</button>
            <div className="row no-gutters">
                {imagesArray.map((image, index) => {
                    return (
                        <div className="col-4 col-lg-2" key={index} onClick={() => flipImage(image, index)}>
                            <img src={isCardChosen(image, index) ? image : BLANK_CARD} alt="" className={`img-fluid img-fixed`} />
                        </div>
                    )
                })}
            </div>
        </Container>
    )
}
export default MemoryGame