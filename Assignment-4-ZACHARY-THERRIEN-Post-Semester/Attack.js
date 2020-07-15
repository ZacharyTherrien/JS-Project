AtkType = {"Weapon":0, "Ball":1, "Line":2, "Spin":3, "Light":4};

class Attack{
    constructor(Name, AtkValue, Description, Colour = "#808080", Velocity = 1.5){
        this.Name = Name;
        this.AtkValue = AtkValue;
        this.Description = Description;
        this.Colour = Colour;
        this.DefaultColour = "#000000";
        this.Velocity = Velocity;
        this.Type;
    }

    drawAtk(targetX1, targetY1, targetX2, targetY2, startX, starty, vModifier){
        this.CalculateSpot(startX, starty, vModifier);
        this.animateAtk();
        return this.HitTarget(vModifier, targetX1, targetY1, targetX2, targetY2);
    }

    defaultStartAtk(startX, startY){    //Called to set position of attack animation at the start.
        this.x = startX;
        this.y = startY;
        this.AtkStarted = true;
    }
}

class WeaponAttack extends Attack{
    constructor(Name, AtkValue, Description, Colour, Velocity){
        super(Name, AtkValue, Description, Colour, Velocity);
        this.x;
        this.y;
        this.length = 30;
        this.directionX = 45;
        this.directionY = 25;
        this.AtkStarted = false;
        this.Type = AtkType.Weapon;
    }

    //#region Methods
    CalculateSpot(startX, startY, vModifier){
        if(!this.AtkStarted){       //If it has just begun, set starting position.
            this.defaultStartAtk(startX, startY);
        }
        else{                       //Increase its position here!
            this.x += Math.cos(this.directionX * Math.PI/180) * this.Velocity * vModifier;
            this.y -= Math.sin(this.directionY * Math.PI/180) * this.Velocity * vModifier;
        }
    }

    animateAtk(){   //Draw the actual drawing only here!
        context.strokeStyle = this.Colour;
        context.strokeRect(this.x, this.y, this.length, this.length);
        context.strokeStyle = this.DefaultColour;
    }

    HitTarget(Character, endX1, endY1, endX2, endY2){               //Check if it has reached the target!
        if(Character > 0){                                          //Check Player attack to Enemy
            if(this.x + this.length >= endX1 && this.y >= endY1 || 
               this.x < 0 || this.y < 0 || this.x + this.length > canvas.width || this.y + this.length> canvas.height){
                    this.AtkStarted = false;
                    soundHit.play();
                    return true;
                }
        }
        else{                                                       //Check Enemy attack to Player
            if(this.x <= endX2 && this.y + this.length <= endY2 ||
               this.x < 0 || this.y < 0 || this.x + this.length > canvas.width || this.y + this.length> canvas.height){
                    this.AtkStarted = false;
                    soundHit.play();
                    return true;
            }
        }
        return false;
    }
    //#endregion
}

class BallAttack extends Attack{
    constructor(Name, AtkValue, Description, Colour, Velocity){
        super(Name, AtkValue, Description, Colour, Velocity);
        this.x;
        this.y;
        this.radius = 20;
        this.directionX = 30;
        this.directionY = 25;
        this.velocity = 1.25;
        this.AtkStarted = false;
        this.Type = AtkType.Ball;
    }

    //#region Methods 
    CalculateSpot(startX, startY, vModifier){
        if(!this.AtkStarted){       //If it has just begun, set starting position.
            this.defaultStartAtk(startX, startY);
        }
        else{                       //Increase its position here!
            this.x += Math.cos(this.directionX * Math.PI/180) * this.Velocity * vModifier;
            this.y -= Math.sin(this.directionY * Math.PI/180) * this.Velocity * vModifier;
        }
    }

    animateAtk(){   //Draw the actual drawing only here!
        context.beginPath();
        context.strokeStyle = this.Colour;
        context.arc(this.x,this.y,this.radius,0,2*Math.PI);
        context.closePath();
        context.stroke();
        context.strokeStyle = this.DefaultColour;
    }

    HitTarget(Character, endX1, endY1, endX2, endY2){       //Check if it has reached the target!
        if(Character > 0){                                  //Check Player attack to Enemy.
            if(this.x + this.radius >= endX1 && this.y >= endY1 
                || this.x < 0 || this.y < 0 || this.x > canvas.width || this.y > canvas.height){
                    this.AtkStarted = false;
                    soundHit.play();
                    return true;
                }
        }
        else{                                               //Check Enemy attack to Player.
            if(this.x <= endX2 && this.y + this.radius <= endY2
                || this.x < 0 || this.y < 0 || this.x > canvas.width || this.y > canvas.height){
                    this.AtkStarted = false;
                    soundHit.play();
                    return true;
                }
        }
        return false;
    }
    //#endregion
}

class LineAttack extends Attack{
    constructor(Name, AtkValue, Description, Colour, Velocity){
        super(Name, AtkValue, Description, Colour, Velocity);
        this.x;
        this.y;
        this.startX;
        this.startY;
        this.length;
        this.directionX = 30;
        this.directionY = 25;
        this.AtkStarted = false;
        this.Type = AtkType.Line;
    }

    //#region Methods
    CalculateSpot(startX, startY, vModifier){
        if(!this.AtkStarted){           //If it has not started, set to start position.
            this.defaultStartAtk(startX, startY);
            this.startX = startX;
            this.startY = startY;
        }
        else{                           //Otherwise, continue calculating trajectory.
            this.x += Math.cos(this.directionX * Math.PI/180) * this.Velocity * vModifier;
            this.y -= Math.sin(this.directionY * Math.PI/180) * this.Velocity * vModifier;
        }
    }

    animateAtk(){
        context.beginPath();
        context.strokeStyle = this.Colour;
        context.moveTo(this.startX, this.startY);
        context.lineTo(this.x, this.y);
        context.stroke();
        context.closePath();
        context.strokeStyle = this.DefaultColour;
    }

    HitTarget(Character, endX1, endY1, endX2, endY2){
        if(Character > 0){              //Player to Enemy Attack.
            if(this.x >= endX1 && this.y >= endY1
            || this.x < 0 || this.y < 0 || this.x > canvas.width || this.y > canvas.height){
                this.AtkStarted = false;
                soundHit.play();
                return true;
            }
        }
        else{                           //Enemy attacking Player.
            if(this.x <= endX2 && this.y <= endY2
            || this.x < 0 || this.y < 0 || this.x > canvas.width || this.y > canvas.height){
                this.AtkStarted = false;
                soundHit.play();
                return true;
            }
        }
        return false;
    }
    //#endregion
}

//#region Unsued sword spin atk
/*
class SpinningLineAttack extends Attack{
    constructor(Name, AtkValue, Description, Colour, Velocity){
        super(Name, AtkValue, Description, Colour, Velocity);
        this.x;
        this.y;
        this.directionX = 30;
        this.directionY = 25;
        this.length = 50;
        this.AtkStarted = false;
        this.CaptureV;
        this.rotation = 180;
        this.Type = AtkType.Spin;
    }

    //#region 
    CalculateSpot(startX, startY, vModifier){
        if(!this.AtkStarted){
            this.defaultStartAtk(startX, startY);
            this.CaptureV = vModifier;
        }
        else{
            this.x += Math.cos(this.rotation * Math.PI/180) * this.Velocity * vModifier;
            this.y -= Math.sin(this.rotation * Math.PI/180) * this.Velocity * vModifier;
        }
    }

    animateAtk(){   
        //The hilt is to find the back of the line. Needed to use the sword's tip as its x & y!
        //BE CAREFUL WITH ROTATE. AFTER ROTATING, THAT IS THE NEW DIRECTION THAT YOU MOVE IN!
        let hiltX = this.x - (Math.cos(this.directionX * Math.PI/180) * this.length * this.CaptureV);
        let hiltY = this.y + (Math.sin(this.directionY * Math.PI/180) * this.length * this.CaptureV);
        if(this.rotation > 360)
            this.rotation = 0;
        else{
            this.rotation += 1;
        }
        context.save();
        context.rotate(this.rotation * Math.PI/180);
        context.beginPath();
        context.strokeStyle = this.Colour;
        context.moveTo(hiltX, hiltY);
        context.lineTo(this.x,this.y);
        context.restore();
        context.stroke();
        context.closePath();
        context.strokeStyle = this.DefaultColour;
    }

    HitTarget(Character, endX1, endY1, endX2, endY2){
        if(Character > 0){                              //Player to Enemy attack
            if(this.x >= endX1 && this.y >= endY1
            || this.x < 0 || this.y < 0 || this.x > canvas.width || this.y > canvas.height){
                return true;
            }
        }
        else{                                           //Enemy to Player attack
            if(this.x <= endX2 && this.y <= endY2
            || this.x < 0 || this.y < 0 || this.x > canvas.width || this.y > canvas.height){
                return true;
            }
        }
        return false;
    }
    //#endregion
}
*/
//#endregion

class LightAttack extends Attack{
    constructor(Name, AtkValue, Description, Colour, Velocity){
        super(Name, AtkValue, Description, Colour, Velocity);
        this.x;
        this.y;
        this.radius = 500;
        this.AtkStarted = false;
        this.Timer = 0;
        this.Type = AtkType.Light;
    }

    CalculateSpot(startX, startY){
        if(!this.AtkStarted){
            this.defaultStartAtk(startX,startY);
            this.AtkStarted = true;
            this.Timer = 0;
        }
    }

    animateAtk(){
        context.fillStyle = this.Colour;
        context.globalAlpha = 0.5;                          //Also make it somewhat clear.
        context.arc(this.x,this.y,this.radius,0,2*Math.PI); //Fill screen with big attack.
        context.fill();
        context.globalAlpha = 1;
        context.fillStyle = this.DefaultColour;
    }

    HitTarget(Character, endX1, endY1, endX2, endY2){
        let aFrame = 1/60;          
        const Duration = 1.5;
        this.Timer += aFrame;
        if(this.Timer >= Duration){     //"HitTarget", for this move depends on time, not collision.
            this.AtkStarted = false;
            soundHit.play();
            return true;                //After two sweconds, end animation.  
        }
        return false;
    }
}