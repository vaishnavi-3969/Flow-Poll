pub contract Flowpoll {

    // Struct to represent a poll
    pub struct Poll {
        pub var id: UInt64             // Poll ID
        pub var createdBy: Address     // Address of the poll creator
        pub var title: String          // Title of the poll
        pub var options: [String]      // List of poll options
        pub var color: String          // Color of the poll
        pub var startedAt: UFix64      // Timestamp when the poll starts
        pub var endedAt: UFix64        // Timestamp when the poll ends
        pub var isRestricted: Bool     // Flag to indicate if the poll is restricted
        pub var allowedVoters: {Address: Bool} // Dictionary of allowed voters
        pub var votes: {Address: String}        // Dictionary of votes (voter address => selected option)

        // Constructor to initialize the poll
        init(id: UInt64, createdBy: Address, title: String, options: [String], color: String, startedAt: UFix64, endedAt: UFix64, isRestricted: Bool) {
            self.id = id
            self.createdBy = createdBy
            self.title = title
            self.options = options
            self.color = color
            self.startedAt = startedAt
            self.endedAt = endedAt
            self.isRestricted = isRestricted
            self.allowedVoters = {}
            self.votes = {}
        }

        // Function to record a vote
        pub fun setVote(option: String, voter: Address)  {
            self.votes[voter] = option
        }

        // Function to add an allowed voter
        pub fun setAllowedVoters(voter: Address)  {
            self.allowedVoters[voter] = true
        }

        // Function to remove an allowed voter
        pub fun removeAllowedVoters(voter: Address)  {
            self.allowedVoters.remove(key: voter)
        }
    }

    // Dictionary to store polls by poll ID
    pub var polls: {UInt64: Poll}

    // Counter to track the number of polls
    pub var pollCounter: UInt64

    // Function to add an allowed voter to a restricted poll
    pub fun addAllowedVoters(pollId: UInt64, voter: Address)  {
        let poll = self.polls[pollId] ?? panic("Poll not found")

        // Check if the poll is restricted
        if !poll.isRestricted {
            panic("This vote is not restricted")
        }

        // Add the voter to the allowed voters list
        poll.setAllowedVoters(voter: voter)
        self.polls[poll.id] = poll
    }

    // Function to remove an allowed voter from a restricted poll
    pub fun removeAllowedVoters(pollId: UInt64, voter: Address)  {
        let poll = self.polls[pollId] ?? panic("Poll not found")

        // Check if the poll is restricted
        if !poll.isRestricted {
            panic("This vote is not restricted")
        }

        // Remove the voter from the allowed voters list
        poll.removeAllowedVoters(voter: voter)
        self.polls[poll.id] = poll
    }

    // Function to get the list of allowed voters for a poll
    pub fun getAllowedVoters(pollId: UInt64): {Address: Bool} {
        let poll = self.polls[pollId] ?? panic("Poll not found")
        return poll.allowedVoters
    }

    // Function to record a vote in a poll
    pub fun vote(pollId: UInt64, option: String, voter: Address)  {
        let poll = self.polls[pollId] ?? panic("Poll not found")

        // Check if the poll is active
        if !self.isPollActive(pollId: pollId) {
            panic("Voting is not currently allowed for this poll")
        }

        // Check if the voter has already voted
        if poll.votes.containsKey(voter) {
            panic("You have already voted in this poll")
        }

        // Check if the voter is allowed to vote in a restricted poll
        if poll.isRestricted && poll.allowedVoters[voter] == nil {
            panic("You're not allowed to vote")
        } else {
            poll.setVote(option: option, voter: voter)
            self.polls[poll.id] = poll
        }
    }

    // Function to create a new poll
    pub fun createPoll(createdBy: Address, title: String, options: [String], color: String, startedAt: UFix64, endedAt: UFix64, isRestricted: Bool) {
        let newId = self.pollCounter + 1

        // Create a new poll instance
        let poll = Poll(
            id: newId,
            createdBy: createdBy,
            title: title,
            options: options,
            color: color,
            startedAt: startedAt,
            endedAt: endedAt,
            isRestricted: isRestricted,
        )

        // Add the poll to the polls dictionary
        self.polls[newId] = poll
        self.pollCounter = newId
    }

    // Function to check if a poll is active
    pub fun isPollActive(pollId: UInt64): Bool {
        let poll = self.polls[pollId] ?? panic("Poll not found")
        let currentTime = getCurrentBlock().timestamp
        return poll.startedAt <= getCurrentBlock().timestamp && poll.endedAt >= getCurrentBlock().timestamp
    }

    // Function to get all polls
    pub fun getAllPolls(): {UInt64: Poll} {
        return self.polls
    }

    // Function to get active polls
    pub fun getActivePolls(): {UInt64: Poll} {
        let activePolls: {UInt64: Poll} = {}

        // Iterate through all polls and filter out the active ones
        for poll in self.polls.values {
            if self.isPollActive(pollId: poll.id) {
                activePolls[poll.id] = poll
            }
        }

        return activePolls
    }

    // Function to get poll results
    pub fun getPollResult(pollId: UInt64): {String: UInt64} {
        let poll = self.polls[pollId] ?? panic("Poll not found")
        var resultVote: {String: UInt64} = {}

        // Count results
        for vote in poll.votes.values {
            if resultVote[vote] == nil {
                resultVote[vote] = 1
            } else {
                resultVote[vote] = resultVote[vote]! + 1
            }
        }

        return resultVote
    }

    // Initialize polls dictionary and poll counter
    init() {
        self.polls = {}
        self.pollCounter = 0
    }
}
