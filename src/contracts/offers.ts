import { BigInt, store } from "@graphprotocol/graph-ts";
import { collection, SaleInfo } from "../../generated/schema";
import {
  CollectionOfferAccepted as CollectionOfferAcceptedEvent,
  CollectionOfferCreated as CollectionOfferCreatedEvent,
  CollectionOfferDeleted as CollectionOfferDeletedEvent,
  OfferAccepted as OfferAcceptedEvent,
  OfferCancelled as OfferCancelledEvent,
  OfferCreated as OfferCreatedEvent,
  OfferUpdated as OfferUpdatedEvent,
} from "../../generated/Offers/Offers";
import { CollectionOffer, CollectionsTokenOffer } from "../../generated/schema";
import { constants } from "../graphprotcol-utls";
import { fetchAccount, fetchRegistry, fetchToken } from "../utils/erc721";
import { updateOffers } from "./offersUtils";
import { updateCollectionOffers } from "./collectionofferUtils";

export function handleCollectionOfferAccepted(
  event: CollectionOfferAcceptedEvent
): void {
  let collectionAddress = event.params.collection.toHex();
  let tokenId = event.params.tokenId;
  let tokenEntityId = "kcc/"
    .concat(collectionAddress)
    .concat("/")
    .concat(tokenId.toString());
  let entity = CollectionOffer.load(
    "collectionoffer/"
      .concat(collectionAddress)
      .concat("/")
      .concat(event.params.buyer.toHexString())
  );
  let creatorEntity = fetchAccount(event.params.buyer);
  creatorEntity.points = creatorEntity.points + 20;
  creatorEntity.save();
  let sellerEntity = fetchAccount(event.params.seller);
  sellerEntity.points = sellerEntity.points + 10;
  sellerEntity.save();

  if (entity != null) {
    let saleInfoEntity = SaleInfo.load("saleinfo/".concat(tokenEntityId));
    if (saleInfoEntity != null) {
      store.remove("SaleInfo", saleInfoEntity.id);
    }
    let collectionEntity = collection.load(collectionAddress);
    if (collectionEntity != null) {
      collectionEntity.TVL = collectionEntity.TVL.minus(event.params.value);
      collectionEntity.save();
    }
    updateCollectionOffers(event);
    entity.amount = entity.amount.minus(event.params.value);
    entity.total = entity.total.minus(constants.BIGINT_ONE);
    if (entity.total.equals(constants.BIGINT_ZERO)) {
      store.remove("CollectionOffer", entity.id);
    } else {
      entity.save();
    }
  }
}

export function handleCollectionOfferCreated(
  event: CollectionOfferCreatedEvent
): void {
  let collectionEntity = fetchRegistry(event.params.collection);

  let entity = new CollectionOffer(
    "collectionoffer/"
      .concat(collectionEntity.id)
      .concat("/")
      .concat(event.params.buyer.toHexString())
  );
  let creatorEntity = fetchAccount(event.params.buyer);

  collectionEntity.TVL = collectionEntity.TVL.plus(event.params.amount);
  collectionEntity.save();

  entity.creator = creatorEntity.id;
  entity.collection = collectionEntity.id;
  entity.amount = event.params.amount;
  entity.total = event.params.total;
  entity.validity = event.params.validity;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleCollectionOfferDeleted(
  event: CollectionOfferDeletedEvent
): void {
  let collectionAddress = event.params.collection.toHex();
  let entity = CollectionOffer.load(
    "collectionoffer/"
      .concat(collectionAddress)
      .concat("/")
      .concat(event.params.buyer.toHexString())
  );
  if (entity != null) {
    let collectionEntity = collection.load(collectionAddress);
    if (collectionEntity != null) {
      collectionEntity.TVL = collectionEntity.TVL.minus(event.params.amount);
      collectionEntity.save();
    }
    store.remove("CollectionOffer", entity.id);
  }
}

export function handleOfferAccepted(event: OfferAcceptedEvent): void {
  let collectionAddress = event.params.collection.toHex();
  let tokenId = event.params.tokenId.toString();
  let tokenEntityId = "kcc/"
    .concat(collectionAddress)
    .concat("/")
    .concat(tokenId);
  let id = "collectionstokenoffer/"
    .concat(tokenEntityId)
    .concat("/")
    .concat(event.params.creator.toHex());
  let entity = CollectionsTokenOffer.load(id);
  if (entity != null) {
    let collectionEntity = fetchRegistry(event.params.collection);
    collectionEntity.TVL = collectionEntity.TVL.minus(event.params.value);

    updateOffers(event);
    let creator = fetchAccount(event.params.creator);
    creator.points = creator.points + 20;

    let seller = fetchAccount(event.params.owner);
    seller.points = seller.points + 10;

    seller.save();
    creator.save();
    collectionEntity.save();

    store.remove("CollectionsTokenOffer", id);
  }
}

export function handleOfferCancelled(event: OfferCancelledEvent): void {
  let collectionAddress = event.params.collection.toHex();
  let tokenId = event.params.tokenId.toString();
  let tokenEntityId = "kcc/"
    .concat(collectionAddress)
    .concat("/")
    .concat(tokenId);
  let id = "collectionstokenoffer/"
    .concat(tokenEntityId)
    .concat("/")
    .concat(event.params.creator.toHex());
  let entity = CollectionsTokenOffer.load(id);
  if (entity != null) {
    let value = entity.value;
    let collectionEntity = collection.load(collectionAddress);
    if (collectionEntity != null) {
      collectionEntity.TVL = collectionEntity.TVL.minus(value);
      collectionEntity.save();
    }
    store.remove("CollectionsTokenOffer", id);
  }
}

export function handleOfferCreated(event: OfferCreatedEvent): void {
  let collectionEntity = fetchRegistry(event.params.collection);

  let timestampBigInt = BigInt.fromI32(event.block.timestamp.toI32());
  let TOKEN = fetchToken(
    collectionEntity,
    event.params.tokenId,
    timestampBigInt
  );

  let entityId = "collectionstokenoffer/"
    .concat(TOKEN.id)
    .concat("/")
    .concat(event.params.creator.toHex());

  collectionEntity.TVL = collectionEntity.TVL.plus(event.params.value);
  collectionEntity.save();

  let entity = new CollectionsTokenOffer(entityId);
  entity.collection = collectionEntity.id;
  entity.tokenId = TOKEN.id;
  entity.creator = event.params.creator.toHex();
  entity.value = event.params.value;
  entity.validity = event.params.validity;

  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOfferUpdated(event: OfferUpdatedEvent): void {
  let collectionAddress = event.params.collection.toHex();
  let tokenId = event.params.tokenId.toString();
  let tokenEntityId = "kcc/"
    .concat(collectionAddress)
    .concat("/")
    .concat(tokenId);
  let id = "collectionstokenoffer/"
    .concat(tokenEntityId)
    .concat("/")
    .concat(event.params.creator.toHex());
  let entity = CollectionsTokenOffer.load(id);
  if (entity != null) {
    let collectionEntity = collection.load(collectionAddress);
    if (collectionEntity != null) {
      collectionEntity.TVL = collectionEntity.TVL.plus(event.params.value);
      collectionEntity.save();
    }
    entity.value = event.params.value;
    entity.validity = event.params.validity;
    entity.save();
  }
}
