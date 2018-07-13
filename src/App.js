import React, { Component } from 'react';
import './App.css';
import * as output from './outputCalculations.js';
import MathJax from 'react-mathjax-preview'

const math = String.raw`
$$
E_p = \Bigg[\Bigg( \frac{1}{2}\rho \cdot C_d \cdot A \cdot v_{rms}^3 + C_{rr} \cdot W_t \cdot g \cdot v + T_f  \cdot W_t \cdot g \cdot v \cdot Z\Bigg)/N_{bw}
+ \frac{1}{2} W_t \cdot v \cdot a
\Bigg(  \frac{1}{ \eta_{bw}} -\eta_{bw} \cdot \eta_{brk}\Bigg)
 \Bigg] \Big( \frac{D}{v} \Big)
 $$
`

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
      cost:0,
      //Conversions
      conversionMPH: 50,
      conversionMPS: 22.352,
      conversionMiles: 500,
      conversionMetres: 804670,
    };

    this.handleChange = this.handleChange.bind(this);
    this.milesToMetres = this.milesToMetres.bind(this);
    this.metresToMiles = this.metresToMiles.bind(this);
    this.mphToMps = this.mphToMps.bind(this);
    this.mpsToMph = this.mpsToMph.bind(this);
  }
  handleChange(event){
    //update state with new value
    let state = event.target.getAttribute("data-var");
    this.setState({[state]: event.target.value});
    //calculate outputs
    this.calculateOutput();
    //force new values to be rendered
    this.forceUpdate();
  }
  calculateOutput(){
    //uses special form of set state acceptinga  function so that asynchronous
    //state updates don't screw things up.
    this.setState((prevState, props)=>({dragComponent:               output.DragComponent(prevState)}));
    this.setState((prevState, props)=>({rollingResistanceComponent:  output.RollingResistanceComponent(prevState)}));
    this.setState((prevState, props)=>({roadGradientComponent:       output.RoadGradientComponent(prevState)}));
    this.setState((prevState, props)=>({inertialComponent:           output.InertialComponent(prevState)}));
    this.setState((prevState, props)=>({battCapWS:                   output.BattCapWS(prevState)}));
    this.setState((prevState, props)=>({battCapKWH:                  output.BattCapKWH(prevState)}));
    this.setState((prevState, props)=>({weight:                      output.Weight(prevState)}));
    this.setState((prevState, props)=>({cost:                        output.Cost(prevState)}));
  }
  milesToMetres(event){
    this.setState({conversionMiles: event.target.value});
    this.setState({conversionMetres: (event.target.value*1609.34).toFixed(2)});
  }
  metresToMiles(event){
    this.setState({conversionMetres: event.target.value});
    this.setState({conversionMiles: (event.target.value/1609.34).toFixed(2)});
  }
  mphToMps(event){
    this.setState({conversionMPH: event.target.value});
    this.setState({conversionMPS: (event.target.value*0.44704).toFixed(2)});
  }
  mpsToMph(event){
    this.setState({conversionMPS: event.target.value});
    this.setState({conversionMPH: (event.target.value/0.44704).toFixed(2)});
  }
  componentDidMount(){
    this.calculateOutput();
    this.forceUpdate();
  }
  render() {
    return (
      <div className="App">
        <div className="patreon-link">
          <a href="https://www.patreon.com/realengineering">
            <img className="img-third" src="/img/patreon.png"/>
          </a>
        </div>
        <header className="App-header">
          <img src="/img/logo500.png" className="App-logo" alt="logo" />
          <div className="Video-box">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/oJ8Cf0vWmxE?rel=0&amp;showinfo=0" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
          </div>
          <h1 className="App-title">Calculating Battery Capacity Required for Electric Vehicles</h1>
        </header>
        <section className="App-content">

          <div className="row">
            <div className="col col25 text-right spaceAbove">
              <h3>Cost:</h3>
              <p className="outputText">${this.state.cost}</p>
            </div>
            <div className="col col50">
              <img src="/img/tesla1.png" alt="A Tesla electric vehicle." className="outputImage"/>
            </div>
            <div className="col col25 spaceAbove">
              <h3>Weight:</h3>
              <p className="outputText">{this.state.weight}Kg</p>
            </div>
          </div>
          <div className="row">
            <div className="col col100 text-center">
              <h3>Required Battery Capacity:</h3>
              <p className="outputText">{this.state.battCapKWH}kWh</p>
            </div>
          </div>
          <div className="row">
            <div className="col col100 text-center">
              <h3>Try changing the values below.</h3>
            </div>
          </div>
          <div className="row">
            <div className="col col50">
              <h2>Constants</h2>
              <table>
                <tbody>
                  <tr>
                    <td>ρ, density of air (kg/m³)</td><td><VariableInput var="densityOfAir" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                  <tr>
                    <td>g,acceleration due to gravity (m/s²)</td><td><VariableInput var="gravity" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                  <tr>
                    <td>A, frontal area of the vehicle (m²)</td><td><VariableInput var="frontArea" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                  <tr>
                    <td>a, mean acceleration/deceleration of vehicle (m/s²)</td><td><VariableInput var="meanAccel" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                  <tr>
                    <td>ηbw, battery-to-wheels efficiency</td><td><VariableInput var="battWheelEff" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                  <tr>
                    <td>ηbrk, braking efficiency (with regenerative braking)</td><td><VariableInput var="brakeEff" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                  <tr>
                    <td>Wt, Total Weight (kg)</td><td><VariableInput var="totalWeight" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                  <tr>
                    <td>Z, road gradient (%/100)</td><td><VariableInput var="roadGradient" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                  <tr>
                    <td>tf, fraction of time spent on road grade (%)</td><td><VariableInput var="timeOnGrade" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                  <tr>
                    <td>fburden, packing burden factor.</td><td><VariableInput var="packingBurden" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col col50">
              <h2>Variables</h2>
              <table>
                <tbody>
                  <tr>
                    <td>D, range (m)</td><td><VariableInput var="range" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                  <tr>
                    <td>v, average velocity (m/s)</td><td><VariableInput var="avgVelocity" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                  <tr>
                    <td>Crr, mean rolling resistance</td><td><VariableInput var="meanRollingResistance" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                  <tr>
                    <td>Coefficient of drag</td><td><VariableInput var="coeffDrag" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                  <tr>
                    <td>Energy Density (Wh/kg)</td><td><VariableInput var="energyDensity" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                  <tr>
                    <td>Battery Cost ($/kWh)</td><td><VariableInput var="battCost" handleChange={this.handleChange} state={this.state}></VariableInput></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col col100">
              <h2>Equation</h2>
              <MathJax math={math} />
            </div>
          </div>
          <div className="row">
            <div className="col col100">
              <h2>Output</h2>
              <table>
                <tbody>
                  <tr>
                    <td>Drag Component</td><td><input type="number" value={this.state.dragComponent} readOnly></input></td>
                  </tr>
                  <tr>
                    <td>Rolling Resistance Component </td><td><input type="number" value={this.state.rollingResistanceComponent} readOnly></input></td>
                  </tr>
                  <tr>
                    <td>Road Gradient Component</td><td><input type="number" value={this.state.roadGradientComponent} readOnly></input></td>
                  </tr>
                  <tr>
                    <td>Inertial Component</td><td><input type="number" value={this.state.inertialComponent} readOnly></input></td>
                  </tr>
                  <tr>
                    <td>Required Battery Capacity (Watt Second)</td><td><input type="number" value={this.state.battCapWS} readOnly></input></td>
                  </tr>
                  <tr>
                    <td>Required Battery Capacity (kWh)</td><td><input type="number" value={this.state.battCapKWH} readOnly></input></td>
                  </tr>
                  <tr>
                    <td>Weight (kg)</td><td><input type="number" value={this.state.weight} readOnly></input></td>
                  </tr>
                  <tr>
                    <td>Cost ($)</td><td><input type="number" value={this.state.cost} readOnly></input></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col col50 col25-offset">
              <h2>Metric Conversions for the Barbarians</h2>
              <table>
                <tbody>
                  <tr>
                    <td>Miles</td><td>Metres</td>
                  </tr>
                  <tr className="noBorder">
                    <td><input type="number" onChange={this.milesToMetres} value={this.state.conversionMiles}/></td><td><input type="number" onChange={this.metresToMiles} value={this.state.conversionMetres}/></td>
                  </tr>
                  <tr>
                    <td>Miles per Hour</td><td>Metres per Second</td>
                  </tr>
                  <tr className="noBorder">
                    <td><input type="number" onChange={this.mphToMps} value={this.state.conversionMPH}/></td><td><input type="number" onChange={this.mpsToMph} value={this.state.conversionMPS}/></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <footer>
          <a href="https://www.youtube.com/channel/UCR1IuLEqb6UEA_zQ81kwXfg"><img src="/img/logo500.png" className="footer-icon" alt="logo" /></a>
          <a href="https://github.com/aido179/real_engineering_battery"><img src="/img/GitHub-Mark-Light-64px.png" className="footer-icon" alt="logo" /></a>
          <a href="http://apbsoftware.ie"><img src="/img/apb.png" className="footer-icon" alt="logo" /></a>

        </footer>
      </div>
    );
  }
}

class VariableInput extends Component{
  render() {
    let val = this.props.state[this.props.var];
    return (
      <input type="number" data-var={this.props.var} onChange={this.props.handleChange} value={val}></input>
    )
  }
}

export default App;
