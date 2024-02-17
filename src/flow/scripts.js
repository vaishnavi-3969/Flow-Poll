import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

const GET_ALL_POLLS = `
import FlowPoll from 0xFlowPoll
pub fun main(): {UInt64: FlowPoll.Poll} {
  return FlowPoll.polls
}`;

export async function getAllPolls() {
  const response = await fcl.send([fcl.script(GET_ALL_POLLS)]);
  return await fcl.decode(response);
}

const GET_ACTIVE_POLLS = `
import FlowPoll from 0xFlowPoll
pub fun main(): {UInt64: FlowPoll.Poll} {
  return FlowPoll.getActivePolls()
}`;

export async function getActivePolls() {
  const response = await fcl.send([fcl.script(GET_ACTIVE_POLLS)]);
  return await fcl.decode(response);
}

const GET_DETAIL_POLL = `
import FlowPoll from 0xFlowPoll
pub fun main(pollId: UInt64): FlowPoll.Poll {
  let polls = FlowPoll.polls
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
import FlowPoll from 0xFlowPoll
pub fun main(pollId: UInt64): {String: UInt64} {
  return FlowPoll.getPollResult(pollId: pollId)
}`;

export async function getPollResult(pollId) {
  const response = await fcl.send([
    fcl.script(GET_POLL_RESULT),
    fcl.args([fcl.arg(pollId, t.UInt64)])
  ]);
  return await fcl.decode(response);
}
