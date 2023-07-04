public with sharing class ICICIBankAccount {
    @AuraEnabled(cacheable=true)
    public static List<ICICI_Bank_Customer_Details__c> getFields(String customerId) {
        List<ICICI_Bank_Customer_Details__c> bankDetail = [
            SELECT Name__c, Email__c, BirthDate__c, Enter_Password__c , Contact_Number__c, Address__c, Account_Type__c,	Bank_Balance__c
            FROM ICICI_Bank_Customer_Details__c
            WHERE Customer_Id__c = :customerId
            LIMIT 1
        ];
        return bankDetail;
    }

    @AuraEnabled
    public static Boolean checkPassword(String customerId, String password){
        ICICI_Bank_Customer_Details__c[] bankDetails = [
            SELECT Enter_Password__c
            FROM ICICI_Bank_Customer_Details__c
            WHERE Customer_Id__c = :customerId
            LIMIT 1
        ];
            if (bankDetails.isEmpty()) {
            return false;
        }
        return bankDetails[0].Enter_Password__c == password;    
    }

    @AuraEnabled
    public static Boolean checkAccountType(String customerId, String password , String selectedAccountType){
        ICICI_Bank_Customer_Details__c[] accountDetails = [
            SELECT Account_Type__c,Customer_Id__c
            FROM ICICI_Bank_Customer_Details__c
            WHERE Customer_Id__c =: customerId
            LIMIT 1
        ];
    
        if(String.valueof(accountDetails[0].Account_Type__c) == selectedAccountType){
            return true;
        }
        return false;  
        }    
    }

