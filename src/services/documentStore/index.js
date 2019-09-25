import "isomorphic-fetch";
import { SHARE_LINK_API_URL, SHARE_LINK_TTL } from "../../config";

export function updateDocument(document) {
  return window
    .fetch(`${SHARE_LINK_API_URL}/update`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ttl: SHARE_LINK_TTL,
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
