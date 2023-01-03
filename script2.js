/* game lore

you are a german scientist in 2177, age unknown (manipulates Time)
you have square glasses, you are balding, you are clean from any beard. your lab coat stinks of coffee
you have a 5$ watch on your right wrist. you are wearing a blue shirt with a dark blue checkered pattern.
you dont wear pants at all. you only have boxers.
you are barefoot in the office since you are alone in your ever-dirty office that hasnt been cleaned since Summer 2170.
you can move around easily, but finding stuff got real difficult because of the pizza boxes and hamburger wraps are everywhere and they are piling
your office has coffee stains on the floor and on the ceiling, somehow?
your computer is ancient technology because you
   couldnt afford a new one. your gpu can only handle 5 exaflops per second. you cant even run crysis 4

you redefined Time in 2163, when you were 19 and you just had the worst existential crisis ever
only you are able to manipulate Time because you are simply, built different. (mutation caused by nuclear power plant failure in 2124)
you cant rewind Time because you are only able to scale forward moving Time.
Relative Time was found out to be based on ancient greek methods, so it was actually outdated.
Time is actually a tangible force, you discovered how to interact with it.
you found how to change the scale of Time across the entire universe using your consciousness that is connected to the concept of Time itself
your thoughts influence the scale of Time, universally
but it costs you more and more energy to think with faster processing, because your brain can only process so much information per second.

annihilate into big bang = prestige
20th upgrade universal time scaling manipulation
you have limited lifetime, and scaling time takes off your lifetime by the product log of relative time
700 seconds per second at 2^1024 relative time
upgrade only available between certain threshholds so upg3 reset has a function, maybe sustaining some kind of lifeform so it advances?
*/

let currency = 0;
let bought = [];
let list = {};
let scaleoftime = 1;
let gamestarted = false;
let upgradeElementsToAppend = [];
let displayUpdateFunctions = [];

function format(x) {
    return x.toExponential(2).replace("+", "");
}

function noop() {}

function updateDisp(elemId, text) {
    try {
        document.getElementById(elemId).innerHTML = text;
    } catch {}
}

function notif(text) {
    let x = document.getElementById("notifications");
    x.innerHTML = text + "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!";
    setTimeout(() => {
        x.innerHTML = text;
    }, 200);
}

function generate() {
    let init = 0;
    for (let i = 0; i < bought.length; i++) {
        let upg = list[bought[i][0]];
        let times = bought[i][1];
        init = upg.func(init, times);
    }
    currency += init;
    cps = init * 20 + (gamestarted ? 1 : 0);
}

function updateGameUI() {
    updateDisp("currency.display", `You have ${currency > 999 ? format(currency) : currency} seconds`);
    updateDisp("currency.persecond", `You are gaining approximately ${cps > 999 ? format(cps) : cps} seconds per second.`);
    displayUpdateFunctions.forEach((x) => {
        try {
            x();
        } catch {}
    });
}

function mainRender() {
    updateGameUI();
    requestAnimationFrame(mainRender);
}

function mainLoop() {
    requestAnimationFrame(mainRender);
}

class Upgrade {
    constructor(id, name, desc, limit, cost, /** @type {()} */ costScaling, /** @type {()} */ firstBuy, /** @type {()} */ onbuy, /** @type {()} */ func) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.limit = limit;
        this.cost = cost;
        this.costScaling = costScaling;
        this.firstBuy = firstBuy;
        this.onbuy = onbuy;
        this.func = func;
        this.boughtIndex;
        list[id] = this;
        this.buy = function () {
            let search = this.boughtIndex ? bought[this.boughtIndex] : bought.find((upg) => upg[0] == this.id);
            if (currency < this.cost) return notif(`Not enough time for upgrade "${this.name}"`);
            if (search && this.limit < search[1] + 1) return notif(`Limit reached for upgrade "${this.name}"`);
            currency -= this.cost;
            this.cost = this.costScaling(this.cost);
            if (this.onbuy) this.onbuy(this);
            if (search) {
                search[1] += 1;
            } else {
                bought.push([this.id, 1]);
                this.boughtIndex = bought.length - 1;
                if (this.firstBuy) {
                    this.firstBuy(this);
                }
            }
        };

        let div = document.getElementById("upgrades");
        let button = document.createElement("button");
        button.id = `${this.id}.buy`;
        button.innerHTML = `${this.name}<br>Description: ${this.desc}<br>Bought: ${bought.length ? bought[bought.findIndex((x) => x[0] === this.id)][1] : "0"}<br>Cost: ${
            this.cost > 999 ? format(this.cost) : this.cost
        }`;
        displayUpdateFunctions.push(() => {
            updateDisp(
                button.id,
                `${this.name}<br>Description: ${this.desc}<br>Bought: ${bought.length ? bought[bought.findIndex((x) => x[0] === this.id)][1] : "0"}<br>Cost: ${
                    this.cost > 999 ? format(this.cost) : this.cost
                }`
            );
        });

        let upg = this;

        let button1 = new Audio("button1.mp3");
        let button2 = new Audio("button2.mp3");

        button.onmousedown = function () {
            button1.play().then((x) => (button1.currentTime = 0));
        };

        button.onmouseup = function () {
            button2.play().then((x) => (button2.currentTime = 0));
        };

        button.onclick = function () {
            upg.buy();
        };

        upgradeElementsToAppend.push(() => div.appendChild(button));
    }
}

let first = new Upgrade(
    "first",
    "Ideas of Time",
    "Increase your time gain by 20 seconds per second.",
    Infinity,
    1,
    (cost) => {
        return cost + 27;
    },
    noop,
    noop,
    (x, tb) => {
        return x + tb;
    }
);

/*let dev = new Upgrade(
    "x",
    "dev",
    "devtools",
    0,
    1,
    (x) => {
        return x;
    },
    noop,
    noop,
    (x) => {
        return x * 200;
    }
);*/

let second = new Upgrade(
    "double",
    "Time Pushing Prototype 1",
    "Doubles your time gain.",
    3,
    20000,
    (cost) => {
        return cost * 2;
    },
    noop,
    noop,
    (x, tb) => {
        return x * 2 ** tb;
    }
);

let third = new Upgrade(
    "manipulate",
    "Global Time Perception Manipulation",
    "Allows you to more precisely influence the scale of Time",
    1,
    300000,
    (cost) => {
        return cost;
    },
    function () {
        let disp = document.getElementById("displays");
        let increase = document.createElement("button");
        let decrease = document.createElement("button");
        let display = document.createElement("p");
        let fluctdisp = document.createElement("p");
        display.id = "currency.scaleoftime";
        display.innerHTML = "The current scale of time is 1.00x";
        fluctdisp.innerHTML = "π⏁⟟⋔⟒ ⎎⌰⎍☊⏁⎍⏃⏁⟟⍜⋏ = ";
        let fluctUpd = function () {
            let x = Date.now() / 4000;
            let calc = (1 / 16) * (6 + Math.cos(3 * x)) * (10 + (4 + Math.cos(90 + x)) * Math.sin(x) + (1 / 2) * Math.sin(2 * x));
            let calc2 = Math.round(calc ** 0.5 * 100) / 100;
            fluctdisp.innerHTML = "π⏁⟟⋔⟒ ⎎⌰⎍☊⏁⎍⏃⏁⟟⍜⋏ = " + calc2;
        };

        let abutton1 = new Audio("button1.mp3");
        let abutton2 = new Audio("button2.mp3");

        increase.onmousedown = function () {
            abutton1.play().then((x) => (abutton1.currentTime = 0));
        };

        increase.onmouseup = function () {
            abutton2.play().then((x) => (abutton2.currentTime = 0));
        };

        let bbutton1 = new Audio("button1.mp3");
        let bbutton2 = new Audio("button2.mp3");

        decrease.onmousedown = function () {
            bbutton1.play().then((x) => (bbutton1.currentTime = 0));
        };

        decrease.onmouseup = function () {
            bbutton2.play().then((x) => (bbutton2.currentTime = 0));
        };

        displayUpdateFunctions.push(fluctUpd);
        let boughtamount = 0;
        let stopped = false;
        increase.onclick = function () {
            if (stopped) return;
            let initialcost = 1000;
            let thisCost = 1.7 ** boughtamount * initialcost;
            if (currency < thisCost) return notif("insufficient currency on timescale multiply purchase");
            scaleoftime *= 1.1;
            currency -= thisCost;
            boughtamount += 1;
            increase.innerHTML = "Multiply the scale of Time with 1.01, Cost: " + format(thisCost * 1.7);
            display.innerHTML = "The current scale of Time is " + format(scaleoftime);
        };

        function a(x) {
            scaleoftime = x;
            stopped = false;
            display.innerHTML = "The current scale of Time is " + format(scaleoftime);
            decrease.innerHTML = "Reset the scale of Time to 1";
            decrease.onclick = b;
        }
        function b() {
            //reset upg3 for 10 seconds
            if (stopped) return;
            stopped = true;
            let x = new Number(scaleoftime);
            scaleoftime = 1;
            display.innerHTML = "The current scale of Time is " + format(scaleoftime);
            decrease.innerHTML = "Stop resetting the scale of Time to 1";
            decrease.onclick = function () {
                a(x);
            };
        }

        decrease.onclick = b;
        increase.innerHTML = "Increase the scale of Time by 0.1, Cost: 10000";
        decrease.innerHTML = "Reset the scale of Time to 1";
        let div = document.createElement("div");
        div.id = "timeman";
        div.appendChild(increase);
        div.appendChild(decrease);
        disp.appendChild(div);
        disp.appendChild(display);
        disp.appendChild(fluctdisp);
    },
    noop,
    (y, tb) => {
        let x = Date.now() / 4000;
        let calc = (1 / 16) * (6 + Math.cos(3 * x)) * (10 + (4 + Math.cos(90 + x)) * Math.sin(x) + (1 / 2) * Math.sin(2 * x));
        let calc2 = calc ** 0.5;
        console.log(calc2);
        return y * scaleoftime * calc2;
    }
);

let fourth = new Upgrade(
    "exp",
    "Thought-Capable Time Self Access Before Initialization",
    "^1.25 your time gain.",
    1,
    1e6,
    (x) => {
        return x;
    },
    noop,
    noop,
    (x, tb) => {
        return x ** 1.25;
    }
);

let fifth = new Upgrade(
    "autobuy1",
    "Influence of Ideas",
    "Increments Ideas of Time log10(seconds)*2 times per second",
    1,
    3e7,
    (x) => {
        return x;
    },
    function () {
        let firstUpgradeBoughtEntry = bought[bought.findIndex((x) => x[0] == "first")];
        setInterval(function () {
            firstUpgradeBoughtEntry[1] += Math.floor(Math.log10(currency) * 2);
        }, 1000);
    },
    noop,
    (x) => x
);

let cps = 0;
let gameloop = setInterval(generate, 50);
let button = document.createElement("button");
button.innerHTML = "Start Time";
button.onclick = function () {
    mainLoop();
    gamestarted = true;
    setInterval(() => {
        currency += 1;
    }, 1000);
    document.body.removeChild(button);
    upgradeElementsToAppend.forEach((x) => x());
};
document.body.appendChild(button);
// let devobj = document.createElement("p");
let clock = document.createElement("clock");
// devobj.style = "font-family: Satoshi Variable; font-weight: bold; font-size:50px";
clock.style = "font-family: Satoshi Variable; font-weight: bold; font-size:50px";
let updDev = function () {
    //     let x = Date.now() / 4000;
    //     let calc = (1 / 16) * (6 + Math.cos(3 * x)) * (10 + (4 + Math.cos(90 + x)) * Math.sin(x) + (1 / 2) * Math.sin(2 * x));
    //     let trimamount = 1000;
    //     let trim = Math.round(calc * trimamount) / trimamount;
    //     devobj.innerHTML = trim;
    clock.innerHTML = new Date().toTimeString().substring(0, 8);
};
displayUpdateFunctions.push(updDev);
// document.body.appendChild(devobj);
document.body.appendChild(clock);
