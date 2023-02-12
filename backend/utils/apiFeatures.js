class APIFeatures {
  /**
   * Constructor function that creates an object with a 'query' and 'queryStr' property.
   *
   * @param {Object} query - The query object.
   * @param {String} queryStr - The query string.
   */
  constructor(query, queryStr) {
    // Set the 'query' property to the provided query object.
    this.query = query;

    // Set the 'queryStr' property to the provided query string.
    this.queryStr = queryStr;
  }

  // Search based on keyword
  search() {
    // Check if the `keyword` field exists in the `queryStr` object
    // If it does, create a search object with a regular expression that matches the `keyword` in a case-insensitive manner
    // If it doesn't, create an empty search object
    // Use the `find` method on the `query` object to search based on the created search object
    this.query = this.query.find(
      this.queryStr.keyword
        ? { name: { $regex: this.queryStr.keyword, $options: "i" } } // i = case-insensitive
        : {}
    );
    // Return `this` to allow chaining of methods
    return this;
  }

  /**
   * The `filter` method is used to add filters to a MongoDB collection query.
   * It uses destructuring assignment to remove the `keyword`, `limit`, and `page` fields from the `queryStr` object.
   * It then creates a string representation of the filtered object using `JSON.stringify`,
   * replaces instances of `gt`, `gte`, `lt`, and `lte` in the string representation with `$gt`, `$gte`, `$lt`, and `$lte` respectively,
   * parses the modified string representation back into an object using `JSON.parse`,
   * and uses the `find` method on the `query` object to filter based on the parsed object.
   *
   * @returns {object} The current object to allow chaining of methods.
   */
  filter() {
    const { keyword, limit, page, ...queryCopy } = this.queryStr;
    this.query = this.query.find(
      JSON.parse(
        JSON.stringify(queryCopy).replace(
          /\b(gt|gte|lt|lte)\b/g,
          (match) => `$${match}`
        )
      )
    );
    // Return `this` to allow chaining of methods
    return this;
  }

  /**
   * The pagination method is used to paginate the results of a MongoDB query.
   *
   * @param {number} resPerPage - The number of results to display per page
   * @returns {object} - The current instance of the Query class to allow method chaining
   */
  pagination(resPerPage) {
    // Check if the `page` field exists in the `queryStr` object. If it does,
    // convert it to a number using `Number`. If it doesn't, set the `currentPage`
    // to `1`. If the `page` field is a negative number, also set `currentPage` to `1`.
    let currentPage = Number(this.queryStr.page) || 1;
    if (currentPage < 0) currentPage = 1;

    // Calculate the number of documents to skip by multiplying the `resPerPage` argument
    // by `currentPage - 1`.
    const skip = resPerPage * (currentPage - 1);

    // Use the `limit` and `skip` methods on the `query` object to paginate the results.
    this.query = this.query.limit(resPerPage).skip(skip);

    // Return `this` to allow chaining of methods.
    return this;
  }
}

module.exports = APIFeatures;
