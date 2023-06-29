import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CustomerDetails from '@salesforce/apex/ICICIBankAccount.getFields';
import BANK_IMAGE from '@salesforce/resourceUrl/Bank_Image123';
import ICICI_Bank_Customer_Details from '@salesforce/schema/ICICI_Bank_Customer_Details__c';
import Address from '@salesforce/schema/ICICI_Bank_Customer_Details__c.Address__c';
import ICICI_Bank_Customer from '@salesforce/schema/ICICI_Bank_Customer_Details__c.Name';
import Name from '@salesforce/schema/ICICI_Bank_Customer_Details__c.Name__c';
import Email from '@salesforce/schema/ICICI_Bank_Customer_Details__c.Email__c';
import BirthDate from '@salesforce/schema/ICICI_Bank_Customer_Details__c.BirthDate__c';
import Mobile from '@salesforce/schema/ICICI_Bank_Customer_Details__c.Contact_Number__c';
import Enter_Password from '@salesforce/schema/ICICI_Bank_Customer_Details__c.Enter_Password__c';
import Confirm_Password from '@salesforce/schema/ICICI_Bank_Customer_Details__c.Confirm_Password__c';
import Account_Type from '@salesforce/schema/ICICI_Bank_Customer_Details__c.Account_Type__c';

const accountTypeOptions = [
  { label: 'Saving Account', value: 'Saving' },
  { label: 'Salary Account', value: 'Salary' }
];

export default class ICICIBank extends LightningElement {
  @track showMyNewForm = false;
  @track showForm = false;
  @track showAccountType = false;
  @track showRecordPage = false;
  @track showImages = true;
  @track customer_Id;
  @track password;
  @track errorMsg = '';
  @track myButtons = true;

  bankImageUrl = BANK_IMAGE;

  objectApiName = ICICI_Bank_Customer_Details;
  fields = [
    ICICI_Bank_Customer,
    Name,
    Email,
    BirthDate,
    Mobile,
    Address,
    Account_Type,
    Enter_Password,
    Confirm_Password
  ];

  handleAccountTypeChange(event) {
    this.showForm = true;
    this.myButtons = false;
  }

  get accountTypeOptions() {
    return accountTypeOptions;
  }

  handleCreate() {
    this.showMyNewForm = true;
    this.showImages = false;
    this.myButtons = false;
    this.showAccountType = false;
  }

  handleLogin() {
    this.showAccountType = true;
    this.showForm = false;
    this.showImages = false;
    this.myButtons = false;
  }

  handleInputChange(event) {
    if (event.target.name === 'customer_Id') {
      this.customer_Id = event.target.value;
    }  
    if (event.target.name === 'password') {
      this.password = event.target.value;
    }
  }
  handleLoginFormSubmit(event) {
    event.preventDefault();
    const customerId = this.customer_Id;
    const password = this.password;
    console.log('customerId = '+customerId);
    console.log('Password = '+password);

    if (customerId && password) {
      this.showDetailPage(customerId, password);
    } else {
      this.showErrorToast('Please enter both Customer ID and Password.');
    }
  }
  showDetailPage(customerId, password) {
    CustomerDetails({ customerId: customerId, password: password })
      .then(result => {
        console.log('Result = ' + result);
        if (result === true) {
          this.errorMsg = '';
          this.showAccountType = false;
          this.showForm = false;
        } else {
          this.showErrorToast('Invalid Login ID or Password.');
        }
      })
      .catch(error => {
        console.log('Error on record deletion: ' + error.message);
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
