import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  if (req.method === "DELETE") {
    //get ids from url
    const roomId = req.query.roomId;
    const messageId = req.query.messageId;

    //check token
    const user = checkToken(req);
    const rooms = readChatRoomsDB();
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }

    //check if roomId exist
    const indexRoom = rooms.findIndex((x) => x.roomId === roomId);
    if (indexRoom === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });

    //check if messageId exist
    const indexMessage = rooms[indexRoom].messages.findIndex(
      (x) => x.messageId === messageId
    );
    if (indexMessage === -1)
      return res.status(404).json({ ok: false, message: "Invalid message id" });

    //check if token owner is admin, they can delete any message
    if (user.isAdmin === true) {
      rooms[indexRoom].messages.splice(indexMessage, 1);
      writeChatRoomsDB(rooms);
      return res.status(200).json({ ok: true });
    }
    //or if token owner is normal user, they can only delete their own message!
    if (user.isAdmin === false) {
      if (rooms[indexRoom].messages[indexMessage].username === user.username) {
        rooms[indexRoom].messages.splice(indexMessage, 1);
        writeChatRoomsDB(rooms);
        return res.status(200).json({ ok: true });
      } else {
        return res.status(403).json({
          ok: false,
          message: "You do not have permission to access this data",
        });
      }
    }
  }
}
