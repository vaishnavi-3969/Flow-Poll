import Flowpoll from 0x05

pub fun main(pollId: UInt64): Bool {
    // Call the isPollActive function in the Flowpoll contract
    return Flowpoll.isPollActive(pollId: pollId)
}
