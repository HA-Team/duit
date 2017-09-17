#First go to master and update branch
echo 'Checking out to Master and pulling changes...'
git checkout master
git pull origin master
# Minify Meteor bundle, ui functions and tokkoapi
# Require babel minify --> npm install babel-minify -g
echo 'Minifying css and js files...'
minify scripts/meteor-client.bundle.js -d scripts/
minify scripts/uiFunctions.js -d scripts/
minify scripts/tokkoApi.js -d scripts/
# Minify css
uglifycss css/bootstrap.css --output css/bootstrap.css
uglifycss css/icons.css --output css/icons.css
uglifycss css/style.css --output css/style.css
uglifycss css/colors/duit.css --output css/colors/duit.css
#commit and push
git add -u
echo 'Commiting changes...'
git commit -m 'Minification and deploy'
echo 'Pushing changes...'
git push origin master
echo 'Deploying app with meteor now...'
meteor-now -e MONGO_URL=mongodb://ofqwx:Mas26vision*@ds121464.mlab.com:21464/duit -e ROOT_URL=https://demo.duitpropiedades.com.ar -e NODE_ENV=production
echo 'Deployed, remember to create alias with "now alias [deployed_url] https://demo.duitpropiedades.com.ar"'