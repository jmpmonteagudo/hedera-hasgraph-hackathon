package com.hedera.hellofuture;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hedera.sdk.account.HederaAccount;
import com.hedera.sdk.common.HederaTransactionRecord;

public final class AccountGetRecords {
	public static void getRecords(HederaAccount account) {
		final Logger logger = LoggerFactory.getLogger(AccountGetRecords.class);
		
		logger.info("");
		logger.info("CRYPTO GET RECORDS");
		logger.info("");

		try {
			// get records for the account
			List<HederaTransactionRecord> records = new ArrayList<HederaTransactionRecord>();
			
			records = account.getRecords();
			if (records != null) {
				logger.info(String.format("===>Got %d records", records.size()));
				for (HederaTransactionRecord record : records) {
					logger.info("Record transaction hash");
					logger.info(record.transactionHash.toString());
				}
			} else {
				logger.info("===>Getting records - precheck ERROR" + account.getPrecheckResult().toString());
			}
			
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}
