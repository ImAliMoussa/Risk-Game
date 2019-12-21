function a_star_dead(users, cities, currentPlayer) {
    numOfStates = 0;
    allStatesHash = new Set();
    allStates = [];
    pqueue = new PriorityQueue({
        comparator: function (a, b) {
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
    while (pqueue.length > 0) {
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
        genNextStatesDead(currState);
    }

    return goalNode;
}

