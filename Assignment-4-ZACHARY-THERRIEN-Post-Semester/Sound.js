class sound{                                                //Class for sounds.
    constructor(file){
        this.sound = document.createElement('audio');
        this.sound.src = file;
        document.body.appendChild(this.sound);
    }
    play(){
        this.sound.play();
    }
}

let soundStart = new sound("./Sounds./Start.wav");          //Z is pressed at start.
let soundDenyChoice = new sound("./Sounds/DenyChoice.wav"); //If Fill Power w/o wins.
let soundsChoice = new sound("./Sounds/Choice.wav");        //Everytime choice made.
let soundDefend = new sound("./Sounds/Defend.wav");         //After character defends.
let soundFillPower = new sound("./Sounds/FillPower.wav");   //Used Fill Power.
let soundHit = new sound("./Sounds/Hit.wav");               //After character hit.
let soundBonus = new sound("./Sounds/Bonus.wav");           //Upon entering bonus room.
let soundShapeFill = new sound("./Sounds/Shape_Fill.wav");  //During Shape Fill animation.