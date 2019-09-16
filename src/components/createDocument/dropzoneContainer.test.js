import React from "react";
import { create } from "react-test-renderer";
import DropzoneContainer from "./dropzoneContainer";

describe("Dropzone container component", () => {
  test("onDocumentFileChange should update the documents state", () => {
    const component = create(<DropzoneContainer />);
    const instance = component.getInstance();

    instance.createDocument();
    expect(instance.state.documents.length).toBe(1);
    expect(instance.state.documents[0].title).toBe("Untitled");

    instance.onDocumentFileChange(
      "base64 string",
      "abc.pdf",
      instance.state.documents[0].id
    );
    expect(instance.state.documents[0].attachments.length).toBe(1);
    expect(instance.state.documents[0].attachments[0].filename).toBe("abc.pdf");

    instance.onEditTitle(instance.state.documents[0].id);
    expect(instance.state.editableDoc).toBe(instance.state.documents[0].id);
  });
});
