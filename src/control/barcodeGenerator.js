import bwipjs from "bwip-js";
import fs from "fs";

function generateBarcode(code, outputPath) {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer(
      {
        bcid: "code128",
        text: code,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
      },
      (err, png) => {
        if (err) {
          return reject(err);
        }
        fs.writeFile(outputPath, png, (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      }
    );
  });
}

export default generateBarcode;
