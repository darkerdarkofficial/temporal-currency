
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ProofOfIntent {
    address public immutable creator;
    uint256 public immutable genesisTimestamp;
    uint256 public constant TOTAL_MONTHS = 30;
    uint256 public constant CHECKPOINT_INTERVAL = 30 days;

    string public ipfsCiphertext;           // OpenFHE CKKS ciphertext
    uint256 public bondedETH;
    mapping(address => uint256) public stakes;

    enum CheckpointState { Pending, Passed, Adjusted, Slashed }
    mapping(uint256 => CheckpointState) public checkpoints; // 1..30

    event Checkpoint(uint256 indexed id, CheckpointState state);
    event BondUpdated(address indexed stakeholder, uint256 amount);
    event TimeAdjusted(string newIpfsCiphertext);

    constructor(string memory _initialCiphertextIpfs) payable {
        creator = msg.sender;
        genesisTimestamp = block.timestamp;
        ipfsCiphertext = _initialCiphertextIpfs;
        bondedETH = msg.value;
        emit Checkpoint(0, CheckpointState.Passed); // genesis
    }

    modifier onlyCreator() { require(msg.sender == creator, "Not creator"); _; }
    modifier atCheckpoint(uint256 id) {
        require(block.timestamp >= genesisTimestamp + (id * CHECKPOINT_INTERVAL), "Too early");
        require(checkpoints[id] == CheckpointState.Pending, "Already processed");
        _;
    }

    function stake() external payable {
        stakes[msg.sender] += msg.value;
        bondedETH += msg.value;
        emit BondUpdated(msg.sender, stakes[msg.sender]);
    }

    function adjustTime(string memory newCiphertextIpfs) external onlyCreator {
        uint256 currentId = (block.timestamp - genesisTimestamp) / CHECKPOINT_INTERVAL;
        require(currentId > 0 && currentId <= TOTAL_MONTHS, "Invalid timing");
        checkpoints[currentId] = CheckpointState.Adjusted;
        ipfsCiphertext = newCiphertextIpfs;
        emit TimeAdjusted(newCiphertextIpfs);
        emit Checkpoint(currentId, CheckpointState.Adjusted);
    }

    // Final settlement (anyone can trigger after month 30)
    function settle() external {
        require(block.timestamp >= genesisTimestamp + (TOTAL_MONTHS * CHECKPOINT_INTERVAL), "Not finished");
        // In production: threshold decryption oracle verifies delivery
        // For now: creator claims everything
        payable(creator).transfer(address(this).balance);
    }
}