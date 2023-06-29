public with sharing class ICICIBankAccount {
    @AuraEnabled
    public static Boolean getFields(String customerId, String password) {
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
}
