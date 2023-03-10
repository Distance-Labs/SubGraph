import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AdminUpdated,
  CollectionAdded,
  CollectionRemoved,
  CollectionUnverify,
  CollectionUpdated,
  CollectionVerify,
  ItemDelisted,
  ItemListed,
  ItemSold,
  ItemUpdated,
  NFTRecovery,
  OwnershipTransferred,
  Pause,
  Paused,
  RevenueWithdrawn,
  TokenRecovery,
  TradeFeeUpdated,
  Unpause,
  Unpaused
} from "../generated/Marketplace/Marketplace"

export function createAdminUpdatedEvent(admin: Address): AdminUpdated {
  let adminUpdatedEvent = changetype<AdminUpdated>(newMockEvent())

  adminUpdatedEvent.parameters = new Array()

  adminUpdatedEvent.parameters.push(
    new ethereum.EventParam("admin", ethereum.Value.fromAddress(admin))
  )

  return adminUpdatedEvent
}

export function createCollectionAddedEvent(
  _collection: Address,
  feeCollector: Address,
  royaltyFees: BigInt,
  verificationStatus: i32
): CollectionAdded {
  let collectionAddedEvent = changetype<CollectionAdded>(newMockEvent())

  collectionAddedEvent.parameters = new Array()

  collectionAddedEvent.parameters.push(
    new ethereum.EventParam(
      "_collection",
      ethereum.Value.fromAddress(_collection)
    )
  )
  collectionAddedEvent.parameters.push(
    new ethereum.EventParam(
      "feeCollector",
      ethereum.Value.fromAddress(feeCollector)
    )
  )
  collectionAddedEvent.parameters.push(
    new ethereum.EventParam(
      "royaltyFees",
      ethereum.Value.fromUnsignedBigInt(royaltyFees)
    )
  )
  collectionAddedEvent.parameters.push(
    new ethereum.EventParam(
      "verificationStatus",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(verificationStatus))
    )
  )

  return collectionAddedEvent
}

export function createCollectionRemovedEvent(
  _collection: Address
): CollectionRemoved {
  let collectionRemovedEvent = changetype<CollectionRemoved>(newMockEvent())

  collectionRemovedEvent.parameters = new Array()

  collectionRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "_collection",
      ethereum.Value.fromAddress(_collection)
    )
  )

  return collectionRemovedEvent
}

export function createCollectionUnverifyEvent(
  _collection: Address,
  verificationStatus: i32
): CollectionUnverify {
  let collectionUnverifyEvent = changetype<CollectionUnverify>(newMockEvent())

  collectionUnverifyEvent.parameters = new Array()

  collectionUnverifyEvent.parameters.push(
    new ethereum.EventParam(
      "_collection",
      ethereum.Value.fromAddress(_collection)
    )
  )
  collectionUnverifyEvent.parameters.push(
    new ethereum.EventParam(
      "verificationStatus",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(verificationStatus))
    )
  )

  return collectionUnverifyEvent
}

export function createCollectionUpdatedEvent(
  _collection: Address,
  feeCollector: Address,
  royaltyFees: BigInt,
  verificationStatus: i32
): CollectionUpdated {
  let collectionUpdatedEvent = changetype<CollectionUpdated>(newMockEvent())

  collectionUpdatedEvent.parameters = new Array()

  collectionUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "_collection",
      ethereum.Value.fromAddress(_collection)
    )
  )
  collectionUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "feeCollector",
      ethereum.Value.fromAddress(feeCollector)
    )
  )
  collectionUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "royaltyFees",
      ethereum.Value.fromUnsignedBigInt(royaltyFees)
    )
  )
  collectionUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "verificationStatus",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(verificationStatus))
    )
  )

  return collectionUpdatedEvent
}

export function createCollectionVerifyEvent(
  _collection: Address,
  verificationStatus: i32
): CollectionVerify {
  let collectionVerifyEvent = changetype<CollectionVerify>(newMockEvent())

  collectionVerifyEvent.parameters = new Array()

  collectionVerifyEvent.parameters.push(
    new ethereum.EventParam(
      "_collection",
      ethereum.Value.fromAddress(_collection)
    )
  )
  collectionVerifyEvent.parameters.push(
    new ethereum.EventParam(
      "verificationStatus",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(verificationStatus))
    )
  )

  return collectionVerifyEvent
}

export function createItemDelistedEvent(
  collection: Address,
  tokenId: BigInt,
  owner: Address
): ItemDelisted {
  let itemDelistedEvent = changetype<ItemDelisted>(newMockEvent())

  itemDelistedEvent.parameters = new Array()

  itemDelistedEvent.parameters.push(
    new ethereum.EventParam(
      "collection",
      ethereum.Value.fromAddress(collection)
    )
  )
  itemDelistedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemDelistedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return itemDelistedEvent
}

export function createItemListedEvent(
  seller: Address,
  tokenId: BigInt,
  price: BigInt,
  collection: Address
): ItemListed {
  let itemListedEvent = changetype<ItemListed>(newMockEvent())

  itemListedEvent.parameters = new Array()

  itemListedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      "collection",
      ethereum.Value.fromAddress(collection)
    )
  )

  return itemListedEvent
}

export function createItemSoldEvent(
  seller: Address,
  buyer: Address,
  tokenId: BigInt,
  price: BigInt,
  collection: Address
): ItemSold {
  let itemSoldEvent = changetype<ItemSold>(newMockEvent())

  itemSoldEvent.parameters = new Array()

  itemSoldEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  itemSoldEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  itemSoldEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemSoldEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  itemSoldEvent.parameters.push(
    new ethereum.EventParam(
      "collection",
      ethereum.Value.fromAddress(collection)
    )
  )

  return itemSoldEvent
}

export function createItemUpdatedEvent(
  seller: Address,
  tokenId: BigInt,
  newPrice: BigInt,
  collection: Address
): ItemUpdated {
  let itemUpdatedEvent = changetype<ItemUpdated>(newMockEvent())

  itemUpdatedEvent.parameters = new Array()

  itemUpdatedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  itemUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newPrice",
      ethereum.Value.fromUnsignedBigInt(newPrice)
    )
  )
  itemUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "collection",
      ethereum.Value.fromAddress(collection)
    )
  )

  return itemUpdatedEvent
}

export function createNFTRecoveryEvent(
  _collectionAddress: Address,
  tokenId: BigInt
): NFTRecovery {
  let nftRecoveryEvent = changetype<NFTRecovery>(newMockEvent())

  nftRecoveryEvent.parameters = new Array()

  nftRecoveryEvent.parameters.push(
    new ethereum.EventParam(
      "_collectionAddress",
      ethereum.Value.fromAddress(_collectionAddress)
    )
  )
  nftRecoveryEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return nftRecoveryEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPauseEvent(reason: string): Pause {
  let pauseEvent = changetype<Pause>(newMockEvent())

  pauseEvent.parameters = new Array()

  pauseEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  )

  return pauseEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createRevenueWithdrawnEvent(
  eoa: Address,
  amount: BigInt
): RevenueWithdrawn {
  let revenueWithdrawnEvent = changetype<RevenueWithdrawn>(newMockEvent())

  revenueWithdrawnEvent.parameters = new Array()

  revenueWithdrawnEvent.parameters.push(
    new ethereum.EventParam("eoa", ethereum.Value.fromAddress(eoa))
  )
  revenueWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return revenueWithdrawnEvent
}

export function createTokenRecoveryEvent(
  tokenAddress: Address,
  amount: BigInt
): TokenRecovery {
  let tokenRecoveryEvent = changetype<TokenRecovery>(newMockEvent())

  tokenRecoveryEvent.parameters = new Array()

  tokenRecoveryEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  tokenRecoveryEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return tokenRecoveryEvent
}

export function createTradeFeeUpdatedEvent(fees: BigInt): TradeFeeUpdated {
  let tradeFeeUpdatedEvent = changetype<TradeFeeUpdated>(newMockEvent())

  tradeFeeUpdatedEvent.parameters = new Array()

  tradeFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("fees", ethereum.Value.fromUnsignedBigInt(fees))
  )

  return tradeFeeUpdatedEvent
}

export function createUnpauseEvent(reason: string): Unpause {
  let unpauseEvent = changetype<Unpause>(newMockEvent())

  unpauseEvent.parameters = new Array()

  unpauseEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  )

  return unpauseEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}
