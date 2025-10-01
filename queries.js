const { MongoClient } = require("mongodb");

// Connection URI and DB/collection names (match insert_books.js)
const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

// function to read from the database.
async function readBooks() {
  const client = new MongoClient(uri);

  try {
    // connect to mongoDB server
    await client.connect();
    console.log("Connected to MongoDB server");

    // get database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    //task 2
    // Find all books in the Fiction genre (note: values in insert_books.js use 'Fiction')
    console.log("\nBooks in the Fiction genre:");
    const cursor = collection.find({ genre: "Fiction" });
    const results = await cursor.toArray();

    if (results.length === 0) {
      console.log('No fiction books found.');
    } else {
      results.forEach((book, index) => {
        console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`);
      });
    }

    // books published after a certain year
    console.log("\nBooks published after 1949:");
    const yearCursor = collection.find({ published_year: {$gt : 1949} });
    const yearResults = await yearCursor.toArray();

    if (yearResults.length === 0) {
      console.log('No books published after 1949 found.');
    } else {
      yearResults.forEach((book, index) => {
        console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year}) costing ${book.price}`);
      });
    }

    //books by specific author
    console.log("\nBooks by J.R.R. Tolkien:");
    const authorCursor = collection.find({author: "J.R.R. Tolkien"});
    const authorResults = await authorCursor.toArray();

    if(authorResults.length === 0){
        console.log("No book by J.R.R. Tolkien");
    }else{
        authorResults.forEach((book, index) =>{
            console.log(`${index + 1}. "${book.title}" written by ${book.author}`);
        });
    }

    // Update price of a specific book
    console.log("\nUpdating price of 'The Catcher in the Rye'...");
    const updateResult = await collection.updateOne(
        { title: "The Catcher in the Rye" },  // filter
        { $set: { price: 11.99 } }            // update
    );

    if (updateResult.matchedCount === 0) {
        console.log("Book not found, no update made.");
    } else {
        console.log("Price updated successfully for 'The Catcher in the Rye'.");
    }

    //delete a book by its title
    await collection.deleteOne({title : "Wuthering Heights"});
    console.log("Deleted 'Wuthering Heights' successfully!")


    //task three - Advanced Queries
    //both in stock and buplished after 2010
    console.log("\nBooks both in stock and published after 2010");
    const stockCursor = collection.find(
        {$and:[
            {in_stock: true},
            {published_year: {$gt: 2010} }]
        }
    );
    const stockResult = await stockCursor.toArray();

    if(stockResult.length ===0){
        console.log("There is no book published after 2010 and in stock!");
    }else{
        stockResult.forEach((book, index) =>{
            console.log(`${index + 1}. "${book.title} published at ${book.published_year} in stock: ${book.in_stock}`);
        });
    }

    //using projection to return title, author and price
    const query = {}; 
    const queryCursor = collection.find(query, { projection: { title: 1, author: 1, price: 1, _id: 0 } });

    const queryResults = await queryCursor.toArray();
    console.log(queryResults);

    //sorting that displays books by price
    //ascending order
    console.log("\nBooks sorted by price (ascending):");
    const sortCursor = collection.find().sort({ price: 1 }); // 1 = ascending
    const sortResults = await sortCursor.toArray();

    sortResults.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} costs $${book.price}`);
    });


    //descending order
    console.log("\nBooks sorted by price in descending using aggregation:");
    const sortCursors = collection.aggregate([
        { $sort: { price: -1 } }  
    ]);
    const sortResultss = await sortCursors.toArray();

    sortResultss.forEach((book, index) => {
    console.log(`${index + 1}. "${book.title}" by ${book.author} costs $${book.price}`);
    });

    //Use the limit and skip methods to implement pagination (5 books per page)
    
    const page = 2; 
    const limit = 5;
    const skip = (page - 1) * limit;

    console.log(`\nBooks on page ${page}:`);

    const paginationCursor = collection.find(
      {}, // query all books
      { projection: { title: 1, author: 1, price: 1, _id: 0 } } 
    )
    .sort({ title: 1 })   
    .skip(skip)           
    .limit(limit);        

    const paginationResults = await paginationCursor.toArray();

    if (paginationResults.length === 0) {
        console.log("No books found on this page.");
    } else {
      paginationResults.forEach((book, index) => {
        console.log(`${skip + index + 1}. "${book.title}" by ${book.author} costs $${book.price}`);
      });
    }


    //Task 4 - Aggregation Pipeline
    //find average price of books by genre
    console.log("\nAverage price of books by genre:");

    const avgCursor = collection.aggregate([
      {
        $group: {
        _id: "$genre",                
        averagePrice: { $avg: "$price" } 
        }
    },
    {
        $project: {
        _id: 0,                         
        genre: "$_id",                  
        averagePrice: { $round: ["$averagePrice", 2] } 
        }
    }
    ]);

    const avgResults = await avgCursor.toArray();

    if (avgResults.length === 0) {
        console.log("No data available to calculate averages.");
    } else {
      avgResults.forEach((genreData, index) => {
        console.log(`${index + 1}. Genre: ${genreData.genre} → Average Price: $${genreData.averagePrice}`);
    });
    }

    //find author with the most books
    console.log("\nAuthor with the most books:");

    const athurCursor = collection.aggregate([
      {
        $group: {
        _id: "$author",         
        totalBooks: { $sum: 1 } 
        }
    },
    {
        $sort: { totalBooks: -1 } 
    },
    {
        $limit: 1                 
    },
    {
        $project: {
        _id: 0,
        author: "$_id",
        totalBooks: 1
        }
    }
    ]);

    const athurResults = await athurCursor.toArray();

    if (athurResults.length === 0) {
        console.log("No authors found in the collection.");
    } else {
        console.log(`"${athurResults[0].author}" has the most books: ${athurResults[0].totalBooks}`);
    }

    //group books bu publication decade and count them
    console.log("Number of books per publication decade");

    const decadeCursor = collection.aggregate([
        {
          $project: {
            decade: {
            $multiply: [
             { $floor: { $divide: ["$published_year", 10] } }, // divide year by 10, floor it
            10                                                // multiply back → decade start
          ]
        }
      }
    },
    {
      $group: {
         _id: "$decade",
         totalBooks: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 } // sort decades in ascending order
    },
    {
      $project: {
        _id: 0,
        decade: "$_id",
        totalBooks: 1
      }
    }
    ])

    const decadeResults = await decadeCursor.toArray();

    if (decadeResults.length === 0) {
        console.log("No books found for decade grouping.");
    } else {
      decadeResults.forEach((row, index) => {
        console.log(`${index + 1}. Decade ${row.decade}s → ${row.totalBooks} books`);
    });
    }


    //Task 5 - Indexing
    // Create an index on the title field
    console.log("\nCreating index on 'title' field...");

    await collection.createIndex({ title: 1 }); 

    console.log("Index created successfully on 'title'!");

    // Create a compound index on author and published_year
    console.log("\nCreating compound index on 'author' and 'published_year'...");

    await collection.createIndex({ author: 1, published_year: -1 });

    console.log("Compound index created successfully on 'author' ascending, and 'published_year' descending!");

    // Without projection, just to check index usage
    console.log("\nQuery plan for searching by author and year:");
    const explainResult = await collection.find(
        { author: "J.K. Rowling", published_year: 2007 }
    ).explain("executionStats");

    console.log(JSON.stringify(explainResult, null, 2));



  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

// Run the reader when executed directly
if (require.main === module) {
  readBooks().catch(console.error);
}

module.exports = { readBooks };