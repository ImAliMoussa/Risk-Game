function cityHueristic(adj, newCities, currentPlayer) {
    let sum = 0;
    for (let i of adjaceny[adj]) {
        if (newCities[i].user != currentPlayer) {
            sum += newCities[i].troops;
        }
    }
    return Math.ceil(sum / newCities[adj].troops);
}

function genNextStatesDead(currState) {
    for (let i = 0; i < currState.cities.length; i++) {
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
                newUsers[other].cities.splice(x, 1);
                newUsers[other].numcities--;

                let newHeuristic = cityHueristic(adj,newCities,currentPlayer);
                newState = new MyState(currState.myIndex, numOfStates, currState.heuristic+newHeuristic, currState.cost + 1, newUsers, newCities, currentPlayer, i, adj);

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
