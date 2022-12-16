import {Player} from "./player.js";
import {Card} from "./card.js"
// const {Player} = require("publc\\js\\player.js")
// import {io} from ".\node_modules\@socket.io";

const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect()
let player1;

let firstTime = true;
const dutchPiles = [];


const sio = io();
sio.emit("joined")


let count =0;

// Game Loop
function drawGame(){
    if(firstTime == true){
        player1 = new Player();

        sio.on('chat message', function(a) {
            console.log(a);
            player1.setName(a);
        });

        // creates post piles and blitz pile
        player1.getCards()[0].setPos(310, 400);
        player1.placeCard(player1.getCards()[0], 'postPileA');
        player1.getCards()[1].setPos(420, 400);
        player1.placeCard(player1.getCards()[1], 'postPileB');
        player1.getCards()[2].setPos(550, 400);
        player1.placeCard(player1.getCards()[2], 'postPileC');

        for(let i=3; i<13; i++) {
            player1.getCards()[i].setPos(710,400)
            player1.placeCard(player1.getCards()[i], 'blitzPile');
        }
        for(let i=13; i<40; i++) {
            // player1.getCards()[i].setPos(660,400)
            // console.log(player1.getCards()[i].getColor() + ", " + player1.getCards()[i].getNumber())
            player1.placeCard(player1.getCards()[i], 'drawPile');
        }

        sio.emit("cardChange", 
            (function() {
                return (function() {  // The function returns when you call it
                    try{return player1.getWood()[0].getColor()+player1.getWood()[0].getNumber()}
                    catch(TypeError) {return " "}})(); })(), 
            (function() {
                return (function() {  // The function returns when you call it
                    try{return player1.getPostA()[0].getColor()+player1.getPostA()[0].getNumber()}
                    catch(TypeError) {return " "}})(); })(), 
            (function() {
                return (function() {  // The function returns when you call it
                    try{return player1.getPostB()[0].getColor()+player1.getPostB()[0].getNumber()}
                    catch(TypeError) {return " "}})(); })(), 
            (function() {
                return (function() { 
                    try{return player1.getPostC()[0].getColor()+player1.getPostC()[0].getNumber()}
                    catch(TypeError) {return " "}})(); })(), 
            (function() {
                return (function() { 
                    try{return player1.getBlitz()[0].getColor()+player1.getBlitz()[0].getNumber()}
                    catch(TypeError) {return " "}})(); })());
        
        document.body.addEventListener('click', function(e) {
            // this runs twice as much every time !!!!!!!
            for(let i=0; i<player1.getCards().length; i++){
                
                if(player1.getCards()[i].isSelectable() && player1.getCards()[i].checkClick(e.clientX, e.clientY) && player1.isTop(player1.getCards()[i])) {
                    try {
                        player1.getSelected().changeSelection();
                    }
                    catch(TypeError){
                        // console.log('none selected');
                    }
                    if(player1.getCards()[i].getX()==40 && player1.getCards()[i].getY()==400){
                        console.log(player1.getDraw())
                        try {
                            player1.getCards()[i].setPos(150, 400);
                            player1.placeCard(player1.takeCard(player1.getCards()[i], "drawPile"), "woodPile");
                            player1.getDraw()[0].setPos(150, 400);
                            player1.placeCard(player1.takeCard(player1.getDraw()[0], "drawPile"), "woodPile");
                            player1.getDraw()[0].setPos(150, 400);
                            player1.getDraw()[0].changeSelection();
                            player1.placeCard(player1.takeCard(player1.getDraw()[0], "drawPile"), "woodPile");
                            console.log(player1.getDraw().length);
                        } catch (TypeError) {
                            //
                        }
                        if(player1.getDraw().length == 0) {
                            player1.reFill();
                        }
                        changeCards();
                    }
                    else {
                        player1.getCards()[i].changeSelection();
                    }
                    requestAnimationFrame(drawGame);
                    clearScreen();
                    
                    return;
                }
            }
            
            // it should move and then validated not the other way around
            // split up into position based and if its clicked on a card 

            /*
            move card 
            check location playfield 
                check if location empty
                    move only if its one
                    make new dutch pile 
                If its on another card color has to be matching number has to be higher 
                    move card 
                    add to dutch pile 
                    make it unclickable
                else 
                    move card back
            If location is hand 
                If less than 3 post piles 
                    make new post pile 
                If on card make sure color matching and number is less 
                else 
                    move card back
            else 
                move card back
            */

            // just switch the order of the if statements for post pile stacking
            // use dutch piles as example
            if(player1.getClick(e.clientX, e.clientY)[1]+72<400) {
                if(player1.getSelected().getNumber()==1) {
                    player1.getSelected().setPos(e.clientX, e.clientY, true);
                    player1.takeCard(player1.getSelected(), player1.getPile(player1.getSelected()));
                    // need to figure this out if multiple cards in a triplet are to be used 
                    // I think i meant that when multiple people are playing there will be identical keys
                    dutchPiles.push([player1.getSelected()]);
                    sio.emit("madeBlitz", player1.getSelected().getColor(), player1.getSelected().getNumber(),
                    player1.getSelected().getX(), player1.getSelected().getY())
                    player1.getSelected().changeSelectable();
                    player1.getSelected().changeSelection();
                    changeCards();
                    requestAnimationFrame(drawGame);
                    clearScreen();
                    
                    
                    // console.log(dutchPiles)
                }
                else if(player1.getClicked(e.clientX, e.clientY) != null) { // if where is clicked is on a card 
                    if(player1.getSelected().getColor() == player1.getClicked(e.clientX, e.clientY).getColor()){
                        if(player1.getSelected().getNumber()-1==player1.getClicked(e.clientX, e.clientY).getNumber()){
                            dutchPiles[dutchPiles.findIndex(function (pile) {
                                return pile.includes(player1.getClicked(e.clientX, e.clientY));
                            })].push(player1.getSelected());
                            player1.takeCard(player1.getSelected(), player1.getPile(player1.getSelected())); 
                            player1.getSelected().setPos(player1.getClicked(e.clientX, e.clientY).getX(), player1.getClicked(e.clientX, e.clientY).getY()); 
                            player1.getSelected().changeSelectable();
                            player1.getSelected().changeSelection();
                            changeCards();
                            requestAnimationFrame(drawGame);
                            clearScreen();
                        }
                    }
                }
                
            }
            else {
                if(player1.getClicked(e.clientX, e.clientY) == null) {
                    if(player1.getPostA().length==0){
                        player1.getSelected().setPos(e.clientX, e.clientY, true);
                        player1.placeCard(player1.takeCard(player1.getSelected(), player1.getPile(player1.getSelected())), "postPileA");
                        changeCards();
                        requestAnimationFrame(drawGame);
                        clearScreen();
                    }
                    else if(player1.getPostB().length==0){
                        player1.getSelected().setPos(e.clientX, e.clientY, true);
                        player1.placeCard(player1.takeCard(player1.getSelected(), player1.getPile(player1.getSelected())), "postPileB");
                        changeCards();
                        requestAnimationFrame(drawGame);
                        clearScreen();
                    }
                    else if(player1.getPostC().length==0){
                        player1.getSelected().setPos(e.clientX, e.clientY, true);
                        player1.placeCard(player1.takeCard(player1.getSelected(), player1.getPile(player1.getSelected())), "postPileC");
                        changeCards();
                        requestAnimationFrame(drawGame);
                        clearScreen();
                    }
                }
                else {
                    // probably need to check length but don't want to
                    // the cards are still selectable so a click can't be ontop with it changing focus
                    // if(player1.getPostA[0].getColor()==player1.getSelected().getColor()) {
                    //     player1.getSelected().setPos(player1.getPostA[0].getX(), player1.getPostA[0].getY(), true);
                    // }
                }
                
                // player1.takeCard(player1.getSelected(), player1.getPile(player1.getSelected()));
            }
        });

        // requestAnimationFrame(drawGame);
        // clearScreen();
        firstTime=false;
    }
    
    // taking out opo change makes it so that it doesn't crash but the rest of the stuff might be running a lot

    sio.on("starting", function(players) {
        // console.log(players);
        for(let play in players) {
            if(play.player_id== player1.getName()){
                continue;
            }
            else {
                player1.setOpo(Object.values(players[play]).slice(1));
                requestAnimationFrame(drawGame);
                clearScreen();
            }
        }
    })

    sio.on("newBlitz", function(c, n, x, y){
        dutchPiles.push([new Card(n, c, x, y)]);
    })

    const concat = player1.getDraw().concat(player1.getWood().slice().reverse(), 
    player1.getPostA().slice().reverse(),
    player1.getPostB().slice().reverse(),
    player1.getPostC().slice().reverse(),
    player1.getBlitz().slice().reverse(),
    [].concat.apply([], dutchPiles)//.slice().reverse()
    )
    
    for(let i=0; i<concat.length; i++) {
        concat[i].drawCard();
    }
    player1.setClickOrder(concat.reverse());
    ctx.font = "30px Arial";

    // sio.emit("getOpo");

    for(let i=0; i<5; i++) {
        ctx.fillText(player1.getOpo()[i], i*100, 50);
    }

    ctx.fillStyle = player1.getColor();
    ctx.fillRect(40, 400, 90, 144);

}

sio.on("opoChange", function(opo) {
    player1.setOpo(opo);

    requestAnimationFrame(drawGame);
    clearScreen();
})

function setGame(){

}

function clearScreen(){
    ctx.fillStyle= "white";
    ctx.fillRect(0,0, canvas.width, canvas.height);
}

function changeCards() {
    sio.emit("cardChange", 
                (function() {
                    return (function() {  // The function returns when you call it
                        try{return player1.getWood()[0].getColor()+player1.getWood()[0].getNumber()}
                        catch(TypeError) {return " "}})(); })(), 
                (function() {
                    return (function() {  // The function returns when you call it
                        try{return player1.getPostA()[0].getColor()+player1.getPostA()[0].getNumber()}
                        catch(TypeError) {return " "}})(); })(), 
                (function() {
                    return (function() {  // The function returns when you call it
                        try{return player1.getPostB()[0].getColor()+player1.getPostB()[0].getNumber()}
                        catch(TypeError) {return " "}})(); })(), 
                (function() {
                    return (function() {  // The function returns when you call it
                        try{return player1.getPostC()[0].getColor()+player1.getPostC()[0].getNumber()}
                        catch(TypeError) {return " "}})(); })(), 
                (function() {
                    return (function() {  // The function returns when you call it
                        try{return player1.getBlitz()[0].getColor()+player1.getBlitz()[0].getNumber()}
                        catch(TypeError) {return " "}})(); })());
} 




drawGame();


