import React from "react";
import { create } from "react-test-renderer";
import DropzoneContainer from "./dropzoneContainer";

describe("Dropzone container component", () => {
  test("onDocumentFileChange should update the documents state", () => {
    const component = create(<DropzoneContainer />);
    const instance = component.getInstance();
    instance.onDocumentFileChange("dummy base64 data", "abc.pdf");
    expect(instance.state.documents.length).toBe(1);
    expect(instance.state.documents[0].name).toBe("abc.pdf");
    expect(instance.state.documentId).toBe(1);
  });
});
