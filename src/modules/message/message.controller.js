import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
import { createMessage, getAllMessages, getSpecificMessage } from "./message.service.js";
import { fileUpload, SYS_MESSAGE } from "../../common/index.js";

const router = Router();

router.post("/:recieverId", isAuthenticated,fileUpload().array("attachment",2), async (req, res, next) => {
  const { content } = req.body;
  // const {sender} = req.user._id;
  const { recieverId } = req.params;
  const files = req.files ; 
  const createdMessage = await createMessage( content,files,recieverId,req.user._id);
  return res
    .status(201)
    .json({
      message: SYS_MESSAGE.message.createdSuccessfully,
      success:true,
      data: createdMessage,
    });
});

router.get("/:id", isAuthenticated,async(req,res,next) => {
  const {id} = req.params;
  const message = await getSpecificMessage(id,req.user._id);
  return res.status(200).json({
    message: "done",
    success:true,
    data: message
  })
})


router.get("/", isAuthenticated,async(req,res,next) => {
  const message = await getAllMessages(req.user._id);
  return res.status(200).json({
    message: "done",
    success:true,
    data: message
  })
})
export default router;
