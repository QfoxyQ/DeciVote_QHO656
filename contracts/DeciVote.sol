// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DeciVote {
    address public admin;
    uint256 public electionCount;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    struct Election {
        uint256 id;
        string name;
        uint256 startTime;
        uint256 endTime;
        bool exists;
        bool active;
    }

    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 voteCount;
    }

    mapping(uint256 => Election) public elections;
    mapping(uint256 => Candidate[]) private electionCandidates;
    mapping(uint256 => mapping(address => bool)) public authorizedVoters;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ElectionCreated(
        uint256 indexed electionId,
        string name,
        uint256 startTime,
        uint256 endTime
    );

    event CandidateAdded(
        uint256 indexed electionId,
        uint256 indexed candidateId,
        string name,
        string party
    );

    event VoterAuthorized(
        uint256 indexed electionId,
        address indexed voter
    );

    event VoteCast(
        uint256 indexed electionId,
        uint256 indexed candidateId,
        address indexed voter
    );

    event CandidateDeleted(
        uint256 indexed electionId,
        uint256 indexed candidateId
    );

    event CandidateUpdated(
        uint256 indexed electionId,
        uint256 indexed candidateId,
        string name,
        string party
    );

    event ElectionEnded(
        uint256 indexed electionId
    );

    function createElection(
        string memory _name,
        uint256 _startTime,
        uint256 _endTime
    ) public onlyAdmin {
        require(bytes(_name).length > 0, "Election name is required");
        require(_endTime > _startTime, "End time must be after start time");

        electionCount++;

        elections[electionCount] = Election({
            id: electionCount,
            name: _name,
            startTime: _startTime,
            endTime: _endTime,
            exists: true,
            active: true
        });

        emit ElectionCreated(electionCount, _name, _startTime, _endTime);
    }

    function addCandidate(
        uint256 _electionId,
        string memory _name,
        string memory _party
    ) public onlyAdmin {
        require(elections[_electionId].exists, "Election does not exist");
        require(bytes(_name).length > 0, "Candidate name is required");

        uint256 candidateId = electionCandidates[_electionId].length + 1;

        electionCandidates[_electionId].push(
            Candidate({
                id: candidateId,
                name: _name,
                party: _party,
                voteCount: 0
            })
        );

        emit CandidateAdded(_electionId, candidateId, _name, _party);
    }

    function authorizeVoter(
        uint256 _electionId,
        address _voter
    ) public onlyAdmin {
        require(elections[_electionId].exists, "Election does not exist");
        require(_voter != address(0), "Invalid voter address");

        authorizedVoters[_electionId][_voter] = true;

        emit VoterAuthorized(_electionId, _voter);
    }

    function vote(uint256 _electionId, uint256 _candidateId) public {
        require(elections[_electionId].exists, "Election does not exist");
        require(elections[_electionId].active, "Election is not active");
        require(
            block.timestamp >= elections[_electionId].startTime,
            "Election has not started yet"
        );
        require(
            block.timestamp <= elections[_electionId].endTime,
            "Election has ended"
        );
        require(
            authorizedVoters[_electionId][msg.sender],
            "Voter is not authorized"
        );
        require(
            !hasVoted[_electionId][msg.sender],
            "Voter has already voted"
        );
        require(
            _candidateId > 0 &&
                _candidateId <= electionCandidates[_electionId].length,
            "Invalid candidate"
        );

        hasVoted[_electionId][msg.sender] = true;
        electionCandidates[_electionId][_candidateId - 1].voteCount++;

        emit VoteCast(_electionId, _candidateId, msg.sender);
    }

    function getElection(
        uint256 _electionId
    )
        public
        view
        returns (
            uint256 id,
            string memory name,
            uint256 startTime,
            uint256 endTime,
            bool active
        )
    {
        require(elections[_electionId].exists, "Election does not exist");
        Election memory e = elections[_electionId];
        return (e.id, e.name, e.startTime, e.endTime, e.active);
    }

    function getCandidates(
        uint256 _electionId
    ) public view returns (Candidate[] memory) {
        require(elections[_electionId].exists, "Election does not exist");
        return electionCandidates[_electionId];
    }

    function getCandidateCount(
        uint256 _electionId
    ) public view returns (uint256) {
        require(elections[_electionId].exists, "Election does not exist");
        return electionCandidates[_electionId].length;
    }

    function getResults(
        uint256 _electionId
    ) public view returns (Candidate[] memory) {
        require(elections[_electionId].exists, "Election does not exist");
        return electionCandidates[_electionId];
    }

    function endElection(uint256 _electionId) public onlyAdmin {
        require(elections[_electionId].exists, "Election does not exist");
        elections[_electionId].active = false;
        emit ElectionEnded(_electionId);
    }

    function deleteCandidate(
        uint256 _electionId,
        uint256 _candidateId
    ) public onlyAdmin {
        require(elections[_electionId].exists, "Election does not exist");
        require(
            _candidateId > 0 &&
                _candidateId <= electionCandidates[_electionId].length,
            "Invalid candidate"
        );

        Candidate[] storage candidates = electionCandidates[_electionId];
        
        // Move last candidate to the position being deleted
        if (_candidateId - 1 != candidates.length - 1) {
            candidates[_candidateId - 1] = candidates[candidates.length - 1];
            candidates[_candidateId - 1].id = _candidateId;
        }
        
        candidates.pop();
        emit CandidateDeleted(_electionId, _candidateId);
    }

    function updateCandidate(
        uint256 _electionId,
        uint256 _candidateId,
        string memory _name,
        string memory _party
    ) public onlyAdmin {
        require(elections[_electionId].exists, "Election does not exist");
        require(
            _candidateId > 0 &&
                _candidateId <= electionCandidates[_electionId].length,
            "Invalid candidate"
        );
        require(bytes(_name).length > 0, "Candidate name is required");

        Candidate storage candidate = electionCandidates[_electionId][
            _candidateId - 1
        ];
        candidate.name = _name;
        candidate.party = _party;

        emit CandidateUpdated(_electionId, _candidateId, _name, _party);
    }

    function isAuthorizedVoter(
        uint256 _electionId,
        address _voter
    ) public view returns (bool) {
        return authorizedVoters[_electionId][_voter];
    }

    function hasAddressVoted(
        uint256 _electionId,
        address _voter
    ) public view returns (bool) {
        return hasVoted[_electionId][_voter];
    }
}
