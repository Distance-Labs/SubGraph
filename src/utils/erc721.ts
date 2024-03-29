import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

import { IERC721Metadata } from "../../generated/IERC721/IERC721Metadata";

import { Contract721 } from "../../generated/IERC721/Contract721";

import { account, collection, contract, token } from "../../generated/schema";

import { supportsInterface } from "./erc165";

import { constants } from "../graphprotcol-utls";

export function fetchRegistry(address: Address): collection {
  let erc721 = IERC721Metadata.bind(address);
  let Collection = Contract721.bind(address);
  let contractEntity = contract.load(address.toHexString());

  if (contractEntity == null) {
    contractEntity = new contract(address.toHexString());
    let introspection_01ffc9a7 = supportsInterface(erc721, "01ffc9a7"); // ERC165
    let introspection_80ac58cd = supportsInterface(erc721, "80ac58cd"); // ERC721
    let introspection_00000000 = supportsInterface(erc721, "00000000", false);
    let isERC721 =
      introspection_01ffc9a7 &&
      introspection_80ac58cd &&
      introspection_00000000;
    contractEntity.asERC721 = isERC721 ? contractEntity.id : null;
    contractEntity.save();
  }

  let collectionEntity = collection.load(contractEntity.id);
  if (collectionEntity == null) {
    collectionEntity = new collection(contractEntity.id);

    //contract calls
    let try_name = erc721.try_name();
    let try_symbol = erc721.try_symbol();
    let try_mintPrice = Collection.try_price();
    let mintPriceBigInt = try_mintPrice.reverted
      ? BigInt.fromI32(0)
      : try_mintPrice.value;
    let mintPrice = mintPriceBigInt.divDecimal(
      BigDecimal.fromString("1000000000000000000")
    );

    collectionEntity.name = try_name.reverted ? "" : try_name.value;
    collectionEntity.symbol = try_symbol.reverted ? "" : try_symbol.value;
    collectionEntity.mintPrice = mintPrice;
    collectionEntity.supportsMetadata = supportsInterface(erc721, "5b5e139f"); // ERC721Metadata
    collectionEntity.totalSales = 0;
    collectionEntity.totalVolume = constants.BIGDECIMAL_ZERO;
    collectionEntity.topSale = constants.BIGDECIMAL_ZERO;
    collectionEntity.TVL = constants.BIGINT_ZERO;
  }
  return collectionEntity as collection;
}

export function fetchToken(
  collection: collection,
  id: BigInt,
  timestamp: BigInt
): token {
  let tokenid = "kcc/".concat(collection.id.concat("/").concat(id.toString()));
  let tokenEntity = token.load(tokenid);
  let timeout = BigInt.fromI32(2592000);
  let lastUpdate = tokenEntity
    ? tokenEntity.updatedAtTimestamp.plus(timeout)
    : BigInt.fromI32(0);
  if (tokenEntity == null || lastUpdate.lt(timestamp)) {
    let account_zero = new account(constants.ADDRESS_ZERO);
    account_zero.save();

    tokenEntity = new token(tokenid);
    tokenEntity.collection = collection.id;
    tokenEntity.identifier = id;
    tokenEntity.tokenId = id.toString();

    //update collection's total supply
    let Collection = Contract721.bind(Address.fromString(collection.id));
    let try_totalSupply = Collection.try_totalSupply();
    let tokenURI = Collection.try_tokenURI(id);

    tokenEntity.tokenURI = tokenURI.reverted ? "" : tokenURI.value;
    tokenEntity.updatedAtTimestamp = timestamp;
    collection.totalSupply = try_totalSupply.reverted
      ? BigInt.fromI32(0)
      : try_totalSupply.value;
  }
  return tokenEntity as token;
}

export function fetchAccount(address: Address): account {
  let addressAccount = address.toHexString();
  let accountEntity = account.load(addressAccount);

  if (accountEntity == null && addressAccount != constants.ADDRESS_ZERO) {
    accountEntity = new account(address.toHexString());
    accountEntity.points = 0;
    accountEntity.totalVolume = constants.BIGINT_ZERO;
    accountEntity.revenue = constants.BIGINT_ZERO;
    accountEntity.totalSales = 0;

    accountEntity.save();
  }
  return accountEntity as account;
}
