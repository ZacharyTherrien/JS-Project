//Max characters: ~22 chars.
//Max lines: 6 lines.
//3 Lines by default:
//  - Name
//  - Atk value
//  - Type

const AttackList = [                    //List of all possible moves for a shape to use.
    new WeaponAttack('Sword Poke', 25,
    [AtkStat(25), TypeStat("Weapon"), "Some simple attack.", "One simply pokes."]),
    new WeaponAttack('Magic Missile', 21,
    [AtkStat(21), TypeStat("Ball"), "A classic missile.", "But now magical!"],
    "#ff0000"),
    new WeaponAttack("Yeet rock", 80, 
    [AtkStat(80), TypeStat("Weapon"), "Needed weapon idea.", "Saw square == rock", "yeet."],
    "#a6a6a6"),
    new WeaponAttack("???", 50,
    [AtkStat("???"), TypeStat("???"), "???", "Easter eggs are fun."]),
    new BallAttack('Bubble', 10,
    [AtkStat(10), TypeStat("Ball"), "A bubble.", "Surprisingly effective."],
    "#00FFFF"),
    new BallAttack("Shadow Ball", 80,
    [AtkStat(80), TypeStat("Ball"), "Best ghost-type move!", "Even has same power", "as in gen VII!"],
    "#6600cc", 5),
    new BallAttack("Last Hamon!", 11,
    [AtkStat(11), TypeStat("Ball"), "This is my last hamon.", "Take it, JoJo!!", "", "CCEEEAASSAARR!!!"],
    "#ff0000"),
    new LineAttack("Star Finger!", 50,
    [AtkStat(50), TypeStat("Line"), "A classic attack.", "But not as good", "as most think."],
    "#7700ff", 15),
    new LineAttack("Nyoibo", 30,
    [AtkStat(30), TypeStat("Line"), "Or called Power Pole.", "Son Goku's classic", "weapon from DB!"],
    "#ff0000", 15),
    new LineAttack("Stone + Hamon", 100,
    [AtkStat(100), TypeStat("Line"), "A final...", "desperate attack!"],
    "#ff9900", 10),
    new LightAttack("Omega Explosion", 200,
    [AtkStat(150), TypeStat("Light"), "Insert:", "Strong, cool, super OP", "attack here. (tm)"],
    "#cc3300"),
    new LightAttack("World of Light", 200,
    [AtkStat(200), TypeStat("Light"), "Colours weave into", "a spiral and flame.", "RIP main cast."],
    "#ecfc03"),
    new LightAttack("Lots of Lava", 100,
    [AtkStat(100), TypeStat("Light"), "Now that's", "a lot of DAMAGE."],
    "#ff0000"),
    new LightAttack('Excalibur!', 500, 
    [AtkStat(500), TypeStat("Light"), "A shining beam, hope.", "Its name is:" ,"EX-CALIBUUUR!!"],
    "#ffff00"), //Mathematically, neither player should be able to obtain this move.
    // new SpinningLineAttack("Spin Attack!", 100,
    // [AtkStat(100) , "The Hero X thing's", "signature sword attack!", "Originally in 3D."])
];

function AtkStat(AtkValue){     //Formally display an attacks's strength.
    return `Atk: ${AtkValue}`;
}

function TypeStat(Type){        //Formally display an attack's type.
    return `Type: ${Type}`;
}