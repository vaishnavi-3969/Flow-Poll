import Flowpoll from 0x05

pub fun main(pollId: UInt64): {String: UInt64} {
    let pollResult = Flowpoll.getPollResult(pollId: pollId)
    return pollResult
}
