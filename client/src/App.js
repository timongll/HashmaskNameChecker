import React, { Component } from "react";
import "./App.css";
import getWeb3 from "./getWeb3.js";
import Input from '@material-ui/core/Input';
import Hashmask from "./build/hashmask.json";

const hashmaskAddress = "0xC2C747E0F7004F9E8817Db2ca4997657a7746928"

class App extends Component {
  constructor(props){
    super(props);

   this.state={
    web3: "",
    accounts: "",
    hashmaskContract: "",
    name: "",
    isNameAvailable: false

    
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
        hashmaskContract: hashmaskContract
      })

      var isNameAvailable;
      setInterval(async () => {
        await this.state.hashmaskContract.methods.isNameReserved(this.state.name).call().then(async val=>{
          if(val){
            isNameAvailable = "NO"
          } else {
            isNameAvailable = "YES"
          }
        })
      this.setState({isNameAvailable: isNameAvailable})
      }, 100);
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
    }
  };


  handleChangeTempName = (event) => {
    this.setState({name: event.target.value});
  }

  render() {
    return (
      <div className="App"> 
        <h1> HashMask Name Checker </h1>
        <body> is name available?:  {(this.state.isNameAvailable).toString()}
        <br></br>
        <br></br>
        <Input type="text" placeholder="" onChange={this.handleChangeTempName}/>     
        <br></br>
         </body>
         
      </div>
    );
  }
}
export default App;
