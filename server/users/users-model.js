const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development || process.env(DATABASE_URL) || process.env.DB_ENV);

module.exports = {
  add,
  findById,
  find,
  findBy,
  findByUserName,
  update,
  remove,
  findSubs,
  addSub,
  editSub,
  delSub
};

function find(){
  return db('users').select('id', 'username');
}

function findBy(filter){
  return db('users')
  .where(filter);
}
async function add(user){
  const [id] = await db('users')
  .insert(user, 'id')
  .returning('id');
  return findById(id); 
};

// function findById(id){
//   return db('users')
//   .where({id})
//   .first();
// };

function findById(id){
  return findBy({id}).first();
}

function findByUserName(username){
  return findBy({username}).first();
}

function update(id, changes) {
  return db('users')
    .where({ id })
    .update(changes);
}

function remove(id) {
  return db('users')
    .where('id', id)
    .del();
}

function findSubs(user_id){
  return db('subreddits as subs')
  .join('users as u', 'u.id', 'subs.user_id')
  .select('subs.id', 'subs.name', 'subs.subLink', 'u.username')
  .where('subs.user_id', user_id)
  .orderBy('subs.id');
}

function addSub(sub){
  return db('subreddits')
  .insert(sub)
  .then(ids => ({id: ids[0]}));
}

function editSub(id, changes) {
  return db('subreddits')
    .where({ id })
    .update(changes);
}

function delSub(id) {
  return db('subreddits')
    .where('id', id)
    .del();
}