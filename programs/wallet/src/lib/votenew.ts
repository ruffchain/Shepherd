import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkFee } from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'

const FUNC_NAME = 'vote';

export async function voteNew(ctx: IfContext, args: string[]): Promise<IfResult> {
  return new Promise<IfResult>(async (resolve) => {

  });
}


export function prnVoteNew(ctx: IfContext, obj: IfResult) {
  console.log(obj.resp);
}
