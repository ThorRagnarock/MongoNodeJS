const DB = require('../utils/db')

class ListItem {
  userItemStr;   //AKA userString, productName- userItemStr
  tickToggle;
  groceryPoints;

  packaging;   //genralRecycle: 1, glass:1 - what color codes are on the product
  colors;
  feedbackFlag; //bool
  //userFeedback: "" 
  //barCode;      //optional
  constructor(userItemStr) {
    this.userItemStr = userItemStr;
    this.tickToggle = false;
    this.groceryPoints = 1;
    
    this.feedbackFlag = false;
    this.userFeedback = "";

    //Aggregation function comes here

    this.packaging = packaging; //do I need to get that later? 
    this.colors = colors;       //do I need to get that later? 
  }
  //from here I operate the aggregation 
  
}

module.exports = ListItem;


