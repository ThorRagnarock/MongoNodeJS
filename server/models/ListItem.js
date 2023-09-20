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


  constructor(userItemStr, tickToggle, groceryPoints, packaging, colors, feedbackFlag) {
    this.userItemStr = userItemStr;
    this.tickToggle = tickToggle;
    this.groceryPoints = groceryPoints;
    this.packaging = packaging;
    this.colors = colors;
    this.feedbackFlag = feedbackFlag;
    this.userFeedback = "";
  }
  //from here I operate the aggregation 
  
}

module.exports = ListItem;


