pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaign;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaign.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]){
        return deployedCampaign;
    }
}
contract Campaign{

    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    uint public approversCount;
    mapping(address => bool) public approvers;

    function Campaign(uint minimum, address sender) public{
        manager = sender;
        minimumContribution = minimum;
    }

    modifier amountRestriction{
        require(msg.value >= minimumContribution);
        _;
    }

    modifier restricted{
        require(msg.sender == manager);
        _;
    }

    function contribute() public amountRestriction payable{
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string description, address recipient, uint value ) public restricted {
        Request memory newRequest = Request({
            description : description,
            recipient: recipient,
            value: value,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage requestAtIndex = requests[index];
        require(approvers[msg.sender]);
        require(!requestAtIndex.approvals[msg.sender]);
        requestAtIndex.approvalCount++;
        requestAtIndex.approvals[msg.sender] = true;
    }

    function finalizeRequest(uint index) public restricted payable{
        Request storage requestAtIndex = requests[index];
        require(!requestAtIndex.complete);
        require(requestAtIndex.approvalCount >= (approversCount / 2));

        requestAtIndex.complete = true;
        requestAtIndex.recipient.transfer(requestAtIndex.value);

    }
    
    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint){
        return requests.length;
    } 
}
