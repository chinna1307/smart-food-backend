module.exports = function match(food, donors) {
  return donors.filter(d =>
    d.foodItem.toLowerCase().includes(food.toLowerCase())
  );
};
