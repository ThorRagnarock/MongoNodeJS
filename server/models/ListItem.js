class ListItem {
  productName;
  recycleCat;   //genralRecycle: 1, glass:1 - what color codes are on the product
  auxInfo;
  ofList;       //id of list this item belongs to 
  barCode;      //optional
  productPoints;
  ticked;
  readyForRecycle;

  constructor(productName, recycleCat, auxInfo, ofList, barCode, productPoints, ticked, readyForRecycle) {
    this.productName = productName;
    this.recycleCat = recycleCat;
    this.auxInfo = auxInfo;
    this.ofList = ofList; 
    this.barCode = barCode; 
    this.productPoints = productPoints;
    this.ticked = ticked;
    this.readyForRecycle = readyForRecycle;
  }
}