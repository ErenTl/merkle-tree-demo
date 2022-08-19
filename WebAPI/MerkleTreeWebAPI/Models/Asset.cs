namespace MerkleTreeWebAPI.Models;
using Nethereum.ABI.FunctionEncoding.Attributes;


    [Struct("Asset")]
    public partial class Asset
    {
        [Parameter("address", "token", 1)]
        public string Token { get; set; }

        [Parameter("uint256", "tokenId", 2)]
        public int TokenId { get; set; }

        [Parameter("uint8", "assetType", 3)]
        public int AssetType { get; set; }

        [Parameter("uint256", "value", 4)]
        public int Value { get; set; }
    }

