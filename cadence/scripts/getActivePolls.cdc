import Flowpoll from 0x05

pub fun main(): {UInt64: Flowpoll.Poll} {
    // Retrieve the active polls from the Flowpoll contract
    let activePolls = Flowpoll.getActivePolls()

    return activePolls
}
