pragma solidity 0.4.24;

contract ArtGraph {

    struct Art {
        uint ownerId;
        string title;
        string description;
        string category;
        string url;
        uint min_price_view;
        uint remix_price_view;
    }

    struct Offer {
        uint artId;
        uint amount;
        bool executed;
    }

    //mapping(uint => Art) owner;
    //mapping(uint => uint) public artsRate;
    Art[] arts;
    Offer[] offers;

    function pieceView(uint _userId, uint _artId) payable public returns (bool) {
        // user sends micropayment to view the art piece
        //require(msg.value > arts[_artId].min_price_view, 'asd');
        require(msg.value > arts[_artId].min_price_view, "price is too low");

        // WIP: send min_price_view to arts[_artId].ownerId

        return true; // allow viewing the art piece
    }

    function pieceCreate(uint _ownerId, string _title, string _description, string _category, string _url,
        uint _min_price_view, uint _remix_price_view) public {

        Art memory art;

        art.ownerId = _ownerId;
        art.title = _title;
        art.description = _description;
        art.category = _category;
        art.url = _url;
        art.min_price_view = _min_price_view;
        art.remix_price_view = _remix_price_view;

        arts.push(art);  
    }


    function rate(uint _userId, uint _artId, uint _pay_amount, uint _rating) {
        // WIP
    }

    function pieceSendOffer(uint _artId, uint _ownerId, uint _amount) public {
        Art art = arts[_artId];
        require(_ownerId == art.ownerId, "sender must be the art owner");

        Offer memory offer;
        offer.artId = _artId;
        offer.amount = _amount;
        offer.executed = false;

        offers.push(offer);
    }


    function pieceFillOffer(uint _offerId, uint _userId, uint _amount) payable public {
        Offer offer = offers[_offerId];
        require(_amount >= offer.amount);

        // WIP: send amount to owner
        Art art = arts[offer.artId];
        art.ownerId = _userId;
    }


    // function remix() public {
    //     // WIP
    // }

}
