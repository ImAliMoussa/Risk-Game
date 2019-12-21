const PLAYER = 0;
const PASSIVE = 1;
const AGGRESSIVE = 2;
const SEMI_PASSIVE = 3;
const A_STAR = 4;
const DEAD_A_STAR = 5;
const GREEDY = 6;
const MINMAX = 7;
const ALPHA_BETA = 8;

const numcities = 27;
const pause = 250;

const adjaceny = [];
let end =0;

adjaceny[0] = [2, 11, 7, 17];
adjaceny[1] = [5, 3, 6, 25, 8];
adjaceny[2] = [11, 14, 4, 0];
adjaceny[3] = [4, 5, 6, 14, 1];
adjaceny[4] = [2, 3, 14, 5, 7];
adjaceny[5] = [4, 3, 7, 1];
adjaceny[6] = [24, 23, 14, 3, 25, 1];
adjaceny[7] = [0, 5, 9, 4, 17];
adjaceny[8] = [1, 25];
adjaceny[9] = [7];
adjaceny[10] = [13, 14, 11, 20];
adjaceny[11] = [13, 10, 2, 17, 0, 14];
adjaceny[12] = [14, 16];
adjaceny[13] = [11, 10];
adjaceny[14] = [15, 20, 10, 11, 3, 4, 2, 12, 16, 6, 23];
adjaceny[15] = [20, 14, 16, 23, 19];
adjaceny[16] = [15, 23, 12, 14];
adjaceny[17] = [0, 11, 7];
adjaceny[18] = [20, 23, 21];
adjaceny[19] = [15, 23, 20, 22];
adjaceny[20] = [10, 14, 15, 19, 22, 21, 18];
adjaceny[21] = [23, 22, 18, 20, 26];
adjaceny[22] = [19, 23, 21, 20];
adjaceny[23] = [6, 14, 16, 15, 19, 22, 21, 18];
adjaceny[24] = [6, 25];
adjaceny[25] = [8, 1, 6, 24];
adjaceny[26] = [21];

class city {
    constructor() {
        this.user = -1;
        this.troops = 0;
    }
}

class user {
    constructor() {
        this.cities = [];
        this.numcities = 0;
        this.type = 1;
        this.colour;
    }
}

let cities = [];
let users = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function displayNumArmies(city, User) {
    const cityLabelId = "#" + city.toString() + "label";
    $(cityLabelId).text(cities[city].troops);

    const colour = users[User].colour;
    const cityId = "#" + city.toString();

    $(cityId).css("fill", colour);
    $(cityId + "circle").css("stroke", colour);
    // await sleep(1500);
}

function displayAttack(city1, city2, User) {
    const cityLabelId1 = "#" + city1.toString() + "label";
    $(cityLabelId1).text(cities[city1].troops);

    const cityLabelId2 = "#" + city2.toString() + "label";
    $(cityLabelId2).text(cities[city2].troops);

    const colour = users[User].colour;
    const cityId1 = "#" + city1.toString();
    //$(cityId1).css("fill", colour);
    const cityId2 = "#" + city2.toString();
    //$(cityId2).css("fill", colour);

    if (cities[city1].user == User) {
        $(cityId1 + "circle").css("stroke", colour);
        $(cityId1).css("fill", colour);
    }

    if (cities[city2].user == User) {
        $(cityId2 + "circle").css("stroke", colour);
        $(cityId2).css("fill", colour);
    }
    // await sleep(1500);
}

function displayAttack2(city1, city2, User) {
    const cityLabelId1 = "#" + city1.toString() + "label";
    $(cityLabelId1).text(cities[city1].troops);

    const cityLabelId2 = "#" + city2.toString() + "label";
    $(cityLabelId2).text(cities[city2].troops);

    const colour = users[User].colour;

    const cityId1 = "#" + city1.toString();
    $(cityId1).css("fill", colour);

    const cityId2 = "#" + city2.toString();
    $(cityId2).css("fill", colour);

    const citycircleId1 = cityId1 + "circle";
    const citycircleId2 = cityId2 + "circle";

    $(citycircleId1).css("stroke", colour);
    $(citycircleId2).css("stroke", colour);
}

async function initiate() {
    for (i = 0; i < numcities; i++) {
        cities[i] = new city();
    }

    users[0] = new user();
    users[1] = new user();

    users[0].colour = "red";
    users[1].colour = "blue";

    users[0].type = document.URL[document.URL.length-1];
    users[1].type = document.URL[document.URL.length-2];
    //users[0].type = ALPHA_BETA;
    //users[1].type = PASSIVE;
    for (let i = 0; i < 40; i++) {
        do {
            rand = Math.floor(Math.random() * numcities);
        } while (cities[rand].user != i % 2 && cities[rand].user != -1);

        if (cities[rand].user == -1) {
            users[i % 2].numcities++;
            users[i % 2].cities.push(rand);
            cities[rand].user = i % 2;
        }
        cities[rand].troops++;
        displayNumArmies(rand, i % 2);
        await sleep(pause);
    }

    let count = 0;
    while (users[0].numcities != 0 && users[1].numcities != 0) {
        let numtroops = Math.floor(users[count].numcities / 3);
        if (numtroops < 3)
            numtroops = 3;
        for (let i = 0; i < numtroops; i++) {
            move(users[count].type, count);
            await sleep(pause);
        }
        console.log(users[count]);
        console.log(users[count].type);
        if (users[count].type == AGGRESSIVE || users[count].type == SEMI_PASSIVE) {
            for (let c of users[count].cities) {
                while (cities[c].troops > 1) {
                    let x = attack(users[count].type, count, c);
                    await sleep(pause);
                    if (Promise.resolve(x)) {
                        break;
                    }
                }
            }
        }
        else if (users[count].type == 4) {
            AstartAttack(count);
            //await sleep(pause);
        }
        else if(users[count].type == 5){
            //alert("error");
            DeadAstartAttack(count);
        }
        else if(users[count].type==GREEDY){
            GreedyAttack(count);
        }
        else if(users[count].type==MINMAX){
            minmax(count);
        } else if (users[count].type == ALPHA_BETA){
            alpha_beta_init(count);
        }
        else if(users[count].type==PLAYER){
            while(end==0){
                if(userChoseArr.length>=2){
                    while(!playerAttack(userChoseArr[0],userChoseArr[1],count)){
                        userChoseArr=[];
                    }
                    userChoseArr=[];
                }
            }
        }
        count++;
        count = count % 2;
    }
}

async function move(type, User) {
    // await sleep(1000);
    // alert(type);
    if (type == PASSIVE || type == SEMI_PASSIVE) {
        min = 2000;
        let place = -1;
        console.log(cities[User]);

        for (let i = 0; i < numcities; i++) {
            let mine = cities[i].user == User;
            let notAnyones = cities[i].user == -1;
            let less = cities[i].troops < min;
            if ((mine || notAnyones) && less) {
                min = cities[i].troops;
                place = i;
            }
        }

        if (cities[place].user == -1) {
            users[User].numcities++;
            users[User].cities.push(place);
            cities[place].user = User;
        }

        cities[place].troops++;
        displayNumArmies(place, User);
        await sleep(pause);
    }
    else if (type == AGGRESSIVE) {
        max = -1;
        let place = -1;

        for (var i of users[User].cities) { 
            //console.log("i="+i);
            if (cities[i].troops > max) {
                max = cities[i].troops;
                place = i;
            }
        }
        cities[place].troops++;
        displayNumArmies(place, User);
    }
    else if (type == 4||type == 5||type ==6||type==7|| type == ALPHA_BETA) {
        let rand = -1;
        do {
            rand = Math.floor(Math.random() * numcities);
        } while (cities[rand].user != User && cities[rand].user != -1);
        //alert(rand);
        if (cities[rand].user == -1) {
            users[User].numcities++;
            users[User].cities.push(rand);
            cities[rand].user = User;
        }
        cities[rand].troops++;
        displayNumArmies(rand, User);
    }
    else if(type==0){
        while(userChoseArr.length<1){           
            while(userChoseArr.length<1){}
            console.log(userChoseArr);
                if(!putCity(userChoseArr[0],User)){
                    userChoseArr=[];
                }
            else{
                break;
            }
        }
        userChoseArr=[];
    }
}

async function attack(type, User, mycity) {
    if (cities[mycity].troops <= 1) {
        alert("cannot attack");
        return;
    }

    if (type == AGGRESSIVE) {
        let max = -1;
        let place = -1;
        
        for (let j of adjaceny[mycity]) {
            if (cities[j].troops > max && cities[j].user != User) {
                place = j;
                max = cities[j].troops;
            }
        }

        if (place == -1) {
            return true;
        }

        if (cities[mycity].troops > cities[place].troops) {
            cities[place].troops = cities[mycity].troops - 1;
            cities[mycity].troops = 1;
            cities[place].user = User;

            users[User].cities.push(place);
            users[User].numcities++;

            let other = (User + 1) % 2;
            let index = users[other].cities.indexOf(place);
            users[other].cities.splice(index, 1);
            users[other].numcities--;
            displayAttack2(mycity, place, User);
            // await sleep(pause);
        }
        else {
            cities[mycity].troops = 1;
            displayNumArmies(mycity, User);
            // await sleep(pause);
        }
        return false;
    }
    else if (type == SEMI_PASSIVE) {
        let min = 1000;
        // let flag = 0;
        for (let i of cities) {
            if (i.troops < min)
                min = i.troops;
        } 
        
        for (let j of adjaceny[mycity]) {
            if (cities[j].troops == min && cities[j].user != User) {
                if (cities[mycity].troops > cities[j].troops) {
                    cities[j].troops = cities[mycity].troops - 1;
                    cities[mycity].troops = 1;
                    
                    cities[j].user = User;
                    users[User].cities.push(j);
                    
                    users[User].numcities++;

                    let other = (User + 1) % 2;
                    let index = users[other].cities.indexOf(j);
                    users[other].cities.splice(index, 1);
                    users[other].numcities--;

                    displayAttack2(mycity, j, User);
                } else {
                    cities[mycity].troops = 1;
                    displayNumArmies(mycity, User);
                }
                return false;
            }
        }
        return true;
    }
}

initiate();
