// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract atoken is ERC1155,  Pausable, ERC1155Burnable, Initializable {
    using Strings for uint;

    address public owner;
    string public name;
    string public symbol;
    string private tokenUriPrefix;
    uint256 public maximumRoyaltyRate;
    uint256 public test;

    modifier onlyOwner() {
        require(owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function _transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    constructor() ERC1155("") {
        owner = msg.sender;
    }

   /*constructor(string memory _tokenUriPrefix, string memory _name, string memory _symbol, uint256 _maximumRoyaltyRate) ERC1155(_tokenUriPrefix) {
        name = _name;
        symbol =_symbol;
        tokenUriPrefix =_tokenUriPrefix;
        maximumRoyaltyRate = _maximumRoyaltyRate;
    }*/

    function initialize(string memory _tokenUriPrefix, string memory _name, string memory _symbol, uint256 _maximumRoyaltyRate, uint256 a, uint256 b, uint256 c, uint256 d, uint256 e, uint256 f, uint256 g) external initializer {
        name = _name;
        symbol =_symbol;
        tokenUriPrefix =_tokenUriPrefix;
        maximumRoyaltyRate = _maximumRoyaltyRate;   
        if(owner==address(0)) owner = msg.sender;
        setURI(_tokenUriPrefix);
        test = a+b+c+d;
    }
    
    function setURI(string memory newTokenUriPrefix) public onlyOwner {
        _setURI(newTokenUriPrefix);
        tokenUriPrefix = newTokenUriPrefix;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 id, uint256 amount, uint256 royaltyRate, string memory tokenFullUri,  bytes memory data)
        public
    {
        _mint(to, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts,  uint256[] memory royaltyRates, string[] memory tokenFullUris, bytes memory data)
        public
    {
        _mintBatch(to, ids, amounts, data);
    }
    
    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function setMaximumRoyaltyRate(uint256 royaltyRate) public virtual onlyOwner{
        maximumRoyaltyRate = royaltyRate;
    }

    function getTest() public view returns(uint256) {
        return test;
    }

    
        
}