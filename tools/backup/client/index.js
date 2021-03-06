const homedir = require('os').homedir();
const settings = `${homedir}/.local/lib/bkpCli/settings.json`
const KEY = `${homedir}/.local/lib/bkpCli/PUB.key`



const NodeRSA = require('node-rsa');
const fs = require('fs');
const { exit } = require('process');
const bcrypt = require('bcrypt');
const http = require('http')
let file = process.argv[2].replace(/^.*[\\\/]/, '')
let dir = process.argv[3]
function fend() {
    exit();
}
fs.readFile(KEY, 'utf8', function (err, key) {
    const RSAkey=new NodeRSA(key)
    fs.readFile(settings, 'utf8', function (err, settR) {
        if (err) console.log("err", err)
        let set = JSON.parse(settR)
        fs.readFile(dir, 'utf8', function (err, data) {
            if (err) console.log("err", err)
            let url = `${set.server}`
            console.log(url)
            let rdata = new Map;
            rdata.body = data
            rdata.filename = file
            bcrypt.hash(set.pass, 12, function (err, data) {
                rdata.auth = data

                jsond = JSON.stringify(rdata);
                let encrypted=RSAkey.encrypt(jsond,'base64')
                options = {
                    host: url,
                    port: set.port,
                    json: false,
                    method: 'POST',
                    href: '',
                    pathname: '/'
                };
                var req = http.request(options, function (res) {
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        console.log("Odpowiedź serwera: " + chunk);
                    });
                });
                req.write(encrypted);
                req.end();

            })
            /*    request(options, (err, res) => {
                  if (err) { return console.log(err); }
                  console.log(res.body,"zakończono przesyłać");
                  setTimeout(fend, 2000);
                }); */
        });
    });

});