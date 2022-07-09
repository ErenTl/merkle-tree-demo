import React, { Component } from 'react';
import {variables} from '../Variables.js';

import getWeb3 from "../getWeb3";

export class MintPage extends Component{
    
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    async componentDidMount() {
        try{
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();

            console.log("networkId: " + networkId);

        }catch(e) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
              );
        }

        //this.setState({addresses:[...this.state.addresses, ""]});
        console.log("MintPage mounted");
    }

    render() {
        return (
            <div>
                <h1>Mint Page</h1>
                <button onClick={this.sendMintToBE}>Mint</button>
            </div>
        );
    }

}