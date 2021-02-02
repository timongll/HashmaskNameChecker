import React, { Component } from "react";
import "./App.css";
import getWeb3 from "./getWeb3.js";
import Input from '@material-ui/core/Input';
import Hashmask from "./build/hashmask.json";
import HashImg from "./hashmask.jpg";
const hashmaskAddress = "0xC2C747E0F7004F9E8817Db2ca4997657a7746928"

class App extends Component {
  constructor(props){
    super(props);

   this.state={
    web3: "",
    accounts: "",
    hashmaskContract: "",
    name: "",
    isNameAvailable: "",
    isValid: ""

    
   }

  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const hashmaskContract = new web3.eth.Contract(
        Hashmask.abi,
        hashmaskAddress,
      );

      var userAccount;
      const accounts = await web3.eth.getAccounts();
      if (accounts[0] !== userAccount) {
        userAccount = accounts[0];
      }



      this.setState({ 
        accounts: userAccount,
        web3: web3, 
        hashmaskContract: hashmaskContract,
        name: ""
      })

      //var letterNumber = /^[A-Za-z0-9 ]+$/;

      var isNameAvailable;
      var isValid;
      setInterval(async () => {
        /*if((this.state.name).charAt(0)===" " || (this.state.name).charAt(((this.state.name).length)-1)===" "){
          this.setState({error: "first or last character cant be space"})
        } else if((this.state.name).includes("  ")){
          this.setState({error: "no double space"})
        } else if((this.state.name).length>25){
          this.setState({error: "only 25 symbols"})
        } //else if(!letterNumber.test(this.state.name)){
          //this.setState({error: "only alphanumerical digits"})
        //} 
          else {
          this.setState({error: ""});
          */
          await this.state.hashmaskContract.methods.isNameReserved(this.state.name).call().then(async val=>{
          if(val){
            isNameAvailable = "No"
          } else {
            isNameAvailable = "Yes"
          }
        })
        await this.state.hashmaskContract.methods.validateName(this.state.name).call().then(async val=>{
          if(val){
            isValid = "Valid name"
          } else {
            isValid = "Invalid name"
          }
        })
      this.setState({isNameAvailable: isNameAvailable})
      this.setState({isValid: isValid})
      }, 100);

    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
    }
  };


  handleChangeTempName = async (event) => {
    this.setState({name: event.target.value});
  }

  render() {
    return (
      <div className="App"> 
        <h1> HashMask Name Checker </h1>
        <body> Is name available?:  {(this.state.isNameAvailable).toString()}
        <br></br>
        <br></br>
        <Input type="text" placeholder="" onChange={this.handleChangeTempName}/>     
        <br></br>
        <br></br>
        {this.state.isValid}
        <br></br>
        <br></br> 
        <img src= {HashImg} size = "50%" alt="hashimg" class="center"></img>
         </body>
         
      </div>
    );
  }
}
export default App;
