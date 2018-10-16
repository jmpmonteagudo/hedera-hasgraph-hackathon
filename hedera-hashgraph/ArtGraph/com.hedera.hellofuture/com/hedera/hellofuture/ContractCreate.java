package com.hedera.hellofuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hedera.sdk.common.HederaDuration;
import com.hedera.sdk.common.HederaFileID;
import com.hedera.sdk.common.HederaPrecheckResult;
import com.hedera.sdk.common.HederaTransactionReceipt;
import com.hedera.sdk.common.HederaTransactionRecord;
import com.hedera.sdk.common.HederaTransactionStatus;
import com.hedera.sdk.common.Utilities;
import com.hedera.sdk.contract.HederaContract;
import com.hedera.sdk.node.HederaNode;
import com.hedera.sdk.transaction.HederaTransactionResult;

public final class ContractCreate {
	public static HederaContract create(HederaContract contract, HederaFileID fileID, long initialBalance) {
		return create(contract, fileID, initialBalance, new byte[0]); 
	}
	
	public static HederaContract create(HederaContract contract, HederaFileID fileID, long initialBalance, byte[] constParams) {
		final Logger logger = LoggerFactory.getLogger(HederaContract.class);
		// new contract
		long shardNum = 0;
		long realmNum = 0;
		long gas = 1; //32936*3; // WIP: issues with contract deployment gas
		byte[] constructorParameters = constParams; 
		HederaDuration autoRenewPeriod = new HederaDuration(60, 10);

		//fee 100
		contract.txQueryDefaults.node.contractCreateTransactionFee = 100;
		contract.txQueryDefaults.generateRecord = true;
		
		logger.info("");
		logger.info("CONTRACT CREATE");
		logger.info("");

		// create the new contract
		try {
			// contract creation transaction
			System.out.println("Sleeping...");
			Thread.sleep(15000);
			System.out.println("Sleeping done!");
			HederaTransactionResult createResult = contract.create(shardNum, realmNum, fileID, initialBalance, gas,
					constructorParameters, autoRenewPeriod);
			// was it successful ?
			if (createResult.getPrecheckResult() == HederaPrecheckResult.OK) {
				// yes, get a receipt for the transaction
				System.out.println("Sleeping...");
				Thread.sleep(15000);
				System.out.println("Sleeping done!");
				
				HederaNode node = contract.txQueryDefaults.node;
				HederaTransactionReceipt receipt = Utilities.getReceipt(contract.hederaTransactionID,
						node);
				// was that successful ?
				if (receipt.transactionStatus == HederaTransactionStatus.SUCCESS) {
					contract.contractNum = receipt.contractID.contractNum;
					// and print it out
					logger.info(String.format("===>Your new contract number is %d", contract.contractNum));
					HederaTransactionRecord record = new HederaTransactionRecord(contract.hederaTransactionID, contract.txQueryDefaults.node.contractGetRecordsQueryFee, contract.txQueryDefaults);
				} else {
					logger.info("Failed with transactionStatus:" + receipt.transactionStatus.toString());
					return null;
				}
			} else {
				logger.info("getPrecheckResult not OK: " + createResult.getPrecheckResult().name());
				return null;
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
			return null;
		}
		return contract;
	}
}
