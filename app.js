const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const restaurants = require('./public/jsons/restaurant.json').results

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

app.get('/restaurants', (req, res) => {
  // ?. 是一個選擇性鏈操作符，它允許在 req.query.search 為 undefined 或 null 時不會拋出錯誤，而是返回 undefined。
  const keyword = req.query.search?.trim()
  // 這行檢查 keyword 是否存在。如果存在，則進行篩選操作；如果不存在，則直接返回所有餐廳。
  const matchedRestaurants = keyword ? restaurants.filter((mv) =>
    Object.values(mv).some((property) => {
      if (typeof property === 'string') {
        return property.toLowerCase().includes(keyword.toLowerCase())
      }
      return false
    })
  ) : restaurants
  // 當你將 restaurants: matchedRestaurants 作為參數傳遞給 res.render 方法時，你實際上是在告訴 Express 框架：“在渲染模板時，請將 matchedRestaurants 陣列作為 restaurants 變數傳遞給模板。” 這樣，在模板中，你可以使用 {{#each restaurants}} 和 {{/each}} 標籤來遍歷這個陣列，並使用 {{this}} 或 {{.}} 來訪問每個餐廳物件的屬性。
  res.render('index', { restaurants: matchedRestaurants, keyword })
})

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((mv) => mv.id.toString() === id)
  res.render('detail', { restaurant })
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})