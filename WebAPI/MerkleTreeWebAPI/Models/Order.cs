namespace MerkleTreeWebAPI.Models;
using Nethereum.ABI.FunctionEncoding.Attributes;


[Struct("Order")]
public partial class Order
{
    [Parameter("address", "makerAddress", 1)]
    public string MakerAddress { get; set; }

    [Parameter("tuple", "makeAsset", 2, "Asset")]
    public Asset MakeAsset { get; set; }

    [Parameter("address", "takerAddress", 3)]
    public string TakerAddress { get; set; }

    [Parameter("tuple", "takeAsset", 4, "Asset")]
    public Asset TakeAsset { get; set; }

    [Parameter("uint256", "startTime", 5)]
    public int StartTime { get; set; }

    [Parameter("uint256", "endTime", 6)]
    public int EndTime { get; set; }

    /*[Parameter("bytes32", "salt", 7)]
    public Byte[] Salt { get; set; }*/
}

