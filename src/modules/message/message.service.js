import { NotFoundException, SYS_MESSAGE } from "../../common/index.js";
import { messageRepo } from "../../DB/models/message/message.repository.js";

export const createMessage = async (
  content,
  files,
  reciever,
  senderId = undefined,
) => {
  let paths = [];
  if (files) {
    paths = files.map((file) => {
      return file.path;
    });
  }
  return await messageRepo.create({
    content,
    attachment: paths,
    reciever,
    sender: senderId,
  });
};

export const getSpecificMessage = async (id, userId) => {
  const message = await messageRepo.getOne(
    { _id: id, $or: [{ sender: userId }, { reciever: userId }] },
    {},
    {
      populate: [
        {
          path: "reciever",
          select: " -password -email  -__v",
        },
        {
          path: "sender",
          select: " -password -email  -__v",
        },
      ],
    },
  );
  if (!message) {
    throw new NotFoundException(SYS_MESSAGE.message.notFound);
  }
  return message;
};

export const getAllMessages = async (userId) => {
 const message =  await messageRepo.find(
    {
      $or: [{ sender: userId }, { reciever: userId }],
    },
    {},
    {
      populate: [
        {
          path: "sender",
          select: " -password -email  -__v",
        },
        {
          path: "reciever",
          select: " -password -email  -__v",
        },
      ],
    },
  );
  if (!message || message.length === 0) {
    throw new NotFoundException(SYS_MESSAGE.message.notFound);
  }
  return message;
};
