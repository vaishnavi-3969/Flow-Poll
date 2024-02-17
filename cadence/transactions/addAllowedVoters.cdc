import Flowpoll from 0x05

transaction(pollId: UInt64, voter: Address) {
    prepare(signer: AuthAccount) {
        // Call the addAllowedVoters function in the Flowpoll contract
        Flowpoll.addAllowedVoters(pollId: pollId, voter: voter)
    }
    execute{
        log("Voter added successfully to poll with ID:")
        log(pollId)
    }
}
