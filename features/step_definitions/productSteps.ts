import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { DataTable } from '@cucumber/cucumber';
import fetch from 'node-fetch';
import assert from 'assert';

// Устанавливаем таймаут на выполнение шагов (20 секунд)
setDefaultTimeout(20_000);

// Переменные для хранения ответа и базового URL
let responseData: any;
let responseStatus: number;
let baseUrl = '';

// Шаг для установки базового URL API
Given('Установлен базовый URL {string}', function (url: string) {
  baseUrl = url;
});

// Шаг для отправки GET или другого запроса без тела
When('отправляю {string} запрос на {string}', async function (method: string, path: string) {
  const res = await fetch(`${baseUrl}${path}`, { method });
  responseStatus = res.status;
  responseData = await res.json();
});

// Шаг для отправки POST-запроса с телом, данные берутся из таблицы в feature
When('отправляю POST-запрос на {string} с телом:', async function (path: string, dataTable: DataTable) {
  // Преобразуем таблицу в объект, приводим поле price к числу
  const bodyEntries = dataTable.rows().map(([key, value]) => {
    if (key === 'price') {
      return [key, parseFloat(value)];
    }
    return [key, value];
  });
  const body = Object.fromEntries(bodyEntries);

  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  responseStatus = res.status;
  responseData = await res.json();
  console.log('POST responseData:', responseData); // Для отладки показываем ответ
});

// Проверка кода ответа сервера
Then('код ответа равен {int}', function (expectedStatus: number) {
  assert.strictEqual(
    responseStatus,
    expectedStatus,
    `Ожидался код ответа ${expectedStatus}, получен ${responseStatus}`
  );
});

// Проверяем, что в ответе поле с именем fieldName равно строковому expectedValue
Then('в ответе поле {string} равно {string}', function (fieldName: string, expectedValue: string) {
  const actualValue = responseData[fieldName];
  console.log(`Проверяем поле: ${fieldName} в ответе:`, actualValue);
  assert.strictEqual(
    actualValue,
    expectedValue,
    `Ожидалось значение поля "${fieldName}" = "${expectedValue}", получено: "${actualValue}"`
  );
});

// Проверяем, что в ответе поле с именем fieldName равно числовому expectedValue
Then('в ответе поле {string} равно {float}', function (fieldName: string, expectedValue: number) {
  const actualValue = responseData[fieldName];
  console.log(`Проверяем поле: ${fieldName} в ответе:`, actualValue);
  assert.strictEqual(
    actualValue,
    expectedValue,
    `Ожидалось значение поля "${fieldName}" = ${expectedValue}, получено: ${actualValue}`
  );
});

// Проверяем, что каждый объект в массиве содержит только перечисленные поля (включая id)
Then('каждый объект в массиве {string} содержит только поля:', function (arrayFieldName: string, dataTable: DataTable) {
  assert(responseData[arrayFieldName] && Array.isArray(responseData[arrayFieldName]), `Ожидается массив ${arrayFieldName}`);

  // Получаем ожидаемые поля из таблицы и добавляем 'id', сортируем для сравнения
  const expectedFieldsFromTable = dataTable.raw().flat();
  const expectedFields = ['id', ...expectedFieldsFromTable].sort();

  for (const item of responseData[arrayFieldName]) {
    const actualFields = Object.keys(item).sort();
    assert.deepStrictEqual(
      actualFields,
      expectedFields,
      `В элементе массива ${arrayFieldName} ожидались поля [${expectedFields.join(', ')}], получены [${actualFields.join(', ')}]`
    );
  }
});
