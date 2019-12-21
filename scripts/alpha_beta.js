class AlphaBetaState {

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
        currentPlayer, countryThatAttacked, oppAttackedCountry,
        iWantMin) {
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
        this.bestChild = null;
        this.alpha = -3000;
        this.beta = 3000;
    }
}

function heuristic(cities, currentPlayer) {
    let sum = 0;
    for (const city in adjaceny) {
        let curr = 0;
        if (cities[city].user != currentPlayer) continue;

        for (const adj of adjaceny[city]) {
            if (cities[adj].user != cities[city].user) {
                curr += cities[adj].troops;
            }
        }

        curr = Math.ceil(curr / cities[city].troops);
        sum += curr;
    }

    return sum;
}

function alpha_beta(currState) {
    if (currState.cost == 3) {
        return [currState.heuristic, currState.myIndex];
    }

    let best = -555;
    let bestChild = null;

    if (currState.iWantMin) {
        best = 2000;

        for (let i = 0; i < currState.cities.length; i++) {
            if (cities[i].user != currState.currentPlayer)
                continue;

            for (let adj of adjaceny[i]) {
                if (currState.cities[adj].user == currState.currentPlayer) continue;

                let mytroops = currState.cities[i].troops;
                if (mytroops == 1) break;
                let opponenttroops = currState.cities[adj].troops;
                if (mytroops > opponenttroops) {
                    //I lost the battle
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
                    newUsers[other].cities.splice(x, 1);
                    newUsers[other].numcities--;

                    let newState = new AlphaBetaState(currState.myIndex, numOfStates, heuristic(newCities,
                        currentPlayer), currState.cost + 1, newUsers, newCities, other,
                        i, adj, !currState.iWantMin);

                    if (!allStatesHash.has(newState.stateString)) {
                        //allStatesHash.add(newState.stateString);
                        allStates.push(newState);
                        numOfStates++;
                    } else {
                        continue;
                    }

                    let [val, child] = alpha_beta(newState);
                    // best = Math.max(best, val);
                    if (val > best) {
                        best = val;
                        currState.bestChild = newState;
                    }
                    currState.beta = Math.max(currState.alpha, best);

                    if (currState.beta <= currState.alpha){
                        break;
                    }
                }
            }
        }
    }

    else {
        best = -2000;

        for (let i = 0; i < currState.cities.length; i++) {
            if (cities[i].user != currState.currentPlayer)
                continue;

            for (let adj of adjaceny[i]) {
                if (currState.cities[adj].user == currState.currentPlayer) continue;

                let mytroops = currState.cities[i].troops;
                if (mytroops == 1) break;
                let opponenttroops = currState.cities[adj].troops;
                if (mytroops > opponenttroops) {
                    //I lost the battle
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
                    newUsers[other].cities.splice(x, 1);
                    newUsers[other].numcities--;

                    let newState = new AlphaBetaState(currState.myIndex, numOfStates, heuristic(newCities,
                        currentPlayer), currState.cost + 1, newUsers, newCities, other,
                        i, adj, !currState.iWantMin);

                    if (!allStatesHash.has(newState.stateString)) {
                        //allStatesHash.add(newState.stateString);
                        allStates.push(newState);
                        numOfStates++;
                    } else {
                        continue;
                    }

                    let [val, child] = alpha_beta(newState);
                    // best = min(best, val);
                    if (val < best) {
                        best = val;
                        currState.bestChild = newState;
                    }
                    currState.beta = Math.min(currState.beta, best);

                    if (currState.beta <= currState.alpha){
                        break;
                    }
                }
            }
        }
    }
    return [best, currState.bestChild];
}

async function alpha_beta_init(currentPlayer) {
    let startingState = new AlphaBetaState(-1, 0, heuristic(cities,
        currentPlayer), 0, users, cities, currentPlayer,
       -1, -1, true);

    allStates = [];
    allStatesHash = new Set();
    numOfStates = 1;
    allStates.push(startingState);
    allStatesHash.add(startingState.stateString);
    let [best, bestChild] = alpha_beta(startingState);
    if (bestChild != null) {
        cities = bestChild.cities;
        users = bestChild.users;
        displayAttack(bestChild.countryThatAttacked, bestChild.oppAttackedCountry, currentPlayer);
        await sleep(pause);
    } else {
        console.log(bestChild, best);
    }
}