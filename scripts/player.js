function putCity(city,User){
  if(cities[city].user==User||cities[city].user==-1){
    if(cities[city].user=-1){
      users[User].numcities++;
      users[User].cities.push(city);
    }
    cities[city].user=User;
    cities[city].troops++;
    displayNumArmies(city, User);
    return true;
  }
  return false;
}
function playerAttack(myCity,enemyCity,User){
  let ans=adjaceny[myCity].indexOf(enemyCity)
  if(cities[myCity].troops>1&&cities[myCity].user!=cities[enemyCity].user&&cities[myCity].user==User&&ans!=-1){
    if (cities[myCity].troops > cities[enemyCity].troops) {
            cities[enemyCity].troops = cities[myCity].troops - 1;
            cities[myCity].troops = 1;
            cities[enemyCity].user = User;

            users[User].cities.push(enemyCity);
            users[User].numcities++;

            let other = (User + 1) % 2;
            let index = users[other].cities.indexOf(enemyCity);
            users[other].cities.splice(index, 1);
            users[other].numcities--;
            displayAttack2(myCity, enemyCity, User);
            // await sleep(pause);
        }
      else {
            cities[myCity].troops = 1;
            displayNumArmies(myCity, User);
            // await sleep(pause);
      }
    return true;
  }
  return false;
}
