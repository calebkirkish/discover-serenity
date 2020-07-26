### Summary(what does your code do or fix?)
Function to take to get State and County name based on latitude and longitude. 
​
NOTE: Summary should also include designed behavior for invalid inputs, i.e. lat not in -90.. 90, error with no results or API system error, corner cases like independent cities with only State without County, etc
​
### Testing(where and how can reviewer test your codes? Eye-debugging is not enough ^_^)
#### Test platform
e.g. Chrome on Mac
#### Test method
##### Unit tests
JS development(front-end or simple request/response methods) usually do not require unit testing, so omit here 
##### Integration Tests
open console and call `getCounty(47.487983, -121.723172);`
###### Expected result
Expected output in console:
`"Washington"`
`"King County"`
​
NOTE: general rule is to remove all the console.log() when submit a PR but since we are doing a student homework, not very import. One suggestion is create a div to print out the result in HTML and later we can delete it. 
##### End-to-End tests
How can we run your code? For this bootcamp, mainly is open the webpage and look at the expected result. So for HTML files, we can put a screenshot. End-to-end test is really mocking how user would use this, not all PR has end-to-end tests cuz it may be internal functionality rather than user facing.
But in real work, sometimes we have a separate application written just to run the code you finish, provide how to setup and run your code.
​
Here is a short reading on testing
https://medium.com/@lawrey/unit-tests-ui-tests-integration-tests-end-to-end-tests-c0d98e0218a6

### Please attach this PR to an open issue or create an issue if one does not exist
