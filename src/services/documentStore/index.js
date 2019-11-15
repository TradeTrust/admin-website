import "isomorphic-fetch";
import { SHARE_LINK_API_URL } from "../../config";

export function updateDocument(document, id) {
  return window
    .fetch(`${SHARE_LINK_API_URL}/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        document
      })
    })
    .then(res => res.json());
}

export function getDocumentQueueNumber() {
  return window
    .fetch(`${SHARE_LINK_API_URL}/queue`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json());
}
