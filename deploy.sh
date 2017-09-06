#First go to master and update branch
git checkout master
git pull origin master
# Minify Meteor bundle, ui functions and tokkoapi
# Require babel minify --> npm install babel-minify -g
minify scripts/meteor-client.bundle.js -d scripts/
minify scripts/uiFunctions.js -d scripts/
minify index.js -d ./
# Minify css
uglifycss css/bootstrap.css --output css/bootstrap.css
uglifycss css/icons.css --output css/icons.css
uglifycss css/style.css --output css/style.css
uglifycss css/colors/duit.css --output css/colors/duit.css
#commit and push
git add -u
git commit -m 'Minification and deploy'
git push origin master
now -d