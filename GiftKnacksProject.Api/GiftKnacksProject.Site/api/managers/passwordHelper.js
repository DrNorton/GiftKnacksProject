var crypto = require('crypto');
 
var PasswordHelper = function () {
    this.saltLength = 9;
};
 
PasswordHelper.prototype.createHash = function (password) {
  var salt = this.generateSalt(this.saltLength);
  var hash = this.md5(password + salt);
  return salt + hash;
}

 PasswordHelper.prototype.validateHash =function (hash, password) {
  var salt = hash.substr(0, this.saltLength);
  var validHash = salt + this.md5(password + salt);
  return hash === validHash;
}
 
PasswordHelper.prototype.generateSalt =function (len) {
  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
      setLen = set.length,
      salt = '';
  for (var i = 0; i < len; i++) {
    var p = Math.floor(Math.random() * setLen);
    salt += set[p];
  }
  return salt;
}
 
PasswordHelper.prototype.md5 =function (string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

exports.PasswordHelper = PasswordHelper;