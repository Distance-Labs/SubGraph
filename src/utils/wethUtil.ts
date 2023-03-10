import { Address } from "@graphprotocol/graph-ts";
import { Transfer } from "../../generated/WETH/ERC20Abi";

import { wethTransaction } from "../../generated/schema";

export function handleTransfer(event: Transfer): void {
  // let wethTest = wethTransaction.load(event.transaction.hash.toHexString());
  // if (!wethTest) {
  //   let wethEntity = new wethTransaction(event.transaction.hash.toHexString());
  //   wethEntity.save();
  // }
}
