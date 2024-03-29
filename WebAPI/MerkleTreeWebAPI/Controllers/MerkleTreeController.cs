﻿using Microsoft.AspNetCore.Mvc;
using MerkleTreeWebAPI.Models;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Dynamic;
using Newtonsoft.Json.Linq;
using System.Linq;
using Nethereum.Signer.EIP712;
using Nethereum.Util;
using Nethereum.ABI.FunctionEncoding.Attributes;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MerkleTreeWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MerkleTreeController : ControllerBase
    {
        private string root;
        static MerkleTools.MerkleTree tree;

        private readonly Eip712TypedDataSigner _signer = new Eip712TypedDataSigner();

        internal TypedData<Domain> GetMailTypedDefinition()
        {
            return new TypedData<Domain>
            {
                Domain = new Domain
                {
                    Name = "My amazing dApp",
                    Version = "2",
                    ChainId = 1337,
                    VerifyingContract = "0x1C56346CD2A2Bf3202F771f50d3D14a367B48070"
                },
                Types = MemberDescriptionFactory.GetTypesMemberDescription(typeof(Domain), typeof(Models.Order), typeof(Models.Asset)),
                PrimaryType = nameof(Order),
            };
        }

        public MerkleTreeController()
        {
            if(tree == null)
            {
                tree = new MerkleTools.MerkleTree();
                var addressPath = Path.Combine(System.IO.Directory.GetCurrentDirectory(), "addressForLoad.json");
                var json = System.IO.File.ReadAllText(addressPath);

                var jsonSettings = new JsonSerializerSettings();
                jsonSettings.Converters.Add(new ExpandoObjectConverter());
                jsonSettings.Converters.Add(new StringEnumConverter());

                dynamic addressJson = JsonConvert.DeserializeObject<ExpandoObject>(json, jsonSettings);
                Console.WriteLine("deneme: " + addressJson.saltAddress.Count);
                //JArray saltAddresses = JArray.Parse(addressJson.saltAddress);
                
                for (int i = 0; i < addressJson.saltAddress.Count; i++)
                {
                    Console.WriteLine(i + ". addres is: " + addressJson.saltAddress[i]);
                    tree.AddLeaf(Encoding.ASCII.GetBytes(addressJson.saltAddress[i]), true);
                }


                Console.WriteLine("root is: " + Encoding.UTF8.GetString(tree.MerkleRootHash));
            }
        }


        //GET api/MerkleTree/proof
        [HttpPost("proof")]
        public async Task<ActionResult<Proof>> GetProof(Leaf leaf)
        {
            //we are getting users salt address via leaf.Address
            //and then we are getting its leaf by getting its hash via keccakFromByte function
            Console.WriteLine("Address is: " + leaf.Address);
            Console.WriteLine("root is from get proof: " + Encoding.UTF8.GetString(tree.MerkleRootHash));
            var leafHash = MerkleTools.MerkleTree.keccakFromByte(Encoding.ASCII.GetBytes(leaf.Address));
            var proofTemp = tree.GetProof(leafHash);

            Proof proof = new Proof();
            proof.ProofJson = proofTemp.ToJson();
            proof.Leaf = Encoding.UTF8.GetString(leafHash);
            return proof;
        }

        //POST api/MerkleTree/whitelist
        [HttpPost("whitelist")]
        public async Task<ActionResult<Root>> PostNewWhiteList(Addresses addresses)
        {
            tree =  new MerkleTools.MerkleTree();
            var addressPath = Path.Combine(System.IO.Directory.GetCurrentDirectory(), "addressForLoad.json");
            var json = System.IO.File.ReadAllText(addressPath);

            var jsonSettings = new JsonSerializerSettings();
            jsonSettings.Converters.Add(new ExpandoObjectConverter());
            jsonSettings.Converters.Add(new StringEnumConverter());

            dynamic addressJson = JsonConvert.DeserializeObject<ExpandoObject>(json, jsonSettings);
            List<string> addressList = new List<string>() { };
            for (int i = 0; i < addresses.Address.Length; i++)
            {
                Console.WriteLine(i + ". addres is: " + addresses.Address[i]);
                tree.AddLeaf(Encoding.ASCII.GetBytes(addresses.Address[i]), true);
                addressList.Add(addresses.Address[i]);
            }


            addressJson.saltAddress = addressList;
            var newJson = JsonConvert.SerializeObject(addressJson, Formatting.Indented, jsonSettings);
            System.IO.File.WriteAllText(addressPath, newJson);


            Console.WriteLine("root is: " + Encoding.UTF8.GetString(tree.MerkleRootHash));

            Root root = new Root();
            root.RootString = Encoding.UTF8.GetString(tree.MerkleRootHash);
            return root;
        }

        //POST api/MerkleTree/validate
        [HttpPost("validate")]
        public async Task<bool> ValidateSignature(MessageAndSignature mas)
        {

            var typedData = GetMailTypedDefinition();

            var addressRecovered = _signer.RecoverFromSignatureV4(mas.Message, typedData, mas.Signature);

            bool valid = addressRecovered == mas.Address;
            Console.WriteLine("answer is: " + valid);
            Console.WriteLine("recovered: " + addressRecovered + " | original: " + mas.Address);
            Console.WriteLine(mas.Message.MakeAsset.TokenId);

            return valid;
        }

    }
}
