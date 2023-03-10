import { Bytes } from "@graphprotocol/graph-ts";
import { Address } from "@graphprotocol/graph-ts";
import { BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";

import { ERC20Abi } from "../generated/WETH/ERC20Abi";

import { currency, transaction } from "../generated/schema";

export namespace events {
  export function id(event: ethereum.Event): string {
    return event.block.number
      .toString()
      .concat("-")
      .concat(event.logIndex.toString());
  }
}

export namespace constants {
  export let BIGINT_ZERO = BigInt.fromI32(0);
  export let BIGINT_ONE = BigInt.fromI32(1);
  export let BIGDECIMAL_ZERO = new BigDecimal(constants.BIGINT_ZERO);
  export let BIGDECIMAL_ONE = new BigDecimal(constants.BIGINT_ONE);
  export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
  export const BYTES32_ZERO =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  export const Marketplace = "0xae19bb9e268b718069f7447e625418cbc6206653";
  export const OfferHouse = "0x0eae4853b1fbc15b2f7d8c30ef1df7d243e1f5c8";
  export const Auction = "0x5c9a09a0143169d36e5de40aa30baae34e476e35";
  export const WKCS = "0x4446fc4eb47f2f6586f9faab68b3498f86c07521";
}

export namespace transactions {
  export function log(event: ethereum.Event): transaction {
    let tx = transaction.load(event.transaction.hash.toHexString());
    if (!tx) {
      tx = new transaction(event.transaction.hash.toHexString());
      tx.timestamp = event.block.timestamp.toI32();
      tx.blockNumber = event.block.number.toI32();
      tx.unmatchedTransferCount = 0;
      tx.gasPrice = event.transaction.gasPrice;
      tx.transactionFrom = event.transaction.from;
      tx.transfers = new Array<string>();
      tx.save();
    }

    return tx as transaction;
  }
  export type Tx = transaction;
}

export namespace ERC20Contracts {
  export function getERC20(address: Address): void {
    let currencyEntity = currency.load(address.toHexString());

    //if currency does not exists attempt to load Abi (on failure assume ETH)
    if (
      !currencyEntity &&
      address == Address.fromString(constants.ADDRESS_ZERO)
    ) {
      let AbiVar = ERC20Abi.bind(address);
      let try_name = AbiVar.try_name();
      let try_symbol = AbiVar.try_symbol();
      let try_deicmals = AbiVar.try_decimals();

      currencyEntity = new currency(address.toHexString());
      currencyEntity.name = try_name.reverted
        ? "KuCoin Shares"
        : try_name.value;
      currencyEntity.symbol = try_symbol.reverted ? "KCS" : try_symbol.value;
      currencyEntity.decimals = try_deicmals.reverted ? 18 : try_deicmals.value;
      currencyEntity.save();
    }

    if (
      !currencyEntity &&
      address != Address.fromString(constants.ADDRESS_ZERO)
    ) {
      let AbiVar = ERC20Abi.bind(address);
      let try_name = AbiVar.try_name();
      let try_symbol = AbiVar.try_symbol();
      let try_deicmals = AbiVar.try_decimals();

      currencyEntity = new currency(address.toHexString());
      currencyEntity.name = try_name.reverted ? "Wrapped KCS" : try_name.value;
      currencyEntity.symbol = try_symbol.reverted ? "WKCS" : try_symbol.value;
      currencyEntity.decimals = try_deicmals.reverted ? 18 : try_deicmals.value;
      currencyEntity.save();
    }
  }
}
