import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFields from '@salesforce/apex/ICICIBankAccount.getFields';
import checkPassword from '@salesforce/apex/ICICIBankAccount.checkPassword';
import checkAccountType from '@salesforce/apex/ICICIBankAccount.checkAccountType';
import BANK_IMAGE from '@salesforce/resourceUrl/Bank_Image123';
import ICICI_Bank_Customer_Details from '@salesforce/schema/ICICI_Bank_Customer_Details__c';
import Name from '@salesforce/schema/ICICI_Bank_Customer_Details__c.Name__c';
import Email from '@salesforce/schema/ICICI_Bank_Customer_Details__c.Email__c';
import BirthDate from '@salesforce/schema/ICICI_Bank_Customer_Details__c.BirthDate__c';
import Mobile from '@salesforce/schema/ICICI_Bank_Customer_Details__c.Contact_Number__c';
import Address from '@salesforce/schema/ICICI_Bank_Customer_Details__c.Address__c';
import Account_Type from '@salesforce/schema/ICICI_Bank_Customer_Details__c.Account_Type__c';
import Enter_Password from '@salesforce/schema/ICICI_Bank_Customer_Details__c.Enter_Password__c';
import Confirm_Password from '@salesforce/schema/ICICI_Bank_Customer_Details__c.Confirm_Password__c';
const accountTypeOptions = [
    { label: 'Saving Account', value: 'Saving Account' },
    { label: 'Salary Account', value: 'Salary Account' }
];

export default class ICICIBank extends LightningElement {
    @track showWelcomeCard = true;
    @track showMyNewForm = false;
    @track showForm = false;
    @track showAccountType = false;
    @track showDetailPageTable = false;
    @track showImages = true;
    @track customerId;
    @track password;
    @track customerData = [];
    @track selectedAccountType;
    bankImageUrl = BANK_IMAGE;
    objectApiName = ICICI_Bank_Customer_Details;
    fields = [
      Name,
      Email,
      BirthDate,
      Mobile,
      Address,
      Account_Type,
      Enter_Password,
      Confirm_Password
    ];
    accountTypeOptions = accountTypeOptions;

    handleAccountTypeChange(event) {
        this.selectedAccountType = event.detail.value;
        this.showForm = true;
        this.showWelcomeCard = false;
    }

    handleCreate() {
        this.showMyNewForm = true;
        this.showImages = false;
        this.showWelcomeCard = false;
    }

    handleLogin() {
        this.showAccountType = true;
        this.showForm = false;
        this.showImages = false;
        this.showWelcomeCard = false;
    }

    handleInputChange(event) {
        if (event.target.name === 'customer_id') {
            this.customerId = event.target.value;
        }
        if (event.target.name === 'password') {
            this.password = event.target.value;
        }
    }

    async handleLoginFormSubmit(event) {
        event.preventDefault();
        let customerId = this.customerId;
        let password = this.password;
        let selectedAccountType = this.selectedAccountType;

        if (customerId && password) {
           if(await this.checkPassword(customerId, password))
           {
                if(await this.showDetailPage(customerId, password, selectedAccountType))
                {
                    await this.getFields(customerId);
                }
                else{
                    this.showErrorToast('Please enter correct Account Type');
                }
           }
           else{
            this.showErrorToast('Please enter a valid Id or Password.');
           }
          
            
        } else {
            this.showErrorToast('Please enter both Customer ID and Password.');
        }
    }

    showDetailPage(customerId, password, selectedAccountType){
        return new Promise((resolve, reject) => {
            checkAccountType({ customerId : customerId,password : password,selectedAccountType : selectedAccountType })
            .then(result => {
                resolve(result);
                console.log('Result',JSON.stringify(result));   
            })
            .catch(error => {
              reject(null);
             const evt = new ShowToastEvent({
                title: 'Error',
                message: error.message,
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
            window.console.log("error ===> " + JSON.stringify(error));
            })
        });  
      }

      checkPassword(customerId, password){
        return new Promise((resolve, reject) => {
            checkPassword({ customerId : customerId,password : password})
            .then(result => {
                resolve(result);
                console.log('Result',JSON.stringify(result));   
            })
            .catch(error => {
              reject(null);
             const evt = new ShowToastEvent({
                title: 'Error',
                message: error.message,
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
            window.console.log("error ===> " + JSON.stringify(error));
            })
        });  
      }

      getFields(customerId){
        return new Promise((resolve, reject) => {
            getFields({ customerId : customerId})
            .then(result => {
                resolve(result);
                console.log('Result',JSON.stringify(result));   
                this.customerData = result;
                this.showAccountType = false;
                this.showForm = false;
                this.showDetailPageTable = true;
            })
            .catch(error => {
              reject(null);
             const evt = new ShowToastEvent({
                title: 'Error',
                message: error.message,
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
            window.console.log("error ===> " + JSON.stringify(error));
            })
        });  
      }
      
    showErrorToast(message) {
        const event = new ShowToastEvent({
            title: 'Error',
            message: message,
            variant: 'error'
        });
        this.dispatchEvent(event);
    }
}
