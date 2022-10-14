const { User3 } = require("../../models/User2");
const { User } = require("../../models/User");
const indy = require("../../indy/index");

module.exports = {
  //postman test용, 원래는 get요청
  post: async (req, res) => {
    try {
      let walletName = req.body.username;
      let walletKey = req.body.password;

      let proverWallet = await indy.wallet.get(walletName, walletKey);
      let encryptedMessage = await indy.proofs.ProverSubmitPresentation(proverWallet);

      if (encryptedMessage) {
        return res.status(200).json({
          encryptedMessage
        })
      } else {
       return res.status(400).json({
         result: "InvalidProcess"
        })
     }
    } catch (err) {
      console.log(err)
    }
  },
  get: async (req, res) => {
    try {
      let currentUser;
      let token = req.cookies.x_auth;
      User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ message: "토큰이 만료되었습니다." });
        if (user) {
          currentUser = user;
        }
      })
      let proverWallet = await indy.wallet.get(currentUser.email, currentUser.password)
      let proofMessage = await indy.proofs.acceptProofReq(proverWallet)
      console.log("qr에 들어갈 증명내용 :", proofMessage)
    } catch (err) {
      console.log(err)
    }
  }
}