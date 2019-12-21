class MyState {

    pad(num, size) {
        let s = "000000000" + num;
        return s.substr(s.length - size);
    }

    getStateString() {
        let str = "";
        for (let index = 0; index < this.cities.length; index++) {
            const tmp1 = this.pad(this.cities[index].troops.toString(), 3);
            const tmp2 = this.cities[index].user.toString();
            // console.log(tmp1, tmp2);
            str += tmp2 + tmp1;
        }
        return str;
    }

    constructor(parentIndex, myIndex, heuristic, cost, currusers, currcities, currentPlayer, countryThatAttacked, oppAttackedCountry) {
        this.parentIndex = parentIndex;
        this.myIndex = myIndex;
        this.heuristic = heuristic;
        this.cost = cost;
        this.users = currusers;
        this.cities = currcities;
        this.stateString = this.getStateString();
        this.currentPlayer = currentPlayer;
        this.countryThatAttacked = countryThatAttacked;
        this.oppAttackedCountry = oppAttackedCountry;
    }
}

function heuristic(cities, currentPlayer){
    let sum = 0;
    for (const city in adjaceny) {
        let curr = 0;
        if (cities[city].user != currentPlayer) continue;

        for (const adj of adjaceny[city]) {
            if(cities[adj].user != cities[city].user) {
                curr += cities[adj].troops;
            }
        }
        curr = Math.ceil(curr / cities[city].troops);
        sum += curr;
    }

    return sum;
}

let allStatesHash = new Set();
let allStates = [];
let numOfStates = 0;
let pqueue = null;

function genNextStates(currState) {
    for (let i = 0 ; i < currState.cities.length; i++) {
        if (cities[i].user != currState.currentPlayer) 
            continue;
        
        for (let adj of adjaceny[i]) {
            if (currState.cities[adj].user == currState.currentPlayer) continue;
            
            let mytroops = currState.cities[i].troops;
            if (mytroops == 1) break;
            
            //console.log(`${i} is attacking ${adj}`);

            let opponenttroops = currState.cities[adj].troops;

            if (mytroops <= opponenttroops) {
                //I lost the battle
                // const newCities = JSON.parse(JSON.stringify(currState.cities));
                // newCities[i].troops = 1;

                // const newUsers = JSON.parse(JSON.stringify(currState.users));

                // newState = new MyState(currState.myIndex, numOfStates, heuristic(newCities, currState.currentPlayer), currState.cost + 1, newUsers, newCities, currState.currentPlayer, i, adj);

                // if (!allStatesHash.has(newState.stateString)) {
                //     allStatesHash.add(newState.stateString);
                //     allStates.push(newState);
                //     pqueue.queue(newState);
                //     numOfStates++;
                // }
            } else {
                //I won the battle
                
                const currentPlayer = currState.currentPlayer;
                const newCities = JSON.parse(JSON.stringify(currState.cities));
                const newUsers = JSON.parse(JSON.stringify(currState.users));
                
                newCities[adj].troops = currState.cities[i].troops - 1;
                newCities[i].troops = 1;
                
                newUsers[currentPlayer].numcities++;
                newUsers[currentPlayer].cities.push(adj);
                newCities[adj].user = currentPlayer;
                
                let other = currentPlayer == 1 ? 0 : 1;
                let x = newUsers[other].cities.indexOf(adj);
                newUsers[other].cities.splice(x,1);
                newUsers[other].numcities--;

                newState = new MyState(currState.myIndex, numOfStates, heuristic(newCities, currentPlayer), currState.cost + 1, newUsers, newCities, currentPlayer, i, adj);

                if (!allStatesHash.has(newState.stateString)) {
                    allStatesHash.add(newState.stateString);
                    allStates.push(newState);
                    numOfStates++;
                    pqueue.queue(newState);
                }
            }
        }
    }
}
