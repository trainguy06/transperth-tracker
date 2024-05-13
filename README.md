# transperth-tracker
A very simple self-hostable site that slowly tracks trains currently scheduled on the Transperth network.

## How to Install
1. Download the files and pop them into a new folder located somewhere easily accessable via:
   - Command Prompt for Windows
     OR
   - Terminal for MacOS
2. ENSURE you have a version of Node installed on your computer. (I have tested with v18 and Higher)
3. Open the new folder you made in your terminal of choice and initiate the files:
   `npm init -y` (This creates your package.json instantly)
   `npm i express node-cron puppeteer` (This will install the dependencies required to run the server)
   `node .` (This runs the server)

Any issues can be reported via the Issues section on GitHub, or you can add my Discord and ask me further questions: `@.trainguy`.

## I want to change some things in your code.
Feel free. It's a very simple template and could be built upon further. Some simple things you may want to change is how often the site will get data from the Transperth Website. Maybe you might want to track different lines instead of just the Mandurah and Joondalup Line.
