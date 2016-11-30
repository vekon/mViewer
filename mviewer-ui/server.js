const express = require('express');
const app = express();

app.use('/', express.static(__dirname +'/build'));


app.listen(3000, function(err)
{
     if (err) throw err;

     console.log('server is running on port 3000');
});
