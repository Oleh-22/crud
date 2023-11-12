// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(10000 + Math.random() * 90000)
  }

  static add = (product) => {
    this.#list.push(product)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static update = (
    product,
    { id, name, price, description },
  ) => {
    product.name = name
    product.price = price
    product.description = description
    product.id = Number(id)
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створенний',
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  console.log(typeof id)

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видалений',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  // let result = false

  // if ()

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Емайл пошта оновлена'
      : 'Сталася помилка',
  })
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.post('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})
// ================================================================
router.post('/alert', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    info: 'Успішне виконання дії',
    description: 'Товар успішно був доданий',
  })
})

// ================================================================
router.get('/product-list', function (req, res) {
  const list = Product.getList()
  console.log(list)
  res.render('product-list', {
    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query

  Product.getById(Number(id))

  if (Product.getById(Number(id))) {
    res.render('product-edit', {
      style: 'product-edit',
      product: Product.getById(Number(id)),
    })
  } else {
    res.render('alert', {
      style: 'alert',
      alert: 'Товар з таким ID не знайдено',
    })
  }
})

// ================================================================
router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body

  let result = false
  const product = Product.getById(Number(id))

  Product.update(product, { id, name, price, description })

  result = true

  res.render('alert', {
    style: 'alert',
    info: 'Успішне виконання дії',
    description: 'Товар успішно оновлений',
  })
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query


  Product.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    info: 'Товар видалено',
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
