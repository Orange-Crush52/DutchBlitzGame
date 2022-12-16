const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect()

export class Card {
    constructor(num, color, x, y) {
        this.number = num;
        this.color = color;
        this.pile = null;
        this.selected = false;
        this.selectable = true;
        this.x = x;
        this.y = y;
        //40, 400
    }

    drawCard(){
        if(this.selected) {
            ctx.fillStyle = "black";
            ctx.fillRect(this.x-5, this.y-5, 100, 154);
        }
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,90,144);
        ctx.fillStyle = "black";
        if(this.number == '10') {
            ctx.font = '135px economica';
            ctx.fillText('1', this.x-13, this.y+120);
            ctx.fillText('0', this.x+25, this.y+120)
        }
        else{
            ctx.font = '160px economica';
            ctx.fillText(this.number, this.x+8, this.y+125);
        }
    }
        

    setPos(x, y, offset) {
        if(offset){
            x -= rect.left
            y -= rect.top
            this.x=x-50;
            this.y=y-77;
        }
        else{
            
            this.x=x;
            this.y=y;
        }
        // this.drawCard();
    }

    checkClick(clickX, clickY) {
        clickX -= rect.left
        clickY -= rect.top
        if(clickX>this.x && clickX<this.x+100 && clickY>this.y && clickY<this.y+160) {
            // this.changeSelection();
            return true;
        }
        else return false;
    }
    changeSelection() {
        if(this.selected==true) this.selected=false;
        else this.selected = true;
        return this;
    }

    changeSelectable() {
        if(this.selectable==true) this.selectable=false;
        else this.selectable = true;
    }

    isSelected() {return this.selected;}

    isSelectable() { return this.selectable;}

    getX() { return this.x;}

    getY() { return this.y;}

    getNumber() {
        return this.number;
        
    }

    getColor() {

        return this.color;}


    getPile() { return this.pile;}

    changePile(pile) {this.pile = pile;}
}