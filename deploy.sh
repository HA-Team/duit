#First go to master and update branch
git checkout master
git pull origin master
#Minify Meteor bundle, ui functions and tokkoapi
uglifyjs scripts/meteor-client.bundle.js -o scripts/meteor-client.bundle.js
uglifyjs scripts/uiFunctions.js -o scripts/uiFunctions.js
uglifyjs scripts/tokkoApi.js -o scripts/tokkoApi.js
#commit and push
git add -u
git commit -m 'Minification and deploy'
git push origin master