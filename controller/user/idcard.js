const { upload } = require("../../middleware/uploads");
const { User3 } = require("../../models/User2");
const { User } = require("../../models/User");
const e = require("express");

module.exports = {
  post: async (req, res) => {
    try {
      //업로드한 이미지 multer를 통해서 이미지 파일이 여기로 옴
      // aws에 업로드 할 것임
      //이미지가 저장된 aws url 주소를 반환하도록 할 것임
      // let user1;
      let token = req.cookies.x_auth;
      const vcObj = {};
      vcObj["last_name"] = req.body.name.slice(0, 1);
      vcObj["first_name"] = req.body.name.slice(1);
      vcObj["Identification_Number"] = req.body.id;
      vcObj["address"] = req.body.address;
      vcObj["age"] = req.body.age;

      await User.findByToken(token, async (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ message: "토큰이 만료되었습니다." });
        if (user) {
          const user3 = new User3({ ...req.body, email: user.email });
          await user3.save();
          let [
            proverWallet,
            userDid,
            userVerkey,
            credential,
            revId,
            revRegDelta,
            credId,
          ] = await indy.credentials.CreateCredentialProcess(
            user.email,
            user.password,
            vcObj
          );
          console.log(
            "Create new user account",
            await sdk.listMyDidsWithMeta(proverWallet)
          );
          console.log(
            "userDid: ",
            userDid,
            "userVerkey: ",
            userVerkey,
            "credential :",
            credential,
            "revId: ",
            revId,
            "revRegDelta: ",
            revRegDelta,
            "credId: ",
            credId
          );

          await sdk.closeWallet(proverWallet);
        }
        return res.status(200).json({ success: true });
      });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ success: false });
    }
  },

  get: async (req, res) => {
    try {
      let token = req.cookies.x_auth;
      await User.findByToken(token, async (err, user) => {
        if (user) {
          let userInfo = await User3.findOne({ email: user.email });
          if (!userInfo) {
            return res.status(400).json({ success: false });
          } else {
            console.log(JSON.stringify(userInfo));
            return res.status(200).json({
              success: true,
              userInfo: userInfo,
            });
          }
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ success: false });
    }
  },
};
