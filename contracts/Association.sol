pragma solidity ^0.4.16;

import "./Owned.sol";
import "./Token.sol";
import "./TokenRecipient.sol";
import "./Structs.sol";

contract Association is Owned, TokenRecipient {
    //all member variables
    Token public sharesTokenAddress;
    uint public minimumQuorum;
    uint public debatingPeriodInMinutes;
    //////
    Structs.Proposal[] public proposals;
    uint public numProposals;

    //all modifiers
    // Modifier that allows only shareholders to vote and create new proposals
    modifier onlyShareholders {
        require(sharesTokenAddress.balanceOf(msg.sender) > 0);
        _;
    }

    //all events
    event ProposalAdded(uint proposalID, address recipient, uint amount, string description);
    event Voted(uint proposalID, bool position, address voter);
    event ProposalTallied(uint proposalID, uint result, uint quorum, bool active);
    event ChangeOfRules(uint newMinimumQuorum, uint newDebatingPeriodInMinutes, address newSharesTokenAddress);

    /**
     * Constructor function
     *
     * First time setup
     */
    constructor(Token sharesAddress, uint minimumSharesToPassAVote, uint minutesForDebate) payable public {
        changeVotingRules(sharesAddress, minimumSharesToPassAVote, minutesForDebate);
    }

    /**
     * Change voting rules
     *
     * Make so that proposals need to be discussed for at least `minutesForDebate/60` hours
     * and all voters combined must own more than `minimumSharesToPassAVote` shares of token `sharesAddress` to be executed
     *
     * @param sharesAddress token address
     * @param minimumSharesToPassAVote proposal can vote only if the sum of shares held by all voters exceed this number
     * @param minutesForDebate the minimum amount of delay between when a proposal is made and when it can be executed
     */
    function changeVotingRules(Token sharesAddress, uint minimumSharesToPassAVote, uint minutesForDebate) onlyOwner public {
        sharesTokenAddress = Token(sharesAddress);
        if (minimumSharesToPassAVote == 0) {
            minimumQuorum = 1;
        } else {
            minimumQuorum = minimumSharesToPassAVote;
        }
        debatingPeriodInMinutes = minutesForDebate;
        //emit an event
        emit ChangeOfRules(minimumQuorum, debatingPeriodInMinutes, sharesTokenAddress);
    }

    /**
     * Add Proposal
     *
     * Propose to send `weiAmount / 1e18` ether to `beneficiary` for `jobDescription`. `transactionBytecode ? Contains : Does not contain` code.
     *
     * @param beneficiary who to send the ether to
     * @param weiAmount amount of ether to send, in wei
     * @param jobDescription Description of job
     * @param transactionBytecode bytecode of transaction
     */
    function newProposal(address beneficiary, uint weiAmount, string jobDescription, bytes transactionBytecode) onlyShareholders public returns (uint proposalID){
        proposalID = proposals.length++;
        Structs.Proposal storage p = proposals[proposalID];
        p.recipient = beneficiary;
        p.amount = weiAmount;
        p.description = jobDescription;
        p.proposalHash = keccak256(abi.encodePacked(beneficiary, weiAmount, transactionBytecode));
        p.minExecutionDate = now + debatingPeriodInMinutes * 1 minutes;
        p.executed = false;
        p.proposalPassed = false;
        p.numberOfVotes = 0;
        numProposals = proposalID + 1;
        //emit an event
        emit ProposalAdded(proposalID, beneficiary, weiAmount, jobDescription);
        return proposalID;
    }

    /**
     * Add proposal in Ether
     *
     * Propose to send `etherAmount` ether to `beneficiary` for `jobDescription`. `transactionBytecode ? Contains : Does not contain` code.
     * This is a convenience function to use if the amount to be given is in round number of ether units.
     *
     * @param beneficiary who to send the ether to
     * @param etherAmount amount of ether to send
     * @param jobDescription Description of job
     * @param transactionBytecode bytecode of transaction
     */
    function newProposalInEther(address beneficiary, uint etherAmount, string jobDescription, bytes transactionBytecode) onlyShareholders public returns (uint proposalID){
        return newProposal(beneficiary, etherAmount * 1 ether, jobDescription, transactionBytecode);
    }

    /**
     * Check if a proposal code matches
     *
     * @param proposalNumber ID number of the proposal to query
     * @param beneficiary who to send the ether to
     * @param weiAmount amount of ether to send
     * @param transactionBytecode bytecode of transaction
     */
    function checkProposalCode(uint proposalNumber, address beneficiary, uint weiAmount, bytes transactionBytecode) view public returns (bool codeChecksOut){
        Structs.Proposal storage p = proposals[proposalNumber];
        return p.proposalHash == keccak256(abi.encodePacked(beneficiary, weiAmount, transactionBytecode));
    }

    /**
     * Log a vote for a proposal
     *
     * Vote `supportsProposal? in support of : against` proposal #`proposalNumber`
     *
     * @param proposalNumber number of proposal
     * @param supportsProposal either in favor or against it
     */
    function vote(uint proposalNumber, bool supportsProposal) onlyShareholders public returns (uint voteID){
        Structs.Proposal storage p = proposals[proposalNumber];
        require(p.voted[msg.sender] != true);
        voteID = p.votes.length++;
        p.votes[voteID] = Structs.Vote({inSupport : supportsProposal, voter : msg.sender, justification : ""});
        p.voted[msg.sender] = true;
        p.numberOfVotes = voteID + 1;
        //emit an event
        emit Voted(proposalNumber, supportsProposal, msg.sender);
        return voteID;
    }

    /**
     * Finish vote
     *
     * Count the votes proposal #`proposalNumber` and execute it if approved
     *
     * @param proposalNumber proposal number
     * @param transactionBytecode optional: if the transaction contained a bytecode, you need to send it
     */
    function executeProposal(uint proposalNumber, bytes transactionBytecode) public {
        Structs.Proposal storage p = proposals[proposalNumber];
        // If it is past the voting deadline // and it has not already been executed  // and the supplied code matches the proposal...
        require(now > p.minExecutionDate && !p.executed && p.proposalHash == keccak256(abi.encodePacked(p.recipient, p.amount, transactionBytecode)));
        // ...then tally the results
        uint quorum = 0;
        uint yea = 0;
        uint nay = 0;
        for (uint i = 0; i < p.votes.length; ++i) {
            Structs.Vote storage v = p.votes[i];
            uint voteWeight = sharesTokenAddress.balanceOf(v.voter);
            quorum += voteWeight;
            if (v.inSupport) {
                yea += voteWeight;
            } else {
                nay += voteWeight;
            }
        }
        // Check if a minimum quorum has been reached
        require(quorum >= minimumQuorum);
        if (yea > nay) {
            // Proposal passed; execute the transaction
            p.executed = true;
            require(p.recipient.call.value(p.amount)(transactionBytecode));
            p.proposalPassed = true;
        } else {
            // Proposal failed
            p.proposalPassed = false;
        }
        // Emit an event
        emit ProposalTallied(proposalNumber, yea - nay, quorum, p.proposalPassed);
    }
}