using System;
using System.Collections.Generic;

namespace MerkleTreeWebAPI.Models
{
    public partial class MessageAndSignature
    {
        public Order Message { get; set; }
        public string Signature { get; set; }
        public string Address { get; set; }
    }
}
