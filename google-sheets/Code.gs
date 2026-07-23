/**
 * Пансионат «Счастье» — приём заявок в Google Sheets
 *
 * Настройка:
 * 1. Создайте Google Таблицу.
 * 2. В первой строке листа напишите заголовки:
 *    Дата | ФИО | Дата рождения | Пол | Телефон | Email | Диагноз | Согласие
 * 3. Расширения → Apps Script → вставьте этот код → Сохранить.
 * 4. Развернуть → Новое развёртывание → Тип: Веб-приложение
 *    - Описание: Заявки с сайта
 *    - Выполнять от имени: Меня
 *    - У кого есть доступ: Все
 * 5. Скопируйте URL веб-приложения.
 * 6. Вставьте его в assets/js/script.js → APPLICATION_FORM_SCRIPT_URL
 * 7. Закоммитьте и запушьте сайт.
 */

var SHEET_NAME = 'Заявки';

function doPost(e) {
  try {
    var sheet = getOrCreateSheet_();
    var p = (e && e.parameter) ? e.parameter : {};

    sheet.appendRow([
      new Date(),
      safe_(p.fio),
      safe_(p.birthDate),
      safe_(p.gender),
      safe_(p.phone),
      safe_(p.email),
      safe_(p.diagnosis),
      safe_(p.consent)
    ]);

    return json_({ result: 'success' });
  } catch (err) {
    return json_({ result: 'error', message: String(err) });
  }
}

function doGet() {
  return ContentService
    .createTextOutput('OK: приём заявок пансионата «Счастье» работает.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Дата',
      'ФИО',
      'Дата рождения',
      'Пол',
      'Телефон',
      'Email',
      'Диагноз',
      'Согласие'
    ]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function safe_(value) {
  return value == null ? '' : String(value).trim();
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
