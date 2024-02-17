import Flowpoll from 0x05

pub fun main(): {UInt64: Flowpoll.Poll} {
    // Call the getAllPolls function in the Flowpoll contract
    return Flowpoll.getAllPolls()
}
