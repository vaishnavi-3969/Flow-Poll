import Flowpoll from 0x05

transaction(pollId: UInt64, option: String) {
    prepare(signer: AuthAccount) {
        let voterAddress = signer.address

        // Call the vote function in the Flowpoll contract
        Flowpoll.vote(
            pollId: pollId,
            option: option,
            voter: voterAddress
        )
    }
    execute {
        log("Vote recorded successfully for poll ID: ")
        log(pollId)
    }
}
