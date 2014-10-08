DustIntl.__addLocaleData({"locale":"uk","pluralRuleFunction":function (n) {var i=Math.floor(Math.abs(n)),v=n.toString().replace(/^[^.]*\.?/,"").length;n=Math.floor(n);if(v===0&&i%10===1&&(i%100!==11))return"one";if(v===0&&i%10===Math.floor(i%10)&&i%10>=2&&i%10<=4&&!(i%100>=12&&i%100<=14))return"few";if(v===0&&(i%10===0||v===0&&(i%10===Math.floor(i%10)&&i%10>=5&&i%10<=9||v===0&&i%100===Math.floor(i%100)&&i%100>=11&&i%100<=14)))return"many";return"other";},"fields":{"second":{"displayName":"Секунда","relative":{"0":"зараз"},"relativeTime":{"future":{"one":"Через {0} секунду","few":"Через {0} секунди","many":"Через {0} секунд","other":"Через {0} секунди"},"past":{"one":"{0} секунду тому","few":"{0} секунди тому","many":"{0} секунд тому","other":"{0} секунди тому"}}},"minute":{"displayName":"Хвилина","relativeTime":{"future":{"one":"Через {0} хвилину","few":"Через {0} хвилини","many":"Через {0} хвилин","other":"Через {0} хвилини"},"past":{"one":"{0} хвилину тому","few":"{0} хвилини тому","many":"{0} хвилин тому","other":"{0} хвилини тому"}}},"hour":{"displayName":"Година","relativeTime":{"future":{"one":"Через {0} годину","few":"Через {0} години","many":"Через {0} годин","other":"Через {0} години"},"past":{"one":"{0} годину тому","few":"{0} години тому","many":"{0} годин тому","other":"{0} години тому"}}},"day":{"displayName":"День","relative":{"0":"сьогодні","1":"завтра","2":"післязавтра","-2":"позавчора","-1":"учора"},"relativeTime":{"future":{"one":"Через {0} день","few":"Через {0} дні","many":"Через {0} днів","other":"Через {0} дня"},"past":{"one":"{0} день тому","few":"{0} дні тому","many":"{0} днів тому","other":"{0} дня тому"}}},"month":{"displayName":"Місяць","relative":{"0":"цього місяця","1":"наступного місяця","-1":"минулого місяця"},"relativeTime":{"future":{"one":"Через {0} місяць","few":"Через {0} місяці","many":"Через {0} місяців","other":"Через {0} місяця"},"past":{"one":"{0} місяць тому","few":"{0} місяці тому","many":"{0} місяців тому","other":"{0} місяця тому"}}},"year":{"displayName":"Рік","relative":{"0":"цього року","1":"наступного року","-1":"минулого року"},"relativeTime":{"future":{"one":"Через {0} рік","few":"Через {0} роки","many":"Через {0} років","other":"Через {0} року"},"past":{"one":"{0} рік тому","few":"{0} роки тому","many":"{0} років тому","other":"{0} року тому"}}}}});