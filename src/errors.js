class Error404 extends Error {
  message() {
    return "Law Bomb Not Found";
  }

  statusCode() {
    return 404;
  }
}

module.exports = {
  Error404
};
