import QRCode from "qrcode";
import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import "../QR/qrGen.css";
import axios from "axios";

function QRgenerator() {
  const [url, setUrl] = useState("");
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.post("/api/users/qrgen").then((response) => {
      setUrl(response.data.email);
      console.log(response.data);

      setLoading(false);
    });
  }, "");

  const GenerateQRCode = () => {
    QRCode.toDataURL(
      url,
      {
        width: 400,
        margin: 2,
        color: {
          dark: "#335383FF",
          light: "#EEEEEEFF",
        },
      },
      (err, url) => {
        if (err) return console.error(err);

        console.log(url);
        setQr(url);
      }
    );
  };

  return (
    <div className="app">
      {loading && <Loading />}
      <div className="headerQr">
        <h1>QR Generator</h1>
      </div>
      <hr className="hr" />
      <div className="main1">
        <input
          className="qrInput"
          type="text"
          placeholder="아이디 입력(email)"
          value={url}
          disabled
        />
        <button className="btnGen" onClick={GenerateQRCode}>
          Generate
        </button>
        {qr && (
          <>
            <img src={qr} />
            <a className="btnGen" href={qr} download="qrcode.png">
              Download
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default QRgenerator;
