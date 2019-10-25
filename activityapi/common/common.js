
class Common {
    static GetIp(req) {
        if (req.ip) return req.ip;
        let ipaddress = '8.8.8.8';
        let xff = req.headers['x-forwarded-for'];
        if (xff) {
            let ipflag = xff.split(',')[0].trim()
            if (ipflag) ipaddress = ipflag;
        }
        return ipaddress;
    }

    static NumSerialCode(codeLength = 4) {
        let code = "";
        let selectChar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let charIndex = 0;
        for (var i = 0; i < codeLength; i++) {
            charIndex = Math.floor(Math.random() * 10);
            code += selectChar[charIndex];
        }
        return code;
    }
}

exports = module.exports = Common;