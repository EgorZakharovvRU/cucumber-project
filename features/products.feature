Feature: API тестирование /products

  Background:
    Given Установлен базовый URL "https://dummyjson.com"

  Scenario: Проверка параметра select в GET /products
    When отправляю "GET" запрос на "/products?limit=5&select=title,price"
    Then каждый объект в массиве "products" содержит только поля:
      | title |
      | price |

  Scenario: Проверка пагинации с параметрами limit и skip
    When отправляю "GET" запрос на "/products?limit=3&skip=2&select=title"
    Then каждый объект в массиве "products" содержит только поля:
      | title |

  Scenario: Добавление нового продукта через POST /products/add
    When отправляю POST-запрос на "/products/add" с телом:
      | title       | New Product Example|
      | price       | 199.99             |
      | description | Test product       |
      | category    | test-category      |
    Then в ответе поле "description" равно "Test product"
    And в ответе поле "price" равно 199.99
    And в ответе поле "category" равно "test-category"
