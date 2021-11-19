// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  //   console.log(req.method);
  if (req.method === "POST") {
    const { body } = req;
    const { transaction_id, uhiPin } = body;
    if (uhiPin === "4559") {
      res.status(200).send({
        success: true,
        message: "Transaction Sucessfull",
        transaction_id,
      });
    } else {
      res.status(401).send({
        success: false,
        message: "Please Enter Correct UHI PIN",
        transaction_id,
      });
    }
  }
  res.status(404);
}
