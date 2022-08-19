import React, { Component } from 'react';
import {variables} from '../Variables.js';

import getWeb3 from "../getWeb3";

export class SignEIP712Page extends Component{
    
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
        const domain = [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" }/*,
            { name: "salt", type: "bytes32" },*/
        ];
        const identity = [
            { name: "userId", type: "uint256" },
            { name: "wallet", type: "address" },
        ];
        const bid = [
            { name: "amount", type: "uint256" },
            { name: "bidder", type: "Identity" },
        ];
        const text = [
            { name: "you", type: "string" },
        ];

        const assetType = { ERC20:0 , ERC721:1 , ERC1155:2 , PLATFORM_TOKEN:3 };

        const asset = [
            { name: "token",        type: "address" },
            { name: "tokenId",      type: "uint256" },
            { name: "assetType",    type: "uint8" },
            { name: "value",        type: "uint256" },
        ];

        const order = [
            { name: "makerAddress", type: "address" },
            { name: "makeAsset",    type: "Asset" },
            { name: "takerAddress", type: "address" },
            { name: "takeAsset",    type: "Asset" },
            { name: "startTime",    type: "uint256" },
            { name: "endTime",      type: "uint256" },
            //{ name: "salt",         type: "bytes32" }//,
            //{ name: "signature",    type: "bytes" },
        ];

        const orderMessage = {
            makerAddress: "0x0000000000000000000000000000000000000000",
            makeAsset: {
                token: "0x0000000000000000000000000000000000000000",
                tokenId: this.state.message,
                assetType: 1,
                value: 0
            },
            takerAddress: "0x0000000000000000000000000000000000000000",
            takeAsset: {
                token: "0x0000000000000000000000000000000000000000",
                tokenId: 0,
                assetType: 1,
                value: 0
            },
            startTime: 0,
            endTime: 0//,
            //salt: "0xbbd9b3d6597f2d45b16e86bdea8cfb900677dc237538800c8a1a89322ee9589750c317fd6bf0039915271abdcb02b9ceec216186744093fc634ee8904c77c66d1b"
            /*salt: this.state.web3.utils.soliditySha3(
                {type: "bytes", value: "0xbbd9b3d6597f2d45b16e86bdea8cfb900677dc237538800c8a1a89322ee9589750c317fd6bf0039915271abdcb02b9ceec216186744093fc634ee8904c77c66d1b"}
            )*/
            //salt: "0xd29d68723b4804c872f07628f699d356ea7e8e5a389b5db3dab1143f5dae3666" ORIGINAL
            //signature: "0xbbd9b3d6597f2d45b16e86bdea8cfb900677dc237538800c8a1a89322ee9589750c317fd6bf0039915271abdcb02b9ceec216186744093fc634ee8904c77c66d1b"
        }
        
        const domainData = {
            name: "My amazing dApp",
            version: "2",
            chainId: 1337,
            verifyingContract: "0x1C56346CD2A2Bf3202F771f50d3D14a367B48070"/*,
            salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558"*/
        };
        var message = {
            amount: 100,
            bidder: {
                userId: 323,
                wallet: "0x3333333333333333333333333333333333333333"
            }
        };

        var textMessage = {
            you: this.state.message
        };

        
        const data = JSON.stringify({
            types: {
                EIP712Domain: domain,
                Order: order,
                Asset: asset
                //Bid: bid,
                //Identity: identity,
                //DD: text
            },
            domain: domainData,
            //primaryType: "DD",
            //primaryType: "Bid",
            primaryType: "Order",
            message: orderMessage
        });

        
        this.getSignatureFromMetaMask(data, orderMessage, this.state.accounts[0]);
        

    }

    async getSignatureFromMetaMask(data, message, account) {
        const{web3} = this.state;
        await web3.currentProvider.sendAsync(
            {
                method: "eth_signTypedData_v4",
                params: [this.state.accounts[0], data],
                from: this.state.accounts[0]
            },
            async function(err, result) {
                if (err) {
                    return console.error(err);
                }
                /*var signature = result.result.substring(2);
                const r = "0x" + signature.substring(0, 64);
                const s = "0x" + signature.substring(64, 128);
                const v = parseInt(signature.substring(128, 130), 16);
                // The signature is now comprised of r, s, and v.
                console.log("r:" + r);
                console.log("s:" + s);
                console.log("v:" + v);*/
                var signature = result.result;
                console.log("signature: " + signature);
                console.log("data: " + JSON.stringify({Data: data}));

                const response = await fetch (variables.API_URL+"MerkleTree/validate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: message,
                        signature: signature,
                        address: account
                    })
                });

                const res = await response.json();
                console.log("data: " + res);
                if(res == true) {
                    alert("validation is successful");
                } else {
                    alert("validation is not successful");
                }

                }
            );
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
                        <h5 className='modal-title'> Sign (just number)</h5>
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