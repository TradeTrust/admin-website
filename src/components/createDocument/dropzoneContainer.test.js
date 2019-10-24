import React from "react";
import { create } from "react-test-renderer";
import DropzoneContainer from "./dropzoneContainer";
import { SHARE_LINK_API_URL } from "../../config";

describe("Dropzone container component", () => {
  test("onDocumentFileChange should update the documents state", () => {
    const component = create(<DropzoneContainer />);
    const instance = component.getInstance();

    instance.createDocument();
    expect(instance.state.documents.length).toBe(1);
    expect(instance.state.documents[0].title).toBe("Untitled-1");

    instance.onDocumentFileChange(
      "base64 string",
      "abc.pdf",
      instance.state.documents[0].id
    );
    expect(instance.state.documents[0].attachments.length).toBe(1);
    expect(instance.state.documents[0].attachments[0].filename).toBe("abc.pdf");

    instance.onEditTitle(instance.state.documents[0].id);
    expect(instance.state.editableDoc).toBe(instance.state.documents[0].id);

    const response = instance.generateBaseDoc("demo", {
      key: "abc",
      queueNumber: 123
    });
    const url = encodeURIComponent(
      JSON.stringify({
        uri: `${SHARE_LINK_API_URL}/get/123#abc`
      })
    );
    expect(response.documentUrl).toStrictEqual(`tradetrust://${url}`);
  });
});
