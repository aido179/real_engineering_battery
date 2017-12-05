/*
Do calculations to get the output values.

These functions default to defaultOutputAccuracy decimal places of accuracy.
Internally, however, when functions depend on other output functions, they
use defaultInternalAccuracy.
This should mitigate loss of accuracy, but because the state will end up with
defaultOutputAccuracy, some loss of accuracy will occur.

*/


/*
EXPECTED STRUCTURE (AND DEFAULT VALUES) OF STATE.
//constants
densityOfAir:1.2,
gravity:9.8,
frontArea:7.2,
meanAccel:0.112,
battWheelEff:0.85,
brakeEff:0.97,
totalWeight:36000,
roadGradient:0,
timeOnGrade:0,
packingBurden:0.48,
//Variables
range:804670,
avgVelocity:22.352,
meanRollingResistance:0.0063,
coeffDrag:0.36,
energyDensity:250,
battCost:190,
//outputs
dragComponent: 0,
rollingResistanceComponent:0,
roadGradientComponent:0,
inertialComponent:0,
battCapWS: 0,
battCapKWH: 0,
weight:0,
cost:0
*/

const defaultOutputAccuracy = 2
const defaultInternalAccuracy = 6; //decimal places

exports.DragComponent = function(state, decimalPlaces = defaultOutputAccuracy){

  let res = 0.5*state.densityOfAir*state.coeffDrag*state.frontArea*(Math.pow(state.avgVelocity, 3));
  if(isNaN(res)) res = 0;
  return res.toFixed(decimalPlaces);
};

exports.RollingResistanceComponent = function(state, decimalPlaces = defaultOutputAccuracy){
  let res = state.meanRollingResistance*state.totalWeight*state.gravity*state.avgVelocity;
  if(isNaN(res)) res = 0;
  return res.toFixed(decimalPlaces);
};

exports.RoadGradientComponent = function(state, decimalPlaces = defaultOutputAccuracy){
  let res = state.timeOnGrade*state.totalWeight*state.gravity*state.avgVelocity*state.roadGradient;
  if(isNaN(res)) res = 0;
  return res.toFixed(decimalPlaces);
};

exports.InertialComponent = function(state, decimalPlaces = defaultOutputAccuracy){
  let res = 0.5*state.totalWeight*state.avgVelocity*state.meanAccel*((1/state.battWheelEff)-(state.battWheelEff*state.brakeEff));
  if(isNaN(res)) res = 0;
  return res.toFixed(decimalPlaces);
};

exports.BattCapWS = function(state, decimalPlaces = defaultOutputAccuracy){
  //splitting up the equation into smaller chunks...
  //just prevents one long line of variables and brackets.
  //I would give them more descriptive names but I'm honestly
  //not entirely sure what they should be called.
  let comps = (parseFloat(this.DragComponent(state, defaultInternalAccuracy))+parseFloat(this.RollingResistanceComponent(state, defaultInternalAccuracy))+parseFloat(this.RoadGradientComponent(state, defaultInternalAccuracy)));
  let distVelocity = (state.range/state.avgVelocity);

  let res = ((comps/state.battWheelEff)+parseFloat(this.InertialComponent(state, defaultInternalAccuracy)))*distVelocity;

  if(isNaN(res)) {
    res = 0;
  }
  return res.toFixed(decimalPlaces);
};

exports.BattCapKWH = function(state, decimalPlaces = defaultOutputAccuracy){
  let res = this.BattCapWS(state, defaultInternalAccuracy)/(60*60*1000);
  if(isNaN(res)) res = 0;
  return res.toFixed(decimalPlaces);
};

exports.Weight = function(state, decimalPlaces = defaultOutputAccuracy){
  let res = (this.BattCapKWH(state, defaultInternalAccuracy)*1000)/(state.energyDensity*state.packingBurden);
  if(isNaN(res)) res = 0;
  return res.toFixed(decimalPlaces);
};

exports.Cost = function(state, decimalPlaces = defaultOutputAccuracy){
  let res = this.BattCapKWH(state, defaultInternalAccuracy)*state.battCost;
  if(isNaN(res)) res = 0;
  return res.toFixed(decimalPlaces);
};
