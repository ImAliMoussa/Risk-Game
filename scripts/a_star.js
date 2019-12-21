//alert("ASTART");
function a_star(users, cities, currentPlayer) {
    numOfStates = 0;
    allStatesHash = new Set();
    allStates = [];
    pqueue = new PriorityQueue({
        comparator: function(a, b) {
            return a.cost + a.heuristic - b.cost - b.heuristic;
        }
    });

    let startingState = new MyState(-1, 0, heuristic(cities, currentPlayer), 0, users, cities, currentPlayer, -1, -1);

    allStates.push(startingState);

    numOfStates++;
    allStatesHash.add(startingState.stateString);
    pqueue.queue(startingState);
    let goalNode = null;

    const maxDepth = 2;
    while (pqueue.length > 0){
        currState = pqueue.dequeue();

        if (currState.cost > maxDepth) {
            if (goalNode == null) {
                goalNode = currState;
            }
            else if (goalNode.heuristic > currState.heuristic) {
                goalNode = currState;
            }
            continue;
        }

        if (currState.heuristic == 0) {
            goalNode = currState;
            alert("goal found");
            break;
        }

        // gen all next states and add to data structures
        genNextStates(currState);
    }

    return goalNode;
}

async function AstartAttack(currentPlayer){
    let result = a_star(users, cities, currentPlayer);
    let pathToBest = [];

    if(result!=null){
        let currentIndex = result.myIndex;
        
        while (allStates[currentIndex].parentIndex != -1) {
            pathToBest.push(allStates[currentIndex]);
            currentIndex = allStates[currentIndex].parentIndex;
        }

        for(let i=pathToBest.length-1; i >= 0; i--){
            cities=pathToBest[i].cities;
            users=pathToBest[i].users;
            displayAttack(pathToBest[i].countryThatAttacked, pathToBest[i].oppAttackedCountry, currentPlayer);
            await sleep(pause);
        }
    }
}
