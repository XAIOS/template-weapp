import Time from './time'

const Crypto = {}
;(function() {
  let b = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let a = Crypto.util = {
    rotl(d, c) {
      return (d << c) | (d >>> (32 - c))
    },
    rotr(d, c) {
      return (d << (32 - c)) | (d >>> c)
    },
    endian(d) {
      if (d.constructor == Number)
        return a.rotl(d, 8) & 16711935 | a.rotl(d, 24) & 4278255360
      for (let c = 0; c < d.length; c++)
        d[c] = a.endian(d[c])
      return d
    },
    randomBytes(d) {
      for (let c = []; d > 0; d--)
        c.push(Math.floor(Math.random() * 256))
      return c
    },
    stringToBytes(e) {
      let c = []
      for (let d = 0; d < e.length; d++)
        c.push(e.charCodeAt(d))
      return c
    },
    bytesToString(c) {
      let e = []
      for (let d = 0; d < c.length; d++)
        e.push(String.fromCharCode(c[d]))
      return e.join('')
    },
    stringToWords(f) {
      let e = []
      for (let g = 0, d = 0; g < f.length; g++, d += 8)
        e[d >>> 5] |= f.charCodeAt(g) << (24 - d % 32)
      return e
    },
    bytesToWords(d) {
      let f = []
      for (let e = 0, c = 0; e < d.length; e++, c += 8)
        f[c >>> 5] |= d[e] << (24 - c % 32)
      return f
    },
    wordsToBytes(e) {
      let d = []
      for (let c = 0; c < e.length * 32; c += 8)
        d.push((e[c >>> 5] >>> (24 - c % 32)) & 255)
      return d
    },
    bytesToHex(c) {
      let e = []
      for (let d = 0; d < c.length; d++) {
        e.push((c[d] >>> 4).toString(16));
        e.push((c[d] & 15).toString(16))
      }
      return e.join('')
    },
    hexToBytes(e) {
      let d = []
      for (let f = 0; f < e.length; f += 2)
        d.push(parseInt(e.substr(f, 2), 16))
      return d
    },
    bytesToBase64(d) {
      if (typeof btoa == 'function')
        return btoa(a.bytesToString(d))
      let c = [], f
      for (let e = 0; e < d.length; e++)
        switch (e % 3) {
          case 0:
            c.push(b.charAt(d[e] >>> 2))
            f = (d[e] & 3) << 4
            break
          case 1:
            c.push(b.charAt(f | (d[e] >>> 4)))
            f = (d[e] & 15) << 2
            break
          case 2:
            c.push(b.charAt(f | (d[e] >>> 6)))
            c.push(b.charAt(d[e] & 63))
            f = -1
        }
      if (f != undefined && f != -1)
        c.push(b.charAt(f))
      while (c.length % 4 != 0)
        c.push('=')
      return c.join('')
    },
    base64ToBytes(d) {
      if (typeof atob == 'function')
        return a.stringToBytes(atob(d))
      d = d.replace(/[^A-Z0-9+\/]/ig, '')
      let c = []
      for (let e = 0; e < d.length; e++)
        switch (e % 4) {
          case 1:
            c.push((b.indexOf(d.charAt(e - 1)) << 2) | (b.indexOf(d.charAt(e)) >>> 4))
            break
          case 2:
            c.push(((b.indexOf(d.charAt(e - 1)) & 15) << 4) | (b.indexOf(d.charAt(e)) >>> 2))
            break
          case 3:
            c.push(((b.indexOf(d.charAt(e - 1)) & 3) << 6) | (b.indexOf(d.charAt(e))))
            break
        }
      return c
    }
  };
  Crypto.mode = {}
})()
;(function() {
  let a = Crypto.util
  Crypto.HMAC = function(g, h, f, d) {
    f = f.length > g._blocksize * 4 ? g(f, { asBytes: true }) : a.stringToBytes(f)
    let c = f, j = f.slice(0)
    for (let e = 0; e < g._blocksize * 4; e++) {
      c[e] ^= 92
      j[e] ^= 54
    }
    let b = g(a.bytesToString(c) + g(a.bytesToString(j) + h, { asString: true }), { asBytes: true })
    return d && d.asBytes ? b : d && d.asString ? a.bytesToString(b) : a.bytesToHex(b)
  }
})()
;(function() {
  let a = Crypto.util
  let b = Crypto.SHA1 = function(e, c) {
    let d = a.wordsToBytes(b._sha1(e));
    return c && c.asBytes ? d : c && c.asString ? a.bytesToString(d) : a.bytesToHex(d)
  }
  b._sha1 = function(k) {
    let u = a.stringToWords(k),
      v = k.length * 8,
      o = [],
      q = 1732584193,
      p = -271733879,
      h = -1732584194,
      g = 271733878,
      f = -1009589776;
    u[v >> 5] |= 128 << (24 - v % 32)
    u[((v + 64 >>> 9) << 4) + 15] = v
    for (let y = 0; y < u.length; y += 16) {
      let D = q,
        C = p,
        B = h,
        A = g,
        z = f
      for (let x = 0; x < 80; x++) {
        if (x < 16) {
          o[x] = u[y + x]
        } else {
          let s = o[x - 3] ^ o[x - 8] ^ o[x - 14] ^ o[x - 16]
          o[x] = (s << 1) | (s >>> 31)
        }
        let r = ((q << 5) | (q >>> 27)) + f + (o[x] >>> 0) + (x < 20 ? (p & h | ~p & g) + 1518500249 : x < 40 ? (p ^ h ^ g) + 1859775393 : x < 60 ? (p & h | p & g | h & g) - 1894007588 : (p ^ h ^ g) - 899497514)
        f = g
        g = h
        h = (p << 30) | (p >>> 2)
        p = q
        q = r
      }
      q += D
      p += C
      h += B
      g += A
      f += z
    }
    return [q, p, h, g, f]
  }
  b._blocksize = 16
})()

const Base64 = {
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  encode(input) {
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4
    let i = 0, output = ''

    input = Base64._utf8_encode(input)

    while (i < input.length) {
      chr1 = input.charCodeAt(i++)
      chr2 = input.charCodeAt(i++)
      chr3 = input.charCodeAt(i++)

      enc1 = chr1 >> 2
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63

      if (isNaN(chr2))
        enc3 = enc4 = 64
      else if (isNaN(chr3))
        enc4 = 64

      output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4)
    }

    return output
  },
  decode(input) {
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4
    let i = 0, output = ''

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')

    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++))
      enc2 = this._keyStr.indexOf(input.charAt(i++))
      enc3 = this._keyStr.indexOf(input.charAt(i++))
      enc4 = this._keyStr.indexOf(input.charAt(i++))

      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4

      output = output + String.fromCharCode(chr1)

      if (enc3 != 64)
        output = output + String.fromCharCode(chr2)
      if (enc4 != 64)
        output = output + String.fromCharCode(chr3)
    }

    output = Base64._utf8_decode(output)

    return output
  },
  _utf8_encode(string) {
    let utftext = ''
    string = string.replace(/\r\n/g, '\n')

    for (let n = 0; n < string.length; n++) {
      let c = string.charCodeAt(n)

      if (c < 128)
        utftext += String.fromCharCode(c)
      else if ((c > 127) && (c < 2048))
        utftext += String.fromCharCode((c >> 6) | 192) + String.fromCharCode((c & 63) | 128)
      else
        utftext += String.fromCharCode((c >> 12) | 224) + String.fromCharCode(((c >> 6) & 63) | 128) + String.fromCharCode((c & 63) | 128)
    }
    return utftext
  },
  _utf8_decode(utftext) {
    let c = c1 = c2 = 0
    let i = 0, string = ''

    while (i < utftext.length) {
      c = utftext.charCodeAt(i)

      if (c < 128) {
        string += String.fromCharCode(c)
        i++
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1)
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
        i += 2
      } else {
        c2 = utftext.charCodeAt(i + 1)
        c3 = utftext.charCodeAt(i + 2)
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
        i += 3
      }
    }

    return string
  }
}

const policy = Base64.encode(JSON.stringify({
  expiration: '2040-01-01T12:00:00.000Z',
  conditions: [['content-length-range', 0, 1048576000]]
}))

let config, signature

export function InitUpload(option) {
  config = option
  signature = Crypto.util.bytesToBase64(Crypto.HMAC(Crypto.SHA1, policy, config.key_secret, { asBytes: true }))
}

export default function(file) {
  return new Promise((resolve, reject) => {
    let name = ''
    let char = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    while (name.length < 32)
      name += char[Math.floor(Math.random() * 62)]

    let formData = {
      policy,
      signature,
      success_action_status: 200,
      OSSAccessKeyId: config.key_id,
      key: `Content/Photo/${Time(new Date, 'yyyyMMdd')}/${name}.jpg`
    }

    wx.uploadFile({
      url: config.host,
      formData,
      name: 'file',
      filePath: file,
      success: () => resolve(`${config.host}/${formData.key}`),
      fail: () => reject()
    })
  })
}
