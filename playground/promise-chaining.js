require('../src/db/mongoose') // import db
const User = require('../src/models/user') // import User model
const Task = require('../src/models/task')

// user object id to use 60428085dbd52741e80b440e
// User.findByIdAndUpdate('6041e4e0a3feff3f2814993a', { age: 1 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

// create an async function that will be used to update a users age and return the count of users with that age
// const updateAgeAndCount = async (id, age) => { // 2 arguments. first is id of the document you want to update, second is the property you want to update
//     const user = await User.findByIdAndUpdate(id, { age }) // first await - Inside the Users collection, find a user by it's id and upadte it with age
//     const count = await User.countDocuments({ age }) // second await - Inside the Users collection, AFTER the first await was fulfilled, return the number of user documents with the inputted age
//     return count // AFTER the second await was fulfilled, return count so that it can be referenced in .then() when this function is called
// }
// updateAgeAndCount('6041e4e0a3feff3f2814993a', 2) // call the async/await function and include (2) properties: id and what to update age to be
//     .then((count) => { // .then() to perform something on the fulfilled promise (which is the count that got returned)
//         console.log(count)
//     })
//     .catch((error) => { // if the promise is not fulfilled, do something
//         console.log(error)
//     })

const deleteTaskAndCount = async (id) => {
    const deleteTask = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments()
    return count
}
deleteTaskAndCount('6041dc290278561948315a38').then((count) => {
    console.log(count)
}).catch((error) => {
    console.log(error)
})