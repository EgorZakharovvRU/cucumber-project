# API тестирование с помощью Cucumber.js и Node.js

Проект содержит BDD тесты для проверки API https://dummyjson.com/products/  

## Что требуется
Написать BDD тесты, используя cucumber.js:
1. Протестировать логику https://dummyjson.com/products/, убедиться, что функциональность "select" работает корректно (https://dummyjson.com/docs/products#products-limit_skip)
2. Протестировать логику https://dummyjson.com/products/, убедиться, что функциональность добавления нового продукта работает корректно (или некорректно). (https://dummyjson.com/docs/products#products-add)
Результат выполнения задания: ссылка на репо с тестами в github.com

## Что тестируется

- GET /products с параметром `select`: проверка, что в ответе возвращаются только указанные поля.
- GET /products с параметрами `limit` и `skip`: проверка пагинации и выбора полей.
- POST /products/add: проверка добавления нового продукта и корректности ответа.

## Запуск тестов

1. Установить зависимости:  
   `npm install`

2. Запустить тесты:  
   `npx cucumber-js`
