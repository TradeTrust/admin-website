module.exports = {
  exportPathMap: function exportMap() {
    return {
      "/": { page: "/" },
      "/deploy": { page: "/deploy" },
      "/generate-document": { page: "/generate-document" }
    };
  },
  assetPrefix: ""
};
