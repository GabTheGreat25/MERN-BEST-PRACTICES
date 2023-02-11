class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
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
        ? { name: { $regex: this.queryStr.keyword, $options: "i" } }
        : {}
    );
    // Return `this` to allow chaining of methods
    return this;
  }

  // Filter by other parameters
  filter() {
    // Use destructuring assignment to remove the `keyword`, `limit`, and `page` fields from the `queryStr` object
    const { keyword, limit, page, ...queryCopy } = this.queryStr;
    // Create a string representation of the filtered object using `JSON.stringify`
    // Replace instances of `gt`, `gte`, `lt`, and `lte` in the string representation with `$gt`, `$gte`, `$lt`, and `$lte` respectively
    // Parse the modified string representation back into an object using `JSON.parse`
    // Use the `find` method on the `query` object to filter based on the parsed object
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

  // Paginate the results
  pagination(resPerPage) {
    // Check if the `page` field exists in the `queryStr` object
    // If it does, convert it to a number using `Number`
    // If it doesn't, set the `currentPage` to `1`
    const currentPage = Number(this.queryStr.page) || 1;
    // Calculate the number of documents to skip by multiplying the `resPerPage` argument by `currentPage - 1`
    const skip = resPerPage * (currentPage - 1);
    // Use the `limit` and `skip` methods on the `query` object to paginate the results
    this.query = this.query.limit(resPerPage).skip(skip);
    // Return `this` to allow chaining of methods
    return this;
  }
}

module.exports = APIFeatures;
