using System;
using System.Collections.Generic;

namespace MerkleTreeWebAPI.Models
{
    public partial class Proof
    {
        public string ProofJson { get; set; }
        public string Leaf { get; set; }
    }
}
