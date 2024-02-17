import Flowpoll from 0x05

transaction(pollId: UInt64, voter: Address) {
    prepare(signer: AuthAccount) {
        // Call the removeAllowedVoters function in the Flowpoll contract
        Flowpoll.removeAllowedVoters(pollId: pollId, voter: voter)
    }
    execute{
        log("Voter removed successfully from poll with ID:")
        log(pollId)
    }
}
