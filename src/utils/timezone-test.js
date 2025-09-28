// Test timezone functions

import { getWIBTimestamp, getWIBTimestampISO } from './timezone.js';

console.log('=== TIMEZONE TEST ===');
console.log('Current time (system):', new Date().toISOString());
console.log('WIB Simple:', getWIBTimestamp());
console.log('WIB ISO:', getWIBTimestampISO());

// What you're getting now (WRONG - UTC time):
const wrongWay = new Date().toISOString();
console.log('Wrong (UTC):', wrongWay);

// What you should get (RIGHT - WIB time):  
const rightWay = getWIBTimestamp();
console.log('Right (WIB):', rightWay);

console.log('=== EXPLANATION ===');
console.log('UTC time ends with Z (Zulu/UTC timezone)');
console.log('WIB time should end with +07:00 (GMT+7)');
console.log('Your timestamp should show WIB time, not UTC time!');