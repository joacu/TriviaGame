const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'TriviaGame',
  password: '1234',
  max: 12,
  min: 2,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 2000
})

async function get_questions() {
  const client = await pool.connect();

  const { rows } = await client.query({
      text: "select * from questions"
  });

  client.release();

  return rows;
}

async function create_question(user_id, question, correctanswer, answer01, answer02) {
  const client = await pool.connect();

  await client.query({
      text: "insert into questions (user_id, question, correctanswer, answer02, answer03) values ($1, $2, $3,$4,$5)",
      values: [user_id, question, correctanswer, answer01, answer02],
  });

  client.release();
}

async function get_user(email) {
  const client = await pool.connect()

  const { rows } = await client.query({
    text: 'select * from users where email=$1',
    values: [email]
  })

  client.release()

  return rows[0]
}

function shuffle(array) {
  let currentIndex = array.length,
      randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
      ];
  }

  return array;
}

async function create_user(name, email, password) {
  const client = await pool.connect();
  const { rows } = await client.query(`select * from users `);
  if (rows.length > 0) {
      await client.query({
          text: "insert into users (name, email, password,es_admin) values ($1, $2, $3, false)",
          values: [name, email, password],
      });
  } else {
      await client.query({
          text: "insert into users (name, email, password,es_admin) values ($1, $2, $3,true)",
          values: [name, email, password],
      });
  }

  client.release()

}

module.exports = {
  get_user, create_user, create_question, get_questions, shuffle
}
