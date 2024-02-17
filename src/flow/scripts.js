import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

const GET_ALL_POLLS = `
import Flowpoll from 0xFlowpoll
pub fun main(): {UInt64: Flowpoll.Poll} {
  return Flowpoll.polls
}`;

export async function getAllPolls() {
  const response = await fcl.send([fcl.script(GET_ALL_POLLS)]);
  return await fcl.decode(response);
}

const GET_ACTIVE_POLLS = `
import Flowpoll from 0xFlowpoll
pub fun main(): {UInt64: Flowpoll.Poll} {
  return Flowpoll.getActivePolls()
}`;

export async function getActivePolls() {
  const response = await fcl.send([fcl.script(GET_ACTIVE_POLLS)]);
  return await fcl.decode(response);
}

const GET_DETAIL_POLL = `
import Flowpoll from 0xFlowpoll
pub fun main(pollId: UInt64): Flowpoll.Poll {
  let polls = Flowpoll.polls
  return polls[pollId] ?? panic("Poll not found")
}`;

export async function getDetailPoll(pollId) {
  const response = await fcl.send([
    fcl.script(GET_DETAIL_POLL),
    fcl.args([fcl.arg(pollId, t.UInt64)])
  ]);
  return await fcl.decode(response);
}

const GET_POLL_RESULT = `
import Flowpoll from 0xFlowpoll
pub fun main(pollId: UInt64): {String: UInt64} {
  return Flowpoll.getPollResult(pollId: pollId)
}`;

export async function getPollResult(pollId) {
  const response = await fcl.send([
    fcl.script(GET_POLL_RESULT),
    fcl.args([fcl.arg(pollId, t.UInt64)])
  ]);
  return await fcl.decode(response);
}
