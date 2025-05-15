import { Client, Account, Databases } from 'appwrite';

const appwrite = new Client();

appwrite
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6811f9090020cdcb835a');

export const account = new Account(appwrite);
export const databases = new Databases(appwrite);