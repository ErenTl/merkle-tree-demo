import React, { Component } from 'react';
import {variables} from '../Variables.js';

import getWeb3 from "../getWeb3";

export class SigningPage extends Component{
    
    constructor(props) {
        super(props);

        this.state = {
            networkId:null,
            web3:null,
            accounts:null,

            message:"",
            messageHash:""
        }
    }

    async componentDidMount() {
        try{
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();

            await this.setState({networkId:networkId, web3, accounts,  web3bool:true });


            console.log("networkId: " + networkId);

        }catch(e) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
              );
        }

        //this.setState({addresses:[...this.state.addresses, ""]});
        console.log("SigningPage mounted");
    }

    async signMessage() {
        const {web3, accounts, message} = this.state;
        const messageHash = web3.utils.sha3(message);
        const signature = await web3.eth.sign(messageHash, accounts[0]);
        console.log("address: " + accounts[0]);
        console.log("message hash: " + messageHash);
        console.log("signature: " + signature +"\n \n \n");
        this.setState({messageHash:messageHash, signature:signature});
    }

    change_message = (e) => {
        this.setState({message:e.target.value});
    }

    render() {
        const {message, messageHash} = this.state;
        return (
            <div>

                <div className='modal-content border border-1 border-dark rounded'>
                    <div className='modal-header'>
                        <h5 className='modal-title'> Sign </h5>
                    </div>
                    <div className='modal-body'>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Message</span>
                            <input type="text" className='form-control'
                                value={message}
                                onChange={this.change_message}>
                            </input>
                        </div>
                    </div>
                    <button type='button' className='btn btn-primary float-start' onClick={()=>this.signMessage()} >
                        Send 
                    </button>        
                </div>
                

            </div>
        );
    }

}