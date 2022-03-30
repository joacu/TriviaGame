
const express = require('express')
const fs = require('fs').promises
const {create_question, get_questions, shuffle } = require('../db.js')
const router = express.Router()

function protected_route (req, res, next) {
  if (!req.session.user) {
    // si quiere trabajar sin rutas prptegidas, comente la siguiente línea
    return res.redirect('/login')
  }
  next()
}

// RUTAS
router.get('/', protected_route, (req, res) => {
  res.render('index.html')
})

router.get('/add_questions', protected_route, async (req, res) => {
  const images = await fs.readdir('static')
  res.render('add_questions.html', { images })
})

router.get("/play", protected_route, async(req, res) => {
  let preguntas = await get_questions();
  console.log(preguntas);
  let nuevoObjeto = [];
  for (let pregunta of preguntas) {
      let array1 = [];
      let obj1 = {};
      // user_id, question, correctanswer, answer02, answer03
      
      array1.push(pregunta.correctanswer);
      array1.push(pregunta.answer02);
      array1.push(pregunta.answer03);
      shuffle(array1);
      obj1 = {
          id: pregunta.id,
          question: pregunta.question,
          p1: array1[0],
          p2: array1[1],
          p3: array1[2],
      };
      nuevoObjeto.push(obj1);
  }
  console.log(nuevoObjeto)
  res.render("play.html", { nuevoObjeto });
});

  router.post("/add_questions", async(req, res) => {
    let user_id = req.session.user.id;
    console.log(req.session.user.id);
    let pregunta = req.body.question;
    let correcta = req.body.correctanswer;
    let incorrectaUno = req.body.answer02;
    let incorrectaDos = req.body.answer03;

    await create_question(user_id, pregunta, correcta, incorrectaUno, incorrectaDos);
    console.log(user_id, pregunta, correcta, incorrectaUno, incorrectaDos);
    res.redirect("/add_questions");
});

module.exports = router
