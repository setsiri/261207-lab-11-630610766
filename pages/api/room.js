import { checkToken } from "../../backendLibs/checkToken";
import { readChatRoomsDB } from "../../backendLibs/dbLib";

export default function roomRoute(req, res) {
  if (req.medthod === "GET") {
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }
  }

  const chatrooms = readChatRoomsDB();

  //create room data and return response
  const roomData = chatrooms.map((x) => {
    return { roomId: x.roomId, roomName: x.roomName };
  });
  return res.status(200).json({ ok: true, rooms: roomData });
}
