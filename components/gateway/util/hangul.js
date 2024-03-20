var choseong = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

var jungseong = [
  'ㅏ',
  'ㅐ',
  'ㅑ',
  'ㅒ',
  'ㅓ',
  'ㅔ',
  'ㅕ',
  'ㅖ',
  'ㅗ',
  'ㅘ',
  'ㅙ',
  'ㅚ',
  'ㅛ',
  'ㅜ',
  'ㅝ',
  'ㅞ',
  'ㅟ',
  'ㅠ',
  'ㅡ',
  'ㅢ',
  'ㅣ',
];

var jongseong = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄳ',
  'ㄴ',
  'ㄵ',
  'ㄶ',
  'ㄷ',
  'ㄹ',
  'ㄺ',
  'ㄻ',
  'ㄼ',
  'ㄽ',
  'ㄾ',
  'ㄿ',
  'ㅀ',
  'ㅁ',
  'ㅂ',
  'ㅄ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

var engjaso = [
  'r', // 0x3131
  'R', // 0x3132
  'rt', // 0x3133
  's', // 0x3134
  'sw', // 0x3135
  'sg', // 0x3136
  'e', // 0x3137
  'E', // 0x3138
  'f', // 0x3139
  'fr', // 0x313A
  'fa', // 0x313B
  'fq', // 0x313C
  'ft', // 0x313D
  'fx', // 0x313E
  'fv', // 0x313F
  'fg', // 0x3140
  'a', // 0x3141
  'q', // 0x3142
  'Q', // 0x3143
  'qt', // 0x3144
  't', // 0x3145
  'T', // 0x3146
  'd', // 0x3147
  'w', // 0x3148
  'W', // 0x3149
  'c', // 0x314A
  'z', // 0x314B
  'x', // 0x314C
  'v', // 0x314D
  'g', // 0x314E
  'k', // 0x314F
  'o', // 0x3150
  'i', // 0x3151
  'O', // 0x3152
  'j', // 0x3153
  'p', // 0x3154
  'u', // 0x3155
  'P', // 0x3156
  'h', // 0x3157
  'hk', // 0x3158
  'ho', // 0x3159
  'hl', // 0x315A
  'y', // 0x315B
  'n', // 0x315C
  'nj', // 0x315D
  'np', // 0x315E
  'nl', // 0x315F
  'b', // 0x3160
  'm', // 0x3161
  'ml', // 0x3162
  'l', // 0x3163
];

var eng_choseong = {
  r: 0,
  R: 1,
  s: 2,
  e: 3,
  E: 4,
  f: 5,
  a: 6,
  q: 7,
  Q: 8,
  t: 9,
  T: 10,
  d: 11,
  w: 12,
  W: 13,
  c: 14,
  z: 15,
  x: 16,
  v: 17,
  g: 18,
};

var eng_jungseong = {
  k: 0,
  o: 1,
  i: 2,
  O: 3,
  j: 4,
  p: 5,
  u: 6,
  P: 7,
  h: 8,
  hk: 9,
  ho: 10,
  hl: 11,
  y: 12,
  n: 13,
  nj: 14,
  np: 15,
  nl: 16,
  b: 17,
  m: 18,
  ml: 19,
  l: 20,
};

var eng_jongseong = {
  r: 1,
  R: 2,
  rt: 3,
  s: 4,
  sw: 5,
  sg: 6,
  e: 7,
  f: 8,
  fr: 9,
  fa: 10,
  fq: 11,
  ft: 12,
  fx: 13,
  fv: 14,
  fg: 15,
  a: 16,
  q: 17,
  qt: 18,
  t: 19,
  T: 20,
  d: 21,
  w: 22,
  c: 23,
  z: 24,
  x: 25,
  v: 26,
  g: 27,
};

var hook = {};

hook.decompose = function (str) {
  var decomp = [];
  str.split('').forEach((e) => {
    var charCodeAt = e.charCodeAt(0);
    if (charCodeAt >= 0xac00 && charCodeAt <= 0xd7af) {
      charCodeAt = charCodeAt - 0xac00;
      var jong = charCodeAt % 28; // 종성
      var jung = ((charCodeAt - jong) / 28) % 21; // 중성
      var cho = ((charCodeAt - jong) / 28 - jung) / 21; // 초성

      decomp.push(choseong[cho]);
      decomp.push(jungseong[jung]);
      if (jong !== 0) {
        decomp.push(jongseong[jong]);
      }
    } else {
      decomp.push(e);
    }
  });

  return decomp;
};

hook.choseong = function (str) {
  var cho = [];
  str.split('').forEach((e) => {
    cho.push(decompose(e)[0]);
  });
  return cho;
};

hook.jaso_to_english = function (jaso) {
  var conv = [];
  jaso.split('').forEach((e) => {
    var charCodeAt = e.charCodeAt(0);
    if (charCodeAt >= 0x3131 && charCodeAt <= 0x3163) {
      conv.push(engjaso[charCodeAt - 0x3131]);
    } else {
      conv.push(e);
    }
  });
  return conv;
};

hook.english_to_hangul = function (str) {
  var han = [];

  for (var i = 0; i < str.length; i++) {
    // chosung
    var cho = eng_choseong[str.substr(i, 1)];
    if (cho === undefined) {
      han.push(str[i]);
      continue;
    }
    i++;

    // jungseong
    var jung;
    var temp_jung =
      i + 2 > str.length ? undefined : eng_jungseong[str.substr(i, 2)];
    if (temp_jung !== undefined) {
      jung = temp_jung;
      i += 2;
    } else {
      jung = i + 1 > str.length ? undefined : eng_jungseong[str.substr(i, 1)];
      i++;
    }

    // jongseong
    var jong;
    var temp_jong =
      i + 2 > str.length ? undefined : eng_jongseong[str.substr(i, 2)];
    if (temp_jong !== undefined) {
      jong = temp_jong;
      temp_jung =
        i + 2 + 1 > str.length
          ? undefined
          : eng_jungseong[str.substr(i + 2, 1)];
      if (temp_jung !== undefined) {
        jong = i + 1 > str.length ? undefined : eng_jongseong[str.substr(i, 1)];
      } else {
        i++;
      }
    } else {
      temp_jung =
        i + 1 + 1 > str.length
          ? undefined
          : eng_jungseong[str.substr(i + 1, 1)];
      if (temp_jung !== undefined) {
        jong = 0;
        i--;
      } else {
        jong = i + 1 > str.length ? undefined : eng_jongseong[str.substr(i, 1)];
        if (jong === undefined) {
          jong = 0;
          i--;
        }
      }
    }

    han.push(String.fromCharCode(0xac00 + 21 * 28 * cho + 28 * jung + jong));
  }

  // check all hangul or not
  var isok = han.every(function (ch) {
    var c = ch.charCodeAt(0);
    if (0xac00 <= c && c <= 0xd7a4) {
      return true;
    }
    return false;
  });

  return isok ? han : [];
};

// module.exports = hook;
export default hook;
