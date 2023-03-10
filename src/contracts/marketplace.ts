import {
  CollectionAdded as CollectionAddedEvent,
  CollectionRemoved as CollectionRemovedEvent,
  CollectionUnverify as CollectionUnverifyEvent,
  CollectionUpdated as CollectionUpdatedEvent,
  CollectionVerify as CollectionVerifyEvent,
  ItemDelisted as ItemDelistedEvent,
  ItemListed as ItemListedEvent,
  ItemSold as ItemSoldEvent,
  ItemUpdated as ItemUpdatedEvent,
  RevenueWithdrawn as RevenueWithdrawnEvent,
} from "../../generated/Marketplace/Marketplace";
import {
  SupportedCollection,
  SaleInfo,
  collection,
} from "../../generated/schema";
import { store, BigInt } from "@graphprotocol/graph-ts";
import { fetchAccount, fetchRegistry, fetchToken } from "../utils/erc721";
import { updateMarketplace } from "./contractUtils";

export function handleCollectionAdded(event: CollectionAddedEvent): void {
  let collectionEntity = collection.load(event.params._collection.toHex());
  if (collectionEntity == null) {
    collectionEntity = fetchRegistry(event.params._collection);
  }
  let entity = new SupportedCollection(
    "supportedcollection/".concat(collectionEntity.id)
  );
  entity.id = "supportedcollection/".concat(collectionEntity.id);
  entity.feeCollector = event.params.feeCollector;
  entity.royaltyFees = event.params.royaltyFees;
  entity.verificationStatus = event.params.verificationStatus;
  entity.collection = collectionEntity.id;
  entity.save();
}

export function handleCollectionRemoved(event: CollectionRemovedEvent): void {
  let entity = SupportedCollection.load(
    "supportedcollection/".concat(event.params._collection.toHex())
  );
  if (entity != null) {
    store.remove("SupportedCollection", entity.id);
  }
}

export function handleCollectionUnverify(event: CollectionUnverifyEvent): void {
  let entity = SupportedCollection.load(
    "supportedcollection/".concat(event.params._collection.toHex())
  );
  if (entity != null) {
    entity.verificationStatus = event.params.verificationStatus;
    entity.save();
  }
}

export function handleCollectionUpdated(event: CollectionUpdatedEvent): void {
  let entity = SupportedCollection.load(
    "supportedcollection/".concat(event.params._collection.toHex())
  );
  if (entity != null) {
    entity.feeCollector = event.params.feeCollector;
    entity.royaltyFees = event.params.royaltyFees;
    entity.verificationStatus = event.params.verificationStatus;

    entity.save();
  }
}

export function handleCollectionVerify(event: CollectionVerifyEvent): void {
  let entity = SupportedCollection.load(
    "supportedcollection/".concat(event.params._collection.toHex())
  );
  if (entity != null) {
    entity.verificationStatus = event.params.verificationStatus;

    entity.save();
  }
}

export function handleItemDelisted(event: ItemDelistedEvent): void {
  let collectionAddress = event.params.collection.toHex();
  let tokenId = event.params.tokenId;
  let tokenEntityId = "kcc/"
    .concat(collectionAddress)
    .concat("/")
    .concat(tokenId.toString());
  let entity = SaleInfo.load("saleinfo/".concat(tokenEntityId));
  if (entity != null) {
    store.remove("SaleInfo", entity.id);
  }
}

export function handleItemListed(event: ItemListedEvent): void {
  let collectionAddress = event.params.collection.toHex();
  let tokenId = event.params.tokenId;
  let tokenEntityId = "kcc/"
    .concat(collectionAddress)
    .concat("/")
    .concat(tokenId.toString());
  let entityId = "saleinfo/".concat(tokenEntityId);
  let collectionEntity = fetchRegistry(event.params.collection);
  let timestampBigInt = BigInt.fromI32(event.block.timestamp.toI32());
  let TOKEN = fetchToken(
    collectionEntity,
    event.params.tokenId,
    timestampBigInt
  );
  let sellerEntity = fetchAccount(event.params.seller);
  if (TOKEN != null) {
    let entity = new SaleInfo(entityId);
    entity.tokenId = TOKEN.id;
    entity.collection = collectionEntity.id;
    entity.seller = sellerEntity.id;
    entity.salePrice = event.params.price;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;
    entity.approved = true;
    entity.state = "fixedSale";
    entity.save();
  }
}

export function handleItemSold(event: ItemSoldEvent): void {
  let collectionAddress = event.params.collection.toHex();
  let tokenId = event.params.tokenId;
  let tokenEntityId = "kcc/"
    .concat(collectionAddress)
    .concat("/")
    .concat(tokenId.toString());
  let entity = SaleInfo.load("saleinfo/".concat(tokenEntityId));
  updateMarketplace(event);
  let sellerEntity = fetchAccount(event.params.seller);
  sellerEntity.points = sellerEntity.points + 10;
  sellerEntity.totalSales = sellerEntity.totalSales + 1;
  sellerEntity.save();
  let buyerEntity = fetchAccount(event.params.buyer);
  buyerEntity.totalVolume = buyerEntity.totalVolume.plus(event.params.price);
  buyerEntity.points = buyerEntity.points + 20;
  buyerEntity.save();

  if (entity != null) {
    store.remove("SaleInfo", entity.id);
  }
}

export function handleItemUpdated(event: ItemUpdatedEvent): void {
  let collectionAddress = event.params.collection.toHex();
  let tokenId = event.params.tokenId;
  let tokenEntityId = "kcc/"
    .concat(collectionAddress)
    .concat("/")
    .concat(tokenId.toString());
  let entity = SaleInfo.load("saleinfo/".concat(tokenEntityId));
  if (entity != null) {
    entity.salePrice = event.params.newPrice;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
  }
}

export function handleRevenueWithdrawn(event: RevenueWithdrawnEvent): void {
  let entity = fetchAccount(event.params.eoa);
  entity.revenue = entity.revenue.plus(event.params.amount);
  entity.save();
}
