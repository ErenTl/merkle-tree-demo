using Microsoft.AspNetCore.Mvc;
using MerkleTreeWebAPI.Models;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Dynamic;
using Newtonsoft.Json.Linq;
using System.Linq;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MerkleTreeWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MerkleTreeController : ControllerBase
    {
        private string root;
        static MerkleTools.MerkleTree tree;

        public MerkleTreeController()
        {
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
            for (int i = 0; i < addresses.Address.Length; i++)
            {
                Console.WriteLine(i + ". addres is: " + addresses.Address[i]);
                tree.AddLeaf(Encoding.ASCII.GetBytes(addresses.Address[i]), true);
            }

            Console.WriteLine("root is: " + Encoding.UTF8.GetString(tree.MerkleRootHash));

            Root root = new Root();
            root.RootString = Encoding.UTF8.GetString(tree.MerkleRootHash);
            return root;
        }

    }
}
