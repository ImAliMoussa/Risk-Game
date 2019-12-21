class MinMaxState {

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

    constructor(parentIndex, myIndex, heuristic, cost, currusers, currcities,
      currentPlayer, countryThatAttacked, oppAttackedCountry, iWantMin) {
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
        this.iWantMin = iWantMin;
        this.bestChildIndex = -1;
        this.bestChildHeuristic = null;
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

let stack = [];

function genNextStatesMinMax(currState) {
    let finished = true;
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

                //newState = new MyState(currState.myIndex, numOfStates, heuristic(newCities,
                //  currentPlayer), currState.cost + 1, newUsers, newCities,
                //  currentPlayer, i, adj);

                newState = new MinMaxState(currState.myIndex, numOfStates, heuristic(newCities,
                currentPlayer), currState.cost + 1, newUsers, newCities, other,
              i, adj, !currState.iWantMin);

                if (!allStatesHash.has(newState.stateString)) {
                    //allStatesHash.add(newState.stateString);
                    allStates.push(newState);
                    numOfStates++;
                    stack.push(newState);
                    finished = false;
                }
            }
        }
    }
    return finished;
}

async function minmax(currentPlayer){
    numOfStates = 0;
    allStatesHash = new Set();
    allStates = [];
    stack = [];

    let other = (currentPlayer + 1) % 2;
    let startingState = new MinMaxState(-1, 0, heuristic(cities,
    currentPlayer), 0, users, cities, currentPlayer,
  -1, -1, true);

    allStates.push(startingState);
    stack.push(startingState);

    numOfStates++;

    const maxDepth = 2;
    while (stack.length > 0){
        currState = stack[stack.length - 1];

        allStatesHash.add(currState.stateString);
        let finished = true;
        if (currState.cost <= 2) finished = genNextStatesMinMax(currState);
        if (finished) {
            stack.pop();
            if (currState.myIndex > 0) {
                let par = allStates[currState.parentIndex];
                if (par.bestChildHeuristic == null){
                    par.bestChildHeuristic = currState.heuristic;
                    par.bestChildIndex = currState.myIndex;
                } else {
                    if (par.iWantMin) {
                        if (par.bestChildHeuristic > currState.heuristic) {
                          par.bestChildHeuristic = currState.heuristic;
                          par.bestChildIndex = currState.myIndex;
                        }
                    } else {
                        if (par.bestChildHeuristic < currState.heuristic) {
                          par.bestChildHeuristic = currState.heuristic;
                          par.bestChildIndex = currState.myIndex;
                        }
                    }
                }
                // continue;
            }
        }

    }

    let bestNext = allStates[allStates[0].bestChildIndex];
    if (bestNext) {
        // console.log("min max has no moves");
        cities=bestNext.cities;
        users=bestNext.users;
        displayAttack(bestNext.countryThatAttacked,bestNext.oppAttackedCountry,currentPlayer);
        await sleep(pause);
    }
}
