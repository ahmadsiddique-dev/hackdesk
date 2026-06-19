# TODO: the things to be fixed
> You can search "TODO:" and "FIX:" to do some fixes

## Application Fixes
- Make another Mail component to send while user(customer) is signing up or logning in at hc
- Sepreate the summary, rootcase and solution suggestion from ticket submission creation beacuse it delays.
- Fix scroll behaviour in chat window that takes us down chat every time
- Make sure after converting into embedings and storing in db every company and its users access theri own data.

## Problems with Schemas
> I've wrote "TODO:" and "FIX:" in modesl that you can see and fix

## Very huge problem in Auth
- First of all if have time then seprate auth for agent and user
- If you don't have much time then there is just one problem with 
auth that when we /refresh then it checks accessToken and decides
wether user will keep logged in or he will be logged out instead 
of going further and checking for "refreshToken as well".