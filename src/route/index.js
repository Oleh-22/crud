// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
// ================================================================
class Product {
  static #list = []
  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count //генеруємо унікальний id для товару
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)
    this.#list.push(newProduct)
  }
  static getList = () => {
    return this.#list
  }
  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }
  static getRandomList = (id) => {
    //Фільтруємо товари, щоб вилучити той з яким порівнюємо id
    const filteredList = this.#list.filter(
      (product) => product !== id,
    )

    //Відсортуємо та перемішаємо масив
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    //Повертаємо перші три елемента
    return shuffledList.slice(0, 3)
  }
}
Product.add(
  'https://picsum.photos/200/300',
  'Компютер Artline Gaming (X43v31) AMD Ryzen 5 3600',
  'AMD Ryzen 5 3600 (3.6-4.2) /RAM 16 Gb/HDD 1 Tb',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  'Компютер Proline Business (B32423p55) Intel Core i5 9400F',
  'Intel Core i5 9400F (2.9-4.1 Ghz) /RAM 8 Gb/HDD 1 Tb',
  [{ id: 2, text: 'Топ продажів' }],
  20000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  'Компютер Proline Workstation (W67p03) Intel Xeon E-2226G',
  'Intel Xeon E-2226G (3.6-4.2) /RAM 32 Gb/HDD 3 Tb',
  [{ id: 1, text: 'Готовий до відправки' }],
  40000,
  10,
)
class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1
  static #count = 0
  static #list = []
  //іде пошта та бонусний баланс в словнику
  static #bonusAccount = new Map()

  //по пошті витаскуєм бонусний балансб якщо не знаходить то 0
  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    //кількість бонусів які бажає списати користувач
    bonusUse = 0,
  ) => {
    //кількість нових бонусів
    const amount = this.calcBonusAmount(price)
    //поточний баланс бонусів
    const currentBalance = Purchase.getBonusBalance(email)
    const updateBalance = currentBalance + amount - bonusUse
    //записуєм це значення
    Purchase.#bonusAccount.set(email, updateBalance)
    // console.log(email, updateBalance)
    //повертаємо кількість нарахованих бонусів за певну ціну
    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count //генеруємо унікальний id для товару
    this.firstname = data.firstname
    this.lastname = data.lastname
    this.phone = data.phone
    this.email = data.email
    this.comment = data.comment || null
    this.bonus = data.bonus || 0
    this.promocode = data.promocode || null
    this.tottalPrice = data.tottalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount
    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)
    this.#list.push(newPurchase)
    return newPurchase
  }
  //Реверс-щоб зверху були останні замовлення
  static getList = () => {
    return Purchase.#list.reverse()
  }
  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }
  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    //Заносимо потрібні поля, якщо вони передані в data
    if (purchase) {
      if (data.firstname) {
        purchase.firstname = data.firstname
      }
      if (data.lastname) {
        purchase.lastname = data.lastname
      }
      if (data.phone) {
        purchase.phone = data.phone
      }
      if (data.email) {
        purchase.email = data.email
      }
      return true
    } else {
      return false
    }
  }
}
class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromocode = new Promocode(name, factor)
    Promocode.#list.push(newPromocode)
    return newPromocode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)
// ================================================================
router.get('/alert', function (req, res) {
  res.render('alert-purchase', {
    style: 'alert-purchase',
    data: {
      message: 'Операція успішна',
      info: 'Товар створенний',
      link: '/test-path',
    },
  })
})
// ================================================================
router.get('/', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',
    data: {
      list: Product.getList(),
    },
  })
})
// ================================================================
router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)
  res.render('purchase-product', {
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})
// ================================================================
router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)
  const product = Product.getById(id)
  if (product.amount < 1) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: 'Помилка',
        info: 'Такої кількості товару немає в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  if (amount < 1) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: 'Помилка',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  // console.log(product, amount)

  const productPrice = product.price * amount
  const tottalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(tottalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',
    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      tottalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
})
// ================================================================

router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    tottalPrice,
    productPrice,
    deliveryPrice,
    amount,
    firstname,
    lastname,
    email,
    phone,
    comment,
    promocode,
    bonus,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: `/purchase-list`,
      },
    })
  }

  if (product.amount < amount) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: 'Помилка',
        info: 'Товару нема в потрібній кількості',
        link: `/purchase-list`,
      },
    })
  }

  tottalPrice = Number(tottalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(tottalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: 'Помилка',
        info: 'Некоректні данні',
        link: `/purchase-list`,
      },
    })
  }

  //Якщо якогось поля нема то буде алерт, перевірка обовязкових полів
  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: 'Заповніть обовязкові поля',
        info: 'Некоректні данні',
        link: `/purchase-list`,
      },
    })
  }

  if (bonus || bonus > 0) {
    //отримуєм кількість бонусів по поточному балансі
    const bonusAmount = Purchase.getBonusBalance(email)
    // console.log(bonusAmount)
    //якщо кть бонусів вказана більша за доступні бонусиб для того щоб зробити обмеження і записати максимально достіпні його бонуси
    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }
    //оновлюєм балансб нараховуємо нові бонуси
    Purchase.updateBonusBalance(email, tottalPrice, bonus)
    //ціну зменьш на бонуси
    tottalPrice -= bonus
  } else {
    //якщо не ввели кть списати бонусів, то вказуємо 0
    Purchase.updateBonusBalance(email, tottalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) {
      tottalPrice = Promocode.calc(promocode, tottalPrice)
    }
  }
  //ставимо 0 щоб замовлення не було відємним
  if (tottalPrice < 0) tottalPrice = 0

  const purchase = Purchase.add(
    {
      tottalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,
      firstname,
      lastname,
      email,
      phone,
      promocode,
      comment,
    },
    product,
  )
  // console.log(purchase)
  res.render('alert-purchase', {
    style: 'alert-purchase',
    data: {
      message: 'Успішно',
      info: 'Замовлення створено',
      link: `/purchase-list`,
    },
  })
})
// ================================================================
router.get('/purchase-list', function (req, res) {
  res.render('purchase-list', {
    style: 'purchase-list',
    data: {
      list: Purchase.getList(),
    },
  })
})
// ================================================================
router.get('/purchase-update', function (req, res) {
  const id = Number(req.query.id)
  const list = Purchase.getList()

  res.render('purchase-update', {
    style: 'purchase-update',
    data: {
      list: Purchase.getList(),
    },
  })
})
// ================================================================
router.get('/purchase-updating', function (req, res) {
  const id = Number(req.query.id)
  const list = Purchase.getList()
  res.render('purchase-updating', {
    style: 'purchase-updating',
    data: {
      list: Purchase.getList(),
    },
  })
})
// ================================================================
router.post('/purchase-updating', function (req, res) {
  const { id, lastname, firstname, email, phone } = req.body
  Purchase.updateById(1, {
    lastname,
    firstname,
    email,
    phone,
  })
  console.log(req.body)
  res.render('alert-purchase', {
    style: 'alert-purchase',
    data: {
      message: 'Успішно',
      info: 'Зміни збережено',
      link: `/purchase-list`,
    },
  })
})
// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
