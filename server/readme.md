### Hashing

A one-way process of obfuscating the data. Once done, the original data cannot be retrieved, but it can be verified.

Storing passwords in plain text is bad. We want to treat security like layers of onion. Just because someone can't get into our server doesn't mean we shouldn't protect the data within.

Hashing allows us to check if the password is correct without us ever seeing the original value.

bcrypt.js is a popular library which allows us implementation of hashing on our server

Bcrypt will run its own hashing algorithm and take a salt to generate a hash.

Salt is a random data appended to the end of the hash (multiple times) to prevent rainbow table attacks.