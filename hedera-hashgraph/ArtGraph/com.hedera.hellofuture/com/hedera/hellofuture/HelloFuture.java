package com.hedera.hellofuture;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hedera.sdk.account.HederaAccount;
import com.hedera.sdk.account.HederaAccountCreateDefaults;
import com.hedera.sdk.account.HederaAccountUpdateValues;
import com.hedera.sdk.account.HederaClaim;
import com.hedera.sdk.common.HederaAccountID;
import com.hedera.sdk.common.HederaDuration;
import com.hedera.sdk.common.HederaKey;
import com.hedera.sdk.common.HederaPrecheckResult;
import com.hedera.sdk.common.HederaKey.KeyType;
import com.hedera.sdk.common.HederaTransactionAndQueryDefaults;
import com.hedera.sdk.common.HederaTransactionID;
import com.hedera.sdk.common.HederaTransactionReceipt;
import com.hedera.sdk.common.HederaTransactionRecord;
import com.hedera.sdk.common.HederaTransactionStatus;
import com.hedera.sdk.common.Utilities;
import com.hedera.sdk.cryptography.HederaCryptoKeyPair;
import com.hedera.sdk.node.HederaNode;
import com.hedera.sdk.transaction.HederaTransactionResult;

public final class HelloFuture {

	public static void main (String... arguments) throws Exception {
		final Logger logger = LoggerFactory.getLogger(HelloFuture.class);
		
		//DO NOT CHANGE THESE, CHANGE BELOW INSTEAD
		boolean create = false; //OK
    	boolean balance = false; //OK
    	boolean send = false; //NOK
    	boolean info = false; //OK
    	boolean update = false; //OK
    	boolean doAddClaim = false;//OK
		boolean getTXRecord = false;
		
		// setup a set of defaults for query and transactions
		HederaTransactionAndQueryDefaults txQueryDefaults = new HederaTransactionAndQueryDefaults();
		txQueryDefaults = ExampleUtilities.getTxQueryDefaults();
		
    	// new account objects
    	HederaAccount account = new HederaAccount();
    	HederaAccount accountXferTo = new HederaAccount();
    	
    	// setup transaction/query defaults (durations, etc...)
    	account.txQueryDefaults = txQueryDefaults;
    	accountXferTo.txQueryDefaults = txQueryDefaults;
    	
    	create = true;
    	balance = true;
    	send = true;
    	info = true;
    	update = true;
//    	doAddClaim = true; -- not implemented ?
    	getTXRecord = true;
    	
		// create an account
    	if (create) {
    		account.txQueryDefaults.generateRecord = getTXRecord;
	    	HederaCryptoKeyPair newAccountKey = new HederaCryptoKeyPair(KeyType.ED25519);
	    	HederaCryptoKeyPair accountXferToKey = new HederaCryptoKeyPair(KeyType.ED25519);
	    	
	    	account = AccountCreate.create(account, newAccountKey,10);
	    	if (account == null) {
    			logger.info("*******************************************");
    			logger.info("FIRST ACCOUNT CREATE FAILED");
    			logger.info("*******************************************");
    			throw new Exception("Account create failure");
	    	} else {
	    		if (getTXRecord) {
	    			  HederaTransactionID txID = account.hederaTransactionID;
	    			  HederaTransactionRecord txRecord = new HederaTransactionRecord(txID, 10, txQueryDefaults);
    			}
	    	}
    		account.txQueryDefaults.generateRecord = false;
	    	if (account != null) {
	    		// the paying account is now the new account
	    		txQueryDefaults.payingAccountID = account.getHederaAccountID();
	    		txQueryDefaults.payingKeyPair = newAccountKey;

	    		// get balance for the account
	    		if (balance) {
	    			AccountGetBalance.getBalance(account);
	    		}
	    	}

	        if (send) {
		    	accountXferTo = AccountCreate.create(accountXferTo, accountXferToKey, 1);
		    	if (accountXferTo == null) {
	    			logger.info("*******************************************");
	    			logger.info("SECOND ACCOUNT CREATE FAILED");
	    			logger.info("*******************************************");
	    			throw new Exception("Account create failure");
		    	}
	    	}
	    	
	    	if (account != null) {

		        // get balance for the account
		    	if (balance) {
		    		AccountGetBalance.getBalance(account);
		    	}
		
				// send some crypto
		    	if (send) {
		    		AccountSend.send(account, accountXferTo, 1);
		    	}
				// get balance for the account
		    	if (balance) {
		    		AccountGetBalance.getBalance(account);
		    	}
				// get account info
		    	if (info) {
		    		AccountGetInfo.getInfo(account);
		    	}
		
				// update the account
		    	if (update) {
		    		// setup an object to contain values to update
		    		HederaAccountUpdateValues updates = new HederaAccountUpdateValues();
		    		
		    		// create a new key
		    	    HederaCryptoKeyPair ed25519Key = new HederaCryptoKeyPair(KeyType.ED25519);
		    	    			
		    	    // set the new key for the account
		    		updates.newKey = ed25519Key;
		    		// new proxy account details
		    		updates.proxyAccountShardNum = 0;
		    		updates.proxyAccountRealmNum = 0;
		    		updates.proxyAccountAccountNum = 1;
		    		// new proxy fraction
		    		updates.proxyFraction = 2;
		    		// new threshold for sending
		    		updates.sendRecordThreshold = 4000;
		    		// new threshold for receiving
		    		updates.receiveRecordThreshold = 3000;
		    		// new auto renew period
		    		updates.autoRenewPeriodSeconds = 10;
		    		updates.autoRenewPeriosNanos = 20;
		    		// new expiration time
		    		updates.expirationTimeSeconds = 200;
		    		updates.expirationTimeNanos = 100;
		    		
		    		account = AccountUpdate.update(account, updates);
		    		if (account != null) {
		    			AccountGetInfo.getInfo(account);
		    		} else {
		    			logger.info("*******************************************");
		    			logger.info("ACCOUNT UPDATE FAILED - account is now null");
		    			logger.info("*******************************************");
		    		}
		    	}
		
		    	if ((account != null) && (doAddClaim)) {
			    	HederaCryptoKeyPair claimKeyPair = new HederaCryptoKeyPair(KeyType.ED25519);
			        HederaKey claimKey = new HederaKey(claimKeyPair.getKeyType(), claimKeyPair.getPublicKey());
			
					// Create a new claim object
					HederaClaim claim;
					try {
						claim = new HederaClaim(account.shardNum, account.realmNum, account.accountNum, "ClaimHash".getBytes("UTF-8"));
						// add a key to the claim
						claim.addKey(claimKey);
				        // add a claim
				        if (AccountAddClaim.addClaim(account,claim, claimKeyPair)) {
				        }
					} catch (UnsupportedEncodingException e) {
						e.printStackTrace();
					}
		    	} else if (account == null) {
	    			logger.info("*******************************************");
	    			logger.info("ACCOUNT object is null, skipping claim tests");
	    			logger.info("*******************************************");
		    	}
	    	}
    	}	    	

	
	
	
	
	
	
	/*
	public static void main (String[] args) {

		System.out.println("start");
		
		// node details
//		String nodeAddress = "localhost";
//		int nodePort = 50211;
		String nodeAddress = "testnet3.hedera.com";
		int nodePort = 80;
		
		// these are loaded from config.properties below
		long nodeAccountShard = 0;
		long nodeAccountRealm = 0;
		long nodeAccountNum = 3;
		// your account details
		long payAccountShard = 0;
		long payAccountRealm = 0;
		long payAccountNum = 1001;
		// you public and private keys
		String pubKey = "302a300506032b6570032100f05f33a871d856fe1824369d0b3c4c60db972a938d676b510bbc4b3b8ecaf4e3";
		String privKey = "302e020100300506032b6570042204203310a5046c61a8b09a57c6559c98aa78863abed1488bc3b87fbdf96a5818658e";
		
		// load application properties
		Properties applicationProperties = new Properties();
		InputStream propertiesInputStream = null;
			
		try {
			propertiesInputStream = new FileInputStream("node.properties");
			// load a properties file
			applicationProperties.load(propertiesInputStream);
			// get the node's account values
			nodeAccountShard = Long.parseLong(applicationProperties.getProperty("nodeAccountShard"));
			nodeAccountRealm = Long.parseLong(applicationProperties.getProperty("nodeAccountRealm"));
			nodeAccountNum = Long.parseLong(applicationProperties.getProperty("nodeAccountNum"));
			
			// get my public/private keys
			pubKey = applicationProperties.getProperty("pubkey");
			privKey = applicationProperties.getProperty("privkey");

			// get my account details
			payAccountShard = Long.parseLong(applicationProperties.getProperty("payingAccountShard"));
			payAccountRealm = Long.parseLong(applicationProperties.getProperty("payingAccountRealm"));
			payAccountNum = Long.parseLong(applicationProperties.getProperty("payingAccountNum"));

		} catch (IOException ex) {
			ex.printStackTrace();
		} finally {
			if (propertiesInputStream != null) {
				try {
					propertiesInputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

		// setup defaults for transactions and Queries 
		HederaTransactionAndQueryDefaults txQueryDefaults = new HederaTransactionAndQueryDefaults();
		
		// default memo to attach to transactions
		txQueryDefaults.memo = "Hello Future";
		
		// setup the node we're communicating with from the properties loaded above
		//txQueryDefaults.node = new HederaNode(nodeAddress, nodePort, new HederaAccountID(nodeAccountShard, nodeAccountRealm, nodeAccountNum));
		
		// setup the paying account ID (got from the properties loaded above)
		txQueryDefaults.payingAccountID = new HederaAccountID(payAccountShard, payAccountRealm, payAccountNum);

		// setup the paying key pair (got from properties loaded above)
		txQueryDefaults.payingKeyPair = new HederaCryptoKeyPair(KeyType.ED25519, pubKey, privKey);
		
		// define the valid duration for the transactions (seconds, nanos)
		txQueryDefaults.transactionValidDuration = new HederaDuration(120, 0);

		// instantiate a new account object
		HederaAccount myNewAccount = new HederaAccount();
		
		// set its default Transaction and Query parameters
		myNewAccount.txQueryDefaults = txQueryDefaults;
		
		// create a new key for my new account
		HederaCryptoKeyPair newAccountKey = new HederaCryptoKeyPair(KeyType.ED25519);
		
		// now, setup default for account creation 
		HederaAccountCreateDefaults defaults = new HederaAccountCreateDefaults();
		// auto renew period in seconds and nanos
		defaults.autoRenewPeriodSeconds = 86400;
		defaults.autoRenewPeriodNanos = 0;
//			defaults.maxReceiveProxyFraction = 0;
//			defaults.proxyFraction = 1;
//			defaults.receiveRecordThreshold = Long.MAX_VALUE;
//			defaults.receiverSignatureRequired = false;
//			defaults.sendRecordThreshold = Long.MAX_VALUE;
		
		byte[] publicKey = newAccountKey.getPublicKey();
		KeyType keyType = newAccountKey.getKeyType();
		
		try {

			// send create account transaction
			long shardToCreateIn = 0;
			long realmToCreateIn = 0;
			long startingBalance = 10000;
			// let's create the account
			HederaTransactionResult createResult = myNewAccount.create(shardToCreateIn
								, realmToCreateIn
								, publicKey
								, keyType
								, startingBalance, defaults);
			
			// was it successful ?
			if (createResult.getPrecheckResult() == HederaPrecheckResult.OK) {
				
				// yes, get a receipt for the transaction
				HederaTransactionReceipt receipt = Utilities.getReceipt(myNewAccount.hederaTransactionID, myNewAccount.txQueryDefaults.node);
				
				// was that successful ?
				if (receipt.transactionStatus == HederaTransactionStatus.SUCCESS) {
					// yes, get the new account number from the receipt
					myNewAccount.accountNum = receipt.accountID.accountNum;
					// and print it out
					System.out.println(String.format("===>Your new account number is %d", myNewAccount.accountNum));
					
					// get balance
					myNewAccount.txQueryDefaults.payingAccountID = myNewAccount.getHederaAccountID();
					myNewAccount.txQueryDefaults.payingKeyPair = newAccountKey;
					
					myNewAccount.getBalance();
					
					HederaAccountID toAccountID = new HederaAccountID(nodeAccountShard, nodeAccountRealm, nodeAccountNum);
					myNewAccount.send(toAccountID, 100);
					
					Thread.sleep(1000);
					
					myNewAccount.getBalance();
					
				}
			}
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	*/
	}
}