app.service('tokkoApi',function(){const i={key:'f26431aec0277d4e7912e2709af35707fb9362e6',lang:'es_ar'},b=function(a,b){let c=new XMLHttpRequest;c.onreadystatechange=function(){4==c.readyState&&200==c.status&&b(c.responseText)},c.open('GET',a,!0),c.send(null)};return{find:function(c,d,g){let e='http://tokkobroker.com/api/v1/'+c+'/?format=json&';if('object'==typeof d)for(let a in d)e+=a+'='+d[a]+'&';else e+='id='+d+'&';b(e+'key='+i.key+'&lang='+i.lang,function(b){'property/get_search_summary'===c?g(JSON.parse(b)):g(JSON.parse(b).objects)})},findOne:function(a,b,c){this.find(a,b,function(b){c(b[0])})},insert:function(e,f,g){let a=new XMLHttpRequest,b='http://tokkobroker.com/api/v1/'+e+'/?key='+i.key,c=JSON.stringify(f);a.open('POST',b,!0),a.setRequestHeader('Content-type','application/json'),a.onreadystatechange=function(){4==a.readyState&&(200==a.status||201==a.status)?g({result:'success',status:a.status}):g({result:'error',status:a.status,result:a.responseText})},a.send(c)}}});