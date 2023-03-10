import { BigDecimal, Address } from "@graphprotocol/graph-ts";
import { transaction } from "../../generated/schema";
import { BidAccepted as BidAcceptedEvent } from "../../generated/Auction/Auction";
import { sale, currency } from "../../generated/schema";
import { MatchTransferWithSale } from "../utils/matchTransferSale";
import { constants, ERC20Contracts } from "../graphprotcol-utls";
export function updateAuction(event: BidAcceptedEvent): void {
  let tx = transaction.load(event.transaction.hash.toHexString());
  if (tx) {
    //3. create new sale entity (id = tx hash - eventId)
    let saleEntity = sale.load(
      event.block.number.toString() + "-" + event.logIndex.toString()
    );
    if (!saleEntity && tx.unmatchedTransferCount > 0) {
      let WKCS = Address.fromString(constants.WKCS);
      let KCS = Address.fromString(constants.ADDRESS_ZERO);
      const CURRENCY = event.transaction.value.gt(constants.BIGINT_ZERO)
        ? KCS
        : WKCS;
      ERC20Contracts.getERC20(CURRENCY);
      let currencyEntity = currency.load(CURRENCY.toHexString());
      if (currencyEntity) {
        //4. Assign currency address, amount, txId and platform to sale entity
        let saleEntity = new sale(
          event.block.number.toString() + "-" + event.logIndex.toString()
        );
        saleEntity.transaction = tx.id;
        saleEntity.currency = currencyEntity.id;
        saleEntity.strategy = "auctionSale";
        saleEntity.amount = event.params.amount.divDecimal(
          BigDecimal.fromString("1000000000000000000")
        );
        saleEntity.blockNumber = event.block.number.toI32();
        saleEntity.timestamp = event.block.timestamp.toI32();
        saleEntity.save();

        //5. Assign sale.amount / transaction.unmatchedTransferCount to variable transferAmount to pass into transfer entities
        // This will derives the amount per transfer (eg each nft's amount in a bundle with 2 NFT's is the total price divided by 2.)
        let transferAmount = saleEntity.amount.div(
          BigDecimal.fromString(tx.unmatchedTransferCount.toString())
        );

        //6. Using unmatchedTransferId loop through the transfer entities and apply the transferAmount and assign saleId ,
        //reducing the unmatchedTransferCount by 1. save transfer update on each loop.
        if (tx.transfers && transferAmount && tx.id && saleEntity.id) {
          let array = tx.transfers;
          for (let index = 0; index < array.length; index++) {
            let trId = array[index];

            MatchTransferWithSale(
              trId,
              transferAmount,
              tx.id,
              saleEntity.id,
              currencyEntity.symbol
            );
          }
        }
      }
    }
  }
}
