import { store } from "@graphprotocol/graph-ts";
import {
  AuctionCancelled as AuctionCancelledEvent,
  AuctionStarted as AuctionStartedEvent,
  BidAccepted as BidAcceptedEvent,
  BidCreated as BidCreatedEvent,
} from "../../generated/Auction/Auction";
import { SaleInfo } from "../../generated/schema";
import { fetchAccount } from "../utils/erc721";
import { updateAuction } from "./auctionUtils";

export function handleAuctionCancelled(event: AuctionCancelledEvent): void {
  let collectionAddress = event.params.collection.toHex();
  let tokenId = event.params.tokenId.toString();
  let tokenEntityId = "kcc/"
    .concat(collectionAddress)
    .concat("/")
    .concat(tokenId);
  let id = "saleinfo/".concat(tokenEntityId);
  let entity = SaleInfo.load(id);
  if (entity != null) {
    store.remove("SaleInfo", entity.id);
  }
}

export function handleAuctionStarted(event: AuctionStartedEvent): void {
  let collectionAddress = event.params.collection.toHex();
  let tokenId = event.params.tokenId.toString();
  let tokenEntityId = "kcc/"
    .concat(collectionAddress)
    .concat("/")
    .concat(tokenId);
  let id = "saleinfo/".concat(tokenEntityId);
  let entity = new SaleInfo(id);
  entity.seller = event.params.creator.toHex();
  entity.collection = collectionAddress;
  entity.tokenId = tokenEntityId;
  entity.state = "auctionSale";
  entity.startingBid = event.params.startingBid;
  entity.validity = event.params.endAuctionTime;

  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleBidAccepted(event: BidAcceptedEvent): void {
  let collectionAddress = event.params.collection.toHex();
  let tokenId = event.params.tokenId.toString();
  let tokenEntityId = "kcc/"
    .concat(collectionAddress)
    .concat("/")
    .concat(tokenId);
  let id = "saleinfo/".concat(tokenEntityId);
  updateAuction(event);
  let sellerEntity = fetchAccount(event.params.owner);
  sellerEntity.points = sellerEntity.points + 10;
  sellerEntity.save();

  let bidderEntity = fetchAccount(event.params.bidder);
  bidderEntity.points = bidderEntity.points + 20;
  bidderEntity.save();

  store.remove("SaleInfo", id);
}

export function handleBidCreated(event: BidCreatedEvent): void {
  let collectionAddress = event.params.collection.toHex();
  let tokenId = event.params.tokenId.toString();
  let tokenEntityId = "kcc/"
    .concat(collectionAddress)
    .concat("/")
    .concat(tokenId);
  let id = "saleinfo/".concat(tokenEntityId);
  let entity = SaleInfo.load(id);
  if (entity != null) {
    entity.highestBidder = event.params.bidder.toHex();
    entity.highestBid = event.params.amount;

    entity.save();
  }
}
