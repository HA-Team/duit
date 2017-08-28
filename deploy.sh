#First go to master and update branch
git checkout master
git pull origin master
# Minify Meteor bundle, ui functions and tokkoapi
# Require babel minify --> npm install babel-minify -g
minify scripts/meteor-client.bundle.js -d scripts/
minify scripts/uiFunctions.js -d scripts/
minify scripts/tokkoApi.js -d scripts/
#commit and push
git add -u
git commit -m 'Minification and deploy'
git push origin master