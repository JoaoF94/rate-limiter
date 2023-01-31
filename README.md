## Implemented Solution

* The main module for the challenge lives under `src/rateLimiter`.


* The remaining folders (controllers, routes) are just to exemplify how a rest API could use the developed rate limiter.
  * Unit tests were only developed for code inside `src/rateLimiter`


* The algorithm used for the rate limiter is a counter of tokens for each user. 
  * Together with the counter, it's also saved the timestamp where the user got the first token. 
    * This allows the rate limiter to know when it is ok to reset the token count.


* Implemented a `rateLimit` decorator that can be added into any class method (as it's possible to see in the `controllers/RequestsController`)
  * The goal was to be easy to reuse if for example we wanted to extend our API or create new ones.
    * And also without any code changes in the controller's logic as well

### Some notes and/or caveats
* The rate limiter service is using an in-memory map, with a singleton pattern to store the tokens and timestamps.

  * So if we refresh the server or restart it, the tokens will be resetted.
    * An alternative was to use `Redis` or some DB to store the tokens, keeping them persistent.
    * I tried to leave the code ready so that is easy to add this new persistence layer (separation between persistence/business layer could also be improved while adding a second persistence type).


* The rate limiter is keeping track of the tokens by user

  * For simplicity sake, if we want to test with another user, let's assume that the request will contain a `username` header. 
    * The value on the header will be used as the map's key.


* To change the number of tokens and time of each window, just edit `.env`file.
  * By default we have ``100 tokens`` and ``60 minutes`` as requested

## How to run?

* Run `npm run dev` in the root.
  * This will start a server listening by default in port 6060
* Issue a GET request against `http://localhost:6060/requests`
  * This should return an object with the following format

    ```json
    {
      tokens: 99 // number of tokens still available
      timeMissing: 3599 // seconds until the token count resets
    }
    ```
  * More requests will decrease the tokens amount. 
    * After all of them are used, you should see a message stating the number of seconds until the tokens count reset.

## Run unit tests
Only developed for the ``src/rateLimiter`` module
````
npm run test
````
