package com.hedera.hellofuture;

import java.io.ByteArrayOutputStream;
import com.hedera.hellofuture.AccountGetBalance;
import java.io.IOException;
import java.io.InputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.hedera.hellofuture.AccountCreate;
import com.hedera.hellofuture.FileCreate;
import com.hedera.sdk.account.HederaAccount;
import com.hedera.sdk.common.HederaDuration;
import com.hedera.sdk.common.HederaKey.KeyType;
import com.hedera.sdk.common.HederaTimeStamp;
import com.hedera.sdk.common.HederaTransactionAndQueryDefaults;
import com.hedera.sdk.contract.HederaContract;
import com.hedera.sdk.contract.HederaContractFunctionResult;
import com.hedera.sdk.cryptography.HederaCryptoKeyPair;
import com.hedera.sdk.file.HederaFile;
import com.hedera.hellofuture.ExampleUtilities;

public final class HelloFuture_GetBalance {
	final static Logger logger = LoggerFactory.getLogger(DemoContract.class);

	public static void main(String... arguments) {

		// setup a set of defaults for query and transactions
		HederaTransactionAndQueryDefaults txQueryDefaults = new HederaTransactionAndQueryDefaults();
		txQueryDefaults = ExampleUtilities.getTxQueryDefaults();

		// new account object
		HederaAccount account = new HederaAccount();
		// setup transaction/query defaults (durations, etc...)
		account.txQueryDefaults = txQueryDefaults;

		account.accountNum = 1001;
		
		AccountGetBalance.getBalance(account);
		
	}
}