import chai from "chai";
import { Wallet } from "@ethersproject/wallet";
import { deployContract, solidity } from "ethereum-waffle";
import { ethers } from "@nomiclabs/buidler";

import { expect } from "chai";

import rollupUtilsArtifact from "../artifacts/RollupUtils.json";

import { Contract } from "ethers";

chai.use(solidity);

setTimeout(async function () {
  const wallets = (await ethers.getSigners()) as Wallet[];

  describe("RollupUtils", function () {
    beforeEach(async function () {
      this.rollupUtils = (await deployContract(wallets[0], rollupUtilsArtifact)) as Contract;
    });

    it("test account encoding and decoding", async function() {
      var account = {
          ID: 1,
          tokenType: 2,
          balance: 3,
          nonce: 4
      };

      var accountBytes = await this.rollupUtils.BytesFromAccountDeconstructed(
          account.ID,
          account.balance,
          account.nonce,
          account.tokenType
      );
      var regeneratedAccount = await this.rollupUtils.AccountFromBytes(
          accountBytes
      );

      expect(regeneratedAccount["0"].toNumber()).to.equal(account.ID);
      expect(regeneratedAccount["1"].toNumber()).to.equal(account.balance);
      expect(regeneratedAccount["2"].toNumber()).to.equal(account.nonce);
      expect(regeneratedAccount["3"].toNumber()).to.equal(account.tokenType);

      var tx = {
          fromIndex: 1,
          toIndex: 2,
          tokenType: 1,
          amount: 10,
          signature:
              "0x1ad4773ace8ee65b8f1d94a3ca7adba51ee2ca0bdb550907715b3b65f1e3ad9f69e610383dc9ceb8a50c882da4b1b98b96500bdf308c1bdce2187cb23b7d736f1b",
          txType: 1,
          nonce: 0
      };

      var txBytes = await this.rollupUtils.BytesFromTxDeconstructed(
          tx.fromIndex,
          tx.toIndex,
          tx.tokenType,
          tx.nonce,
          tx.txType,
          tx.amount
      );

      var txData = await this.rollupUtils.TxFromBytes(txBytes);

      expect(txData.fromIndex.toString()).to.equal(tx.fromIndex.toString());
      expect(txData.toIndex.toString()).to.equal(tx.toIndex.toString());
      expect(txData.tokenType.toString()).to.equal(tx.tokenType.toString());
      expect(txData.nonce.toString()).to.equal(tx.nonce.toString());
      expect(txData.txType.toString()).to.equal(tx.txType.toString());
      expect(txData.amount.toString()).to.equal(tx.amount.toString());

      var compressedTx = await this.rollupUtils.CompressTxWithMessage(
          txBytes,
          tx.signature
      );

      var decompressedTx = await this.rollupUtils.DecompressTx(compressedTx);

      expect(decompressedTx[0].toNumber()).to.equal(tx.fromIndex);
      expect(decompressedTx[1].toNumber()).to.equal(tx.toIndex);
      expect(decompressedTx[2].toNumber()).to.equal(tx.amount);
      expect(decompressedTx[3].toString()).to.equal(tx.signature);
    });
  });

  run();
}, 1000);
