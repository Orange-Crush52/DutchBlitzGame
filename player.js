import {Card} from "./card.js";
// const {Card} = require("./card.js")
const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect()

export class Player {
    constructor() {
        this.name = null;
        this.color = 'orange';
        this.points = 0;
        this.allCards = [];
        this.cards = []
        this.postPileA = [];
        this.postPileB = [];
        this.postPileC = [];
        this.woodPile = [];
        this.blitzPile = [];
        this.drawPile = [];
        this.opo = [];
        this.dutchPiles=[];

        for(let i=1; i<=40; i++) {
            if(i<=10) {
                this.cards.push(new Card(i.toString(), "red", 40, 400));
            }
            else if(i<=20) {
                
                this.cards.push(new Card((i-10).toString(), "yellow", 40, 400));
            }
            else if(i<=30) {
                this.cards.push(new Card((i-20).toString(), "blue", 40, 400));
            }
            else {
                this.cards.push(new Card((i-30).toString(), "green", 40, 400));
            }
        }
        // this.cards.sort((a, b) => 0.5-Math.random())
        
    }

    cardToTop(card) {
        this.cards.unshift(this.cards.splice(this.cards.indexOf(card), 1)[0]);
    }

    placeCard(card, destination){
        // destination.unshift(from.shift());
        if(destination == 'blitzPile') {
            this.blitzPile.unshift(card);
        }
        else if(destination == 'postPileA') {
            this.postPileA.unshift(card);
        }
        else if(destination == 'postPileB') {
            this.postPileB.unshift(card);
        }
        else if(destination == 'postPileC') {
            this.postPileC.unshift(card);
        }
        else if(destination == 'drawPile') {
            this.drawPile.unshift(card);
        }
        else if(destination == 'woodPile') {
            this.woodPile.unshift(card);
        }
        else if(destination == 'deadCards') {
            this.deadCards.unshift(card);
        }
    }

    takeCard(card, origin) {
        if(origin == 'blitzPile') {
            this.blitzPile.shift(card);
            return card;
        }
        else if(origin == 'postPileA') {
            this.postPileA.shift(card);
            return card;
        }
        else if(origin == 'postPileB') {
            this.postPileB.shift(card);
            return card;
        }
        else if(origin == 'postPileC') {
            this.postPileC.shift(card);
            return card;
        }
        else if(origin == 'drawPile') {
            this.drawPile.shift(card);
            return card;
        }
        else if(origin == 'woodPile') {
            this.woodPile.shift(card);
            return card;
        }
        else if(origin == 'cards') {
            this.cards.shift(card);
            return card;
        }
    }

    isTop(card) {
        if(this.drawPile[0] == card) {
            return true;
        }
        if(this.blitzPile[0] == card) {
            return true;
        }
        if(this.postPileA[0] == card) {
            return true;
        }
        if(this.postPileB[0] == card) {
            return true;
        }
        if(this.postPileC[0] == card) {
            return true;
        }
        if(this.woodPile[0] == card) {
            return true;
        }

        return false;
    }

    getPile(card) {
        if(this.blitzPile.includes(card)) {
            return "blitzPile";
        }
        else if(this.postPileA.includes(card)) {
            return "postPileA";
        }
        else if(this.postPileB.includes(card)) {
            return "postPileB";
        }
        else if(this.postPileC.includes(card)) {
            return "postPileC";
        }
        else if(this.drawPile.includes(card)) {
            return "drawPile";
        }
        else if(this.woodPile.includes(card)) {
            return "woodPile";
        }
    }

    reFill() {
        console.log("called");
        this.drawPile = this.woodPile.reverse();
        for(let i=0; i<this.drawPile.length; i++) {
            this.drawPile[i].setPos(40, 400);
        }
        this.woodPile = [];
    }

    getSelected() {
        for(let card of this.cards) {
            if(card.isSelected()) {
                return card;
            }
            // else return null;
        }
    }

    getClicked(x, y) {
        for(let card of this.allCards) {
            if(card.checkClick(x, y)){
                return card;
            }
        }
        return null;
    }

    getClick(clickX, clickY) {
        clickX -= rect.left
        clickY -= rect.top

        return [clickX, clickY];
    }

    getCards() {
        return this.cards;
    }

    printCards() {
        const cards = [];

        for(let i=0; i<40; i++) {
            cards.push(this.cards[i].getColor() + ", " + this.cards[i].getNumber())
        }
        console.log(cards);
    }

    setClickOrder(cards) {this.allCards=cards}

    setPiles(piles) {this.dutchPiles=piles}

    setName(name) {this.name=name}

    getName() {return this.name}

    setOpo(oppo) {this.opo = oppo}

    getOpo() {return this.opo}

    getColor() {return this.color}

    getDraw() { return this.drawPile}

    getWood() { return this.woodPile}

    getPostA() {return this.postPileA}

    getPostB() {return this.postPileB}

    getPostC() {return this.postPileC}

    getBlitz() {return this.blitzPile}

}