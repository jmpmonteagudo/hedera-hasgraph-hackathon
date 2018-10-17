pragma solidity 0.4.24;

import "../../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract ArtGraph {

    using SafeMath for uint256;

    struct Art {
        address artist;
        address owner;
        string title;
        string description;
        string category;
        string url;
        uint min_price_view;
        uint remix_price_view;
        uint tips;
    }

    struct Offer {
        uint artId;
        address originalOwner;
        uint amount;
        bool executed;
        uint fundsReceived;
    }

    event PieceCreate(uint indexed artId);
    event PieceSendOffer(uint indexed offerId);

    Art[] arts;
    Offer[] offers;

    // @dev user sends micropayments to view the art piece through this method
    function pieceView(uint _artId) payable public returns (bool) {
        require(msg.value >= arts[_artId].min_price_view, "view price is higher than the attempted paid price");
        arts[_artId].tips.add(msg.value);
        return true;
    }

    function pieceCreate(string _title, string _description, string _category, string _url,
        uint _min_price_view, uint _remix_price_view) public {

        Art memory art;
        art.artist = msg.sender;
        art.owner = art.artist;
        art.title = _title;
        art.description = _description;
        art.category = _category;
        art.url = _url;
        art.min_price_view = _min_price_view;
        art.remix_price_view = _remix_price_view;

        emit PieceCreate(arts.length);
        arts.push(art);  
    }

    // function rate(uint _userId, uint _artId, uint _pay_amount, uint _rating) {
    //     // WIP
    // }

    function pieceSendOffer(uint _artId, uint _amount) public {
        Art art = arts[_artId];
        require(msg.sender == art.artist, "offerer must be the art piece owner");

        Offer memory offer;
        offer.artId = _artId;
        offer.originalOwner = art.owner;
        offer.amount = _amount;
        offer.executed = false;
        emit PieceSendOffer(offers.length);
        offers.push(offer);
    }


    function pieceFillOffer(uint _offerId) payable public {
        Offer offer = offers[_offerId];
        require(msg.value >= offer.amount, "offer price is higher than the bid amount");

        offer.fundsReceived.add(msg.value);

        Art art = arts[offer.artId];
        art.owner = msg.sender;
    }

    function withdrawOfferfunds(uint _offerId) public {
        Offer offer = offers[_offerId];
        require(msg.sender == offer.originalOwner, "only art original owner can withdraw the offer funds");
        require(offer.executed == false, "order funds were already withdrawn");

        offer.executed = true;
        msg.sender.transfer(offer.fundsReceived);
    }


    // function remix() public {
    //     // WIP
    // }

}
