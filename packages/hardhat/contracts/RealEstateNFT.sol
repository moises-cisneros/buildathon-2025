//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateNFT is ERC721, ERC721URIStorage, Ownable {
    enum PropertyStatus {
        Disponible,
        Colateralizada,
        EnSubasta
    }

    uint256 private _tokenIdCounter = 1;
    address public loanManagerContract;
    address public auctionContract;

    mapping(uint256 => PropertyStatus) public propertyStatus;
    mapping(uint256 => uint256) public propertyValuation;

    event PropertyMinted(uint256 indexed tokenId, address indexed owner, string propertyURI, uint256 valuation);
    event PropertyStatusChanged(uint256 indexed tokenId, PropertyStatus oldStatus, PropertyStatus newStatus);
    event LoanManagerSet(address indexed newLoanManager);
    event AuctionContractSet(address indexed newAuctionContract);

    constructor(address initialOwner) ERC721("Real Estate NFT", "RENFT") Ownable(initialOwner) {}

    function setLoanManagerContract(address _loanManagerContract) public onlyOwner {
        require(_loanManagerContract != address(0), "Direccion invalida");
        loanManagerContract = _loanManagerContract;
        emit LoanManagerSet(_loanManagerContract);
    }

    function setAuctionContract(address _auctionContract) public onlyOwner {
        require(_auctionContract != address(0), "Direccion invalida");
        auctionContract = _auctionContract;
        emit AuctionContractSet(_auctionContract);
    }

    function mintProperty(address to, string memory propertyURI, uint256 valuation) public onlyOwner returns (uint256) {
        require(to != address(0), "No se puede acunar a direccion cero");
        require(bytes(propertyURI).length > 0, "URI no puede estar vacio");
        require(valuation > 0, "Valuacion debe ser mayor a cero");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, propertyURI);

        propertyStatus[tokenId] = PropertyStatus.Disponible;
        propertyValuation[tokenId] = valuation;

        emit PropertyMinted(tokenId, to, propertyURI, valuation);
        return tokenId;
    }

    function updatePropertyStatus(uint256 tokenId, PropertyStatus newStatus) public {
        require(_ownerOf(tokenId) != address(0), "Token no existe");
        require(
            msg.sender == loanManagerContract || msg.sender == auctionContract || msg.sender == owner(),
            "No autorizado para cambiar estado"
        );

        PropertyStatus oldStatus = propertyStatus[tokenId];
        propertyStatus[tokenId] = newStatus;

        emit PropertyStatusChanged(tokenId, oldStatus, newStatus);
    }

    function updatePropertyValuation(uint256 tokenId, uint256 newValuation) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token no existe");
        require(newValuation > 0, "Valuacion debe ser mayor a cero");
        propertyValuation[tokenId] = newValuation;
    }

    function getPropertyInfo(
        uint256 tokenId
    ) public view returns (address ownerAddr, PropertyStatus status, uint256 valuation, string memory uri) {
        require(_ownerOf(tokenId) != address(0), "Token no existe");
        return (ownerOf(tokenId), propertyStatus[tokenId], propertyValuation[tokenId], tokenURI(tokenId));
    }

    function isPropertyAvailable(uint256 tokenId) public view returns (bool) {
        require(_ownerOf(tokenId) != address(0), "Token no existe");
        return propertyStatus[tokenId] == PropertyStatus.Disponible;
    }

    function getTotalProperties() public view returns (uint256) {
        return _tokenIdCounter - 1;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
