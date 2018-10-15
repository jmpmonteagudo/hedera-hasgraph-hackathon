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

    //mapping(uint => Art) owner;
    //mapping(uint => uint) public artsRate;
    Art[] arts;

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

    }

    function pieceSendOffer(uint ) public {

    }

    function pieceFillOffer(uint ) payable public {

    }


    // function remix() public {
    //     // WIP
    // }

}
