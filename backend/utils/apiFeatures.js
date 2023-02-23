class APIFeatures {
  /**
   * Constructor function that creates a new instance of the Query class, which includes a 'query' and 'queryStr' property.
   * @param {Object} query - The MongoDB query object used to filter data.
   * @param {String} queryStr - The query string used to search and filter data.
   * @example
   * const query = new Query(User.find(), req.query);
   * creates a new instance of the Query class with a MongoDB query object and query string obtained from an HTTP request.
   */
  constructor(query, queryStr) {
    // Set the 'query' property to the provided query object.
    this.query = query;
    // Set the 'queryStr' property to the provided query string.
    this.queryStr = queryStr;
  }

  /**
   * The `search` method is used to search a MongoDB collection based on a keyword.
   * It checks if the `keyword` field exists in the `queryStr` object, and if so,
   * creates a search object with a regular expression that matches the `keyword` in a
   * case-insensitive manner. If the `keyword` field does not exist, an empty search
   * object is created. The `find` method is then used on the `query` object to filter
   * based on the created search object.
   *
   * @returns {object} The current instance of the `APIFeatures` class to allow method chaining.
   *
   * @example
   * Search for products that contain the keyword "phone"
   * const products = await new APIFeatures(Product.find(), { keyword: "phone" })
   * .search()
   * .query;
   */
  search() {
    const keyword = this.queryStr.keyword
      ? { name: { $regex: this.queryStr.keyword, $options: "i" } }
      : {};

    let category = {};
    if (this.queryStr.category) {
      category = {
        category: { $regex: this.queryStr.category, $options: "i" },
      };
    }

    const search = { ...keyword, ...category };

    this.query = this.query.find(search);

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
   * @example
   * Create a new APIFeatures instance with a MongoDB query and query string
   * const features = new APIFeatures(MongoDBQuery, { minPrice: 100, maxPrice: 200 });
   *
   * Add a filter for documents where the `price` field is greater than or equal to `100` and less than or equal to `200`
   * features.filter();
   *
   * @returns {APIFeatures} The current object to allow chaining of methods.
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
   *
   * @example
   * Example usage:
   * const query = new Query(myCollection);
   * query
   *   .search()
   *   .filter()
   *   .pagination(10)
   *   .execute((err, results) => {
   *     if (err) throw err;
   *     console.log(results);
   *   });
   */
  pagination(resPerPage) {
    // Check if the `page` field exists in the `queryStr` object. If it does,
    // convert it to a number using `Number`. If it doesn't, set the `currentPage`
    // to `1`. If the `page` field is a negative number, also set `currentPage` to `1`.
    let currentPage = Number(this.queryStr.page);
    if (!currentPage || currentPage < 1) currentPage = 1;

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
