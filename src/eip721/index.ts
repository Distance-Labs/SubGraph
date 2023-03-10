import {
  account,
  transfer,
  transaction,
  accountCollection,
  SaleInfo,
  ApprovedForAll,
} from "../../generated/schema";

import {
  ApprovalForAll as ApprovalForAllEvent,
  Transfer as TransferEvent,
  Approval as ApprovalEvent,
} from "../../generated/IERC721/IERC721";

import { fetchAccount, fetchRegistry, fetchToken } from "../utils/erc721";

import { constants, events, transactions } from "../graphprotcol-utls";

import { store, BigInt } from "@graphprotocol/graph-ts";

export function handleTransfer(event: TransferEvent): void {
  let collection = fetchRegistry(event.address);
  if (collection != null) {
    let timestampBigInt = BigInt.fromI32(event.block.timestamp.toI32());
    let token = fetchToken(collection, event.params.tokenId, timestampBigInt);

    let senderAddress = account.load(event.params.from.toHexString());
    if (!senderAddress) {
      senderAddress = fetchAccount(event.params.from);
    }

    let receiverAddress = account.load(event.params.to.toHexString());
    if (!receiverAddress) {
      receiverAddress = fetchAccount(event.params.to);
    }

    let senderAccountCollection = accountCollection.load(
      senderAddress.id + "-" + collection.id
    );
    if (
      senderAccountCollection &&
      senderAddress.id != "0x0000000000000000000000000000000000000000"
    ) {
      let senderTokenCountNew = senderAccountCollection.tokenCount - 1;

      senderAccountCollection.tokenCount = senderTokenCountNew;
      senderAccountCollection.save();

      if (senderAccountCollection.tokenCount == 0) {
        store.remove(
          "accountCollection",
          senderAddress.id + "-" + collection.id
        );
      }
    }

    let receiverAccountCollection = accountCollection.load(
      receiverAddress.id + "-" + collection.id
    );
    if (
      receiverAccountCollection &&
      receiverAddress.id != "0x0000000000000000000000000000000000000000"
    ) {
      let receiverTokenCountNew = receiverAccountCollection.tokenCount + 1;

      receiverAccountCollection.tokenCount = receiverTokenCountNew;
      receiverAccountCollection.save();
    }
    if (
      !receiverAccountCollection &&
      receiverAddress.id != "0x0000000000000000000000000000000000000000"
    ) {
      receiverAccountCollection = new accountCollection(
        receiverAddress.id + "-" + collection.id
      );
      receiverAccountCollection.account = receiverAddress.id;
      receiverAccountCollection.collection = collection.id;
      receiverAccountCollection.tokenCount = 1;

      receiverAccountCollection.save();
    }
    if (receiverAddress.id == constants.Auction) {
      token.owner = senderAddress.id;
    } else {
      token.owner = receiverAddress.id;
    }

    collection.save();
    token.save();
    senderAddress.save();
    receiverAddress.save();

    let transferEntity = new transfer(events.id(event));
    transferEntity.transaction = transactions.log(event).id;
    transferEntity.token = token.id;
    transferEntity.collection = collection.id;
    transferEntity.senderAddress = senderAddress.id;
    transferEntity.receiverAddress = receiverAddress.id;
    transferEntity.blockNumber = event.block.number.toI32();
    transferEntity.timestamp = event.block.timestamp.toI32();
    transferEntity.amount = constants.BIGDECIMAL_ZERO;
    transferEntity.save();

    let tx = transaction.load(event.transaction.hash.toHexString());
    if (tx != null) {
      let transferArray = tx.transfers;
      transferArray.push(transferEntity.id);

      let newTransferCount = tx.unmatchedTransferCount + 1;
      tx.unmatchedTransferCount = newTransferCount;
      tx.transfers = transferArray;
      tx.save();
    }
  }
}

export function handleApproval(event: ApprovalEvent): void {
  let collectionAddress = event.address.toHexString();
  let tokenId = event.params.tokenId.toString();
  let tokenID = "kcc/"
    .concat(collectionAddress)
    .concat("/")
    .concat(tokenId);
  let saleInfoEntity = SaleInfo.load("saleinfo/".concat(tokenID));
  if (saleInfoEntity != null) {
    let approvedAddress = event.params.approved.toHexString();
    if (approvedAddress == constants.Marketplace) {
      saleInfoEntity.approved = true;
    } else {
      saleInfoEntity.approved = false;
    }
    saleInfoEntity.save();
  }
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  if (
    event.address.toHexString() &&
    event.params.owner.toHexString() &&
    event.params.operator.toHexString()
  ) {
    let collectionAddress = event.address.toHexString();
    let owner = event.params.owner.toHexString();
    let operator = event.params.operator.toHexString();
    let approvedID = "approvedforall/".concat(collectionAddress).concat(owner);
    let approvedForAllEntity = ApprovedForAll.load(approvedID);
    if (approvedForAllEntity == null) {
      approvedForAllEntity = new ApprovedForAll(approvedID);
      approvedForAllEntity.id = approvedID;
      approvedForAllEntity.collection = collectionAddress;
      approvedForAllEntity.account = owner;
      approvedForAllEntity.save();
    }
    if (operator == constants.Marketplace && event.params.approved == true) {
      approvedForAllEntity.approved = true;
    } else {
      approvedForAllEntity.approved = false;
    }
    approvedForAllEntity.save();
  }
}
