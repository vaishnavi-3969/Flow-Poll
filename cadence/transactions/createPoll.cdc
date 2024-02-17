import Flowpoll from 0x05

transaction(title: String, options: [String], color: String, startedAt: UFix64, endedAt: UFix64, isRestricted: Bool) {
    prepare(signer: AuthAccount) {
        let creatorAddress = signer.address

        // Call the createPoll function in the Flowpoll contract
        let newPollId = Flowpoll.createPoll(
            createdBy: creatorAddress,
            title: title,
            options: options,
            color: color,
            startedAt: startedAt,
            endedAt: endedAt,
            isRestricted: isRestricted
        )

        // Log the new poll ID
        log(newPollId)
    }
}
