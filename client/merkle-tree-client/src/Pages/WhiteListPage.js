import React, { Component } from 'react';

import {variables} from '../Variables.js';
import Web3 from "web3";
import getWeb3 from "../getWeb3";


import atokenContractJson from "C:/Users/eren_/Documents/demos/staj-projeleri/merkle_tree/truffle/build/contracts/atoken.json";
import atokenFactoryContractJson from "C:/Users/eren_/Documents/demos/staj-projeleri/merkle_tree/truffle/build/contracts/atokenFactory.json";

export class WhiteListPage extends Component{
    
    constructor(props) {
        super(props);

        this.state = {
            addresses: [""],

            web3bool:false,
            web3:null,
            accounts:null,
            atokenFactoryContract:null,
            networkId:null,

            createHash:[],

            
            _tokenUriPrefix:null,
            _name:null,
            _symbol:null,
            _maximumRoyaltyRate:null,
        }
    }
    
    async componentDidMount() {
        
        try{
            const web3 = await getWeb3();
            //const web3 = new Web3("HTTP://127.0.0.1:7545");
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();

            const atokenFactoryDeployedNetwork = atokenFactoryContractJson.networks[networkId];
            const atokenFactoryInstance = new web3.eth.Contract(atokenFactoryContractJson.abi, 
                atokenFactoryDeployedNetwork && atokenFactoryDeployedNetwork.address);

            await this.setState({networkId:networkId, web3, accounts, atokenFactoryContract: atokenFactoryInstance, web3bool:true });
            console.log("networkId: " + atokenContractJson.networks[networkId]);
            console.log("atoken address: ");
            console.log(atokenContractJson.networks[networkId].address);
            

        }catch(e) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
              );
        }

        //this.setState({addresses:[...this.state.addresses, ""]});
        console.log("WhiteListPage mounted");
    }

    async sendWhiteListToBE() {
        const {
            addresses
        } = this.state;

        const url = variables.API_URL+"MerkleTree/whitelist";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                address:addresses
            })
        });

        const data = await response.json();
        console.log("root is: " + data.rootString);
        await this.sendRootToFactoryContract(data.rootString);
    }

    async sendRootToFactoryContract(root) {
        const tx = await this.state.atokenFactoryContract.methods.setRoot(root).send({from: this.state.accounts[0]});
        console.log(tx);
    }   

    
    async getProofFromBE() {
        const url = variables.API_URL+"MerkleTree/proof";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                address:this.state.accounts[0]
            })
        });

        const data = await response.json();
        console.log("proof is: " + data.proofJson + " | leaf is: " + data.leaf);
        await this.atokenFactoryCreateContract(data.proofJson, data.leaf);
        console.log("getprooffrombe is end");
    }

    async atokenFactoryCreateContract(proof, leaf) {
        var obj = JSON.parse(proof);
        console.log(obj);
        
        var id = await this.state.atokenFactoryContract.methods
                .createCollection(this.state._tokenUriPrefix, this.state._name, this.state._symbol, this.state._maximumRoyaltyRate, 
                    obj,
                    leaf)
                .send({from:this.state.accounts[0]});
        this.setState({createHash:id});
        console.log("id: " + id.events.returnCollectionIdAndAddress.returnValues.collectionId + "| address: " + id.events.returnCollectionIdAndAddress.returnValues.collectionAddress);
    }
        
    changeAddresses = (index) => (e) => {
        const {
            addresses
        } = this.state;

        const newAddresses = [...addresses];
        newAddresses[index] = e.target.value;

        this.setState({
            addresses: newAddresses
        });
    }

    increaseAddresses() {
        const {
            addresses
        } = this.state;

        this.setState({
            addresses: [...addresses, ""]
        });
    }

    decreaseAddresses(index) {
        const {
            addresses
        } = this.state;

        const newAddresses = [...addresses];
        newAddresses.splice(index, 1);

        this.setState({
            addresses: newAddresses
        });
    }

    change_tokenUriPrefix = (e) => {
        this.setState({_tokenUriPrefix:e.target.value});
    }

    change_name = (e) => {
        this.setState({_name:e.target.value});
    }

    change_symbol = (e) => {
        this.setState({_symbol:e.target.value});
    }

    change_maximumRoyaltyRate = (e) => {
        this.setState({_maximumRoyaltyRate:e.target.value});
    }
    

    render() {

        const {
            addresses,
            
            
            _tokenUriPrefix,
            _name,
            _symbol,
            _maximumRoyaltyRate
        } = this.state;

        return (
            <div>
                <h1>White List Page</h1>
                <div className='modal-dialog'>
                    <div className='modal-md modal-dialog-centered '>
                        <div className='modal-content border border-1 border-dark rounded '>
                            <div className='modal-header col-4'>
                                <h5 className='modal-title'>New WhiteList</h5>
                                <button type="button" className='btn' onClick={()=>this.increaseAddresses()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-plus-square-fill" viewBox="0 0 16 16">
                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
                                    </svg>
                                </button>
                            </div>
                            <div className='modal-body'>
                                {Object.keys(addresses).map(x => 
                                    <div className='input-group '>
                                        <span className='input-group-text col-2'>Address {parseInt(x)+1}</span>
                                        <input type="text" className='form-control col-6'
                                            value={addresses[x]}
                                            onChange={this.changeAddresses(x)}>
                                        </input>
                                        <button type="button" className='btn mr-1 col-1' onClick={()=>this.decreaseAddresses(x)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-x-square-fill" viewBox="0 0 16 16">
                                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
                                            </svg>
                                        </button>
                                    </div>
                                )}
                                
                                
                            </div>
                            <button type='button' className='btn btn-primary float-start' onClick={()=>this.sendWhiteListToBE()} >
                                Send 
                            </button>
                        </div>

                        <div className='modal-content border border-1 border-dark rounded'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>{"createCollection"}</h5>
                            </div>
                            <div className='modal-body'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>string memory _tokenUriPrefix</span>
                                    <input type="text" className='form-control'
                                        value={_tokenUriPrefix}
                                        onChange={this.change_tokenUriPrefix}>
                                    </input>
                                </div>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>string memory _name</span>
                                    <input type="text" className='form-control'
                                        value={_name}
                                        onChange={this.change_name}>
                                    </input>
                                </div>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>string memory _symbol</span>
                                    <input type="text" className='form-control'
                                        value={_symbol}
                                        onChange={this.change_symbol}>
                                    </input>
                                </div>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>uint256 _maximumRoyaltyRate</span>
                                    <input type="text" className='form-control'
                                        value={_maximumRoyaltyRate}
                                        onChange={this.change_maximumRoyaltyRate}>
                                    </input>
                                </div>
                                
                            </div>
                            <button type='button' className='btn btn-primary float-start' onClick={()=>this.getProofFromBE()} >
                                Send 
                            </button>        
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}