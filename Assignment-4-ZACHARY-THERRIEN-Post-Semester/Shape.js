//////////////////////////////////////////////////////////////
//                                                          //
//   ANY DRAW METHODS MUST GO WITHIN THE CHILD CLASSES!     //
//                                                          //
//////////////////////////////////////////////////////////////

let ShapeType = ['Rectangle', 'Triangle', 'Circle'];

class Shape{
    constructor(positionX, positionY, Moves){
        this.positionX = positionX;
        this.positionY = positionY;
        this.GenerateRandomStats();
        this.Defended = true;
        this.Arc = 0;
        this.ArcFull = 2 * Math.PI;
        this.Filled = false;
        this.CanFill = true;
        this.FillTimer = 0;
        this.fillTimerEnd = 16;         //Length of tranformation animation sounds clip.
        this.TurnsFilled = 0;
        this.Moves = Moves.slice(0,3);
        this.ReceivedSprEfct = false;
    }

    GenerateRandomStats(){
        this.BaseHP = Math.floor(Math.random() * 300 + 100);
        this.HP = this.BaseHP;
        this.DisplayHP = this.BaseHP;
        this.BaseAtk = Math.floor(Math.random() * 50 + 10);
        this.Atk = this.BaseAtk;
        this.BaseDef  = Math.floor(Math.random() * 50 + 10);
        this.Def = this.BaseDef;
        this.BaseSpd = Math.floor(Math.random() * 10);
        this.Spd = this.BaseSpd;
    }

    //#region Atk/HP functions
    DisplayDamage(Atk){                 //HP rolls down, decrease actual HP value later. Stronger attacks make it faster!
        let multiplier = 100;           //Used to slow down the speed of which HP decreases!
        this.DisplayHP -= Atk / multiplier;
        if(this.DisplayHP < 0){
            this.DisplayHP = 0;
        }
    }

    ReceiveDamage(Atk){                 //Calculate actual HP value after it rolls down.
        if(this.ReceivedSprEfct){
            this.Def = this.Def / 1.5;
            console.log("Super on.");
        }
        this.HP -= Atk - this.Def / 3;      //Def stat will reduce damage dealt.
        if(this.HP < 0 )
            this.HP = 0;
        if(this.ReceivedSprEfct){       //If move was super effective, return Def to normal.
            this.Def *= 1.5;
            this.ReceivedSprEfct = false;
            console.log("Super off.");
        }        
    }

    QuickEndAtk(AtkNum){
        this.Moves[AtkNum].AtkStarted = false;
    }

    HealHP(HP){
        this.HP += HP;
        this.DisplayHP = this.HP;
    }
    //#endregion

    //#region Defend functions
    Defend(){
        console.log(this.Def);
        this.Def = this.Def + 10;
        console.log(this.Def);
        this.Defended = true;
    }

    QuickEndDef(){
        this.Arc = this.ArcFull;
    }
    //#endregion

    //#region Fill Power functions
    UseFillPower(){
        this.Filled = true;
        soundShapeFill.play();
        this.FillBoost();
    }

    DrawFill(){
        let aFrame = 1/60;
        this.FillTimer += aFrame;
        if(this.FillTimer >= this.fillTimerEnd){
            return true;
        }
        soundShapeFill.play();
        return false;
    }

    FillBoost(){
        console.log("BEFORE:");
        console.log("Atk: " + this.Atk);
        console.log("Def: " + this.Def);
        console.log("Spd: " + this.Spd);
        this.Atk += this.BaseAtk/3;
        this.Def += this.BaseDef/3;
        this.Spd += this.BaseSpd/2;
        this.CanFill = false;
        console.log("AFTER:");
        console.log("Atk: " + this.Atk);
        console.log("Def: " + this.Def);
        console.log("Spd: " + this.Spd);
    }

    FillCheckEnd(){
        if(this.TurnsFilled >= 3){
            this.Filled = false;
            this.FillEnd();
        }
        this.TurnsFilled++;
    }

    FillEnd(){
        this.Atk = this.BaseAtk;
        this.Def = this.BaseDef;
        this.Spd = this.BaseSpd;
        let Heal = 20;
        this.HealHP(Heal);
        console.log("ENDING:");
        console.log("Atk: " + this.Atk);
        console.log("Def: " + this.Def);
        console.log("Spd: " + this.Spd);
    }

    QuickEndFill(){
        this.fillTimer = this.fillTimerEnd;
    }
    //#endregion
}

class Rectangle extends Shape{
    constructor(positionX, positionY, Moves){
        super(positionX, positionY, Moves);
        this.Width = 50;
        this.Height = 50;
    }

    //#region Calculate move effectivess (receiving end)
    CheckEffectiveness(Type){                                   //If effective, display & reduce Def.
        if(Type == AtkType.Ball || Type == AtkType.Light){
            this.DisplaySuperEffective();
            this.ReceivedSprEfct = true;
        }
    }
    //#endregion

    //#region Draw functions
    draw(){
        if(!this.Filled){
            context.strokeRect(this.positionX,this.positionY,this.Width,this.Height);
        }
        else{
            context.fillRect(this.positionX,this.positionY,this.Width,this.Height);
        }
        this.displaysStats();
    }

    displaysStats(adjust = 0){                    
        context.font = "10px Georgia";
        context.fillText(`HP: ${this.DisplayHP.toFixed(0)}/${this.BaseHP}`, this.positionX - 5 + adjust, this.positionY + this.Height + 20);
    }

    DrawAtk(AtkNum, x1, y1, x2, y2, velocity){
        return this.Moves[AtkNum].drawAtk(x1, y1, x2, y2, this.positionX+(this.Width/2), this.positionY-20, velocity);
    }

    DisplaySuperEffective(){
        context.fillStyle = "#ff3b3b";
        context.font = "20px Georgia";
        context.fillText("Effective!", this.positionX - 5, this.positionY - 10);
        context.fillStyle = "#000000";
    }

    DrawDef(){
        if(this.Defended){
            this.Defended = false;
            this.Arc = 0;
        }
        context.beginPath();                    //Begin path every frame, creates an ongoing creating effect.
        context.arc(this.positionX+(this.Width/2),this.positionY+(this.Height/2),this.Width,0,this.Arc*Math.PI);
        if(this.Arc <  2 * Math.PI){
            context.strokeStyle = "#66ff99";
            context.stroke();                   
            context.strokeStyle = "#000000";
            this.Arc += 0.0523598775;           //This is 1/240 of 2*Pi so it completes in 2 seconds. 
            if(this.Arc > Math.PI){             //If circle complete, fill with transparent green.
                context.fillStyle = "#66ff99";
                context.globalAlpha = 0.2;      //Sets transparency.
                context.fill();
                context.globalAlpha = 1;      
                context.fillStyle = "#000000";
            }
        }
        else{       
            context.closePath();                //Close path after it is all complete, removes line effect.
            this.Arc = 0;
            return true;
        }
        return false;
    }
    //#endregion

    //#region Find and return hitboxes
    HitBoxX1(){
        return this.positionX;
    }

    HitBoxX2(){
        return this.positionX + this.Width;
    }

    HitBoxY1(){
        return this.positionY;
    }

    HitBoxY2(){
        return this.positionY + this.Height;
    }
    //#endregion
}

class Triangle extends Shape{
    constructor(positionX, positionY, Moves){
        super(positionX, positionY, Moves);
        this.Base = 50
        this.Height = 40;
    }
    
    //#region Calculate move effectivess (receiving end)
    CheckEffectiveness(Type){                                   //If effective, display & reduce Def.
        if(Type == AtkType.Line || Type == AtkType.Light){
            this.DisplaySuperEffective();
            this.ReceivedSprEfct = true; 
        }
    }
    //#endregion

    //#region Draw functions
    draw(){
        if(!this.Filled){
            context.beginPath();
            context.moveTo(this.positionX,this.positionY);
            context.lineTo(this.positionX + this.Base, this.positionY + this.Height);
            context.lineTo(this.positionX - this.Base, this.positionY + this.Height);
            context.closePath();
            context.stroke();
        }
        else{
            context.beginPath();
            context.moveTo(this.positionX,this.positionY);
            context.lineTo(this.positionX + this.Base, this.positionY + this.Height);
            context.lineTo(this.positionX - this.Base, this.positionY + this.Height);
            context.closePath();
            context.fill();
        }
        let modifyX = (this.Base/2) * -1
        this.displaysStats(modifyX);
    }

    displaysStats(adjust = 0){                    
        context.font = "10px Georgia";
        context.fillText(`HP: ${this.DisplayHP.toFixed(0)}/${this.BaseHP}`, this.positionX - 5 + adjust, this.positionY + this.Height + 20);
    }

    DrawAtk(AtkNum, x1, y1, x2, y2, velocity){
        return this.Moves[AtkNum].drawAtk(x1, y1, x2, y2, this.positionX, this.positionY, velocity);
    }

    DisplaySuperEffective(){
        context.fillStyle = "#ff3b3b";
        context.font = "20px Georgia";
        context.fillText("Effective!", this.positionX - 25, this.positionY - 10);
        context.fillStyle = "#000000";
    }

    DrawDef(){
        if(this.Defended){
            this.Defended = false;
            this.Arc = 0;
        }
        context.beginPath();                    //Begin path every frame, creates an ongoing creating effect.
        context.arc(this.positionX,this.positionY+(this.Height/1.5),this.Base*1.2,0,this.Arc*Math.PI);
        if(this.Arc <  2 * Math.PI){
            context.strokeStyle = "#66ff99";
            context.stroke();                   
            context.strokeStyle = "#000000";
            this.Arc += 0.0523598775;           //This is 1/240 of 2*Pi so it completes in 2 seconds. 
            if(this.Arc > Math.PI){             //If circle complete, fill with transparent green.
                context.fillStyle = "#66ff99";
                context.globalAlpha = 0.2;      //Sets transparency.
                context.fill();
                context.globalAlpha = 1;      
                context.fillStyle = "#000000";
            }
        }
        else{       
            context.closePath();                //Close path after it is all complete, removes line effect.
            this.Arc = 0;
            return true;
        }
        return false;
    }
    //#endregion

    //#region Find & return hitboxes
    HitBoxX1(){
        return this.positionX - this.Base;
    }

    HitBoxX2(){
        return this.positionX + this.Base;
    }

    HitBoxY1(){
        return this.positionY;
    }

    HitBoxY2(){
        return this.positionY + this.Height;
    }
    //#endregion
}

class Circle extends Shape{
    constructor(positionX, positionY, Moves){
        super(positionX, positionY, Moves);
        this.Radius = 35;
        this.positionX += 15;
        this.positionY += 15;
    }

    //#region Calculate move effectivess (receiving end)
    CheckEffectiveness(Type){                                   //If effective, display & reduce Def.
        if(Type == AtkType.Weapon || Type == AtkType.Light){
            this.DisplaySuperEffective();
            this.ReceivedSprEfct = true;
        }
    }
    //#endregion

    //#region 
    draw(){
        if(!this.Filled){
            context.beginPath();
            context.arc(this.positionX, this.positionY, this.Radius, 0, 2*Math.PI);
            context.closePath();
            context.stroke();
        }
        else{
            context.beginPath();
            context.arc(this.positionX, this.positionY, this.Radius, 0, 2*Math.PI);
            context.closePath();
            context.fill();
        }
        let modifyX = 0;
        this.displaysStats(this.Radius/1.5 * -1);
    }

    displaysStats(adjust = 0){                    
        context.font = "10px Georgia";                          
        context.fillText(`HP: ${this.DisplayHP.toFixed(0)}/${this.BaseHP}`, this.positionX - 5 + adjust, this.positionY + this.Radius + 20);
    }

    DrawAtk(AtkNum, x1, y1, x2, y2, velocity){
        return this.Moves[AtkNum].drawAtk(x1, y1, x2, y2, this.positionX + (this.Radius/2), this.positionY - (this.Radius/2), velocity);
    }

    DisplaySuperEffective(){
        context.fillStyle = "#ff3b3b";
        context.font = "20px Georgia";
        context.fillText("Effective!", this.positionX - 40, this.positionY - 20);
        context.fillStyle = "#000000";
    }

    DrawDef(){
        if(this.Defended){
            this.Defended = false;
            this.Arc = 0;
        }
        context.beginPath();                    //Begin path every frame, creates an ongoing creating effect.
        context.arc(this.positionX,this.positionY,this.Radius*1.5,0,this.Arc*Math.PI);
        if(this.Arc <  2 * Math.PI){
            context.strokeStyle = "#66ff99";
            context.stroke();                   
            context.strokeStyle = "#000000";
            this.Arc += 0.0523598775;           //This is 1/240 of 2*Pi so it completes in 2 seconds. 
            if(this.Arc > Math.PI){             //If circle complete, fill with transparent green.
                context.fillStyle = "#66ff99";
                context.globalAlpha = 0.2;      //Sets transparency.
                context.fill();
                context.globalAlpha = 1;      
                context.fillStyle = "#000000";
            }
        }
        else{       
            context.closePath();                //Close path after it is all complete, removes line effect.
            this.Arc = 0;
            return true;
        }
        return false;
    }
    //#endregion

    //#region Find & return hitboxes
    HitBoxX1(){
        return this.positionX - this.Radius;
    }

    HitBoxX2(){
        return this.positionX + this.Radius;
    }

    HitBoxY1(){
        return this.positionY - this.Radius;
    }

    HitBoxY2(){
        return this.positionY + this.Radius;
    }
    //#endregion
}