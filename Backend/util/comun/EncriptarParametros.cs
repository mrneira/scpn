using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.IO;

namespace util {
    public static class EncriptarParametros {
        private static readonly byte[] IVa = new byte[13]
        {
          (byte) 11,
          (byte) 12,
          (byte) 13,
          (byte) 14,
          (byte) 15,
          (byte) 17,
          (byte) 17,
          (byte) 18,
          (byte) 19,
          (byte) 20,
          (byte) 14,
          (byte) 22,
          (byte) 23
        };

        public static string Encriptar(this string texto) {
            string s = "AtlasPass";
            try {
                using (Aes aes = (Aes)new AesManaged()) {
                    Rfc2898DeriveBytes rfc2898DeriveBytes = new Rfc2898DeriveBytes(Encoding.UTF8.GetString(EncriptarParametros.IVa, 0, EncriptarParametros.IVa.Length), Encoding.UTF8.GetBytes(s));
                    aes.Key = rfc2898DeriveBytes.GetBytes(16);
                    aes.IV = aes.Key;
                    using (MemoryStream memoryStream = new MemoryStream()) {
                        using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, aes.CreateEncryptor(), CryptoStreamMode.Write)) {
                            byte[] bytes = Encoding.UTF8.GetBytes(texto);
                            cryptoStream.Write(bytes, 0, bytes.Length);
                            cryptoStream.FlushFinalBlock();
                        }
                        return Convert.ToBase64String(memoryStream.ToArray());
                    }
                }
            } catch {
                return string.Empty;
            }
        }

        public static string Desencriptar(this string texto) {
            string s = "AtlasPass";
            try {
                using (Aes aes = (Aes)new AesManaged()) {
                    Rfc2898DeriveBytes rfc2898DeriveBytes = new Rfc2898DeriveBytes(Encoding.UTF8.GetString(EncriptarParametros.IVa, 0, EncriptarParametros.IVa.Length), Encoding.UTF8.GetBytes(s));
                    aes.Key = rfc2898DeriveBytes.GetBytes(16);
                    aes.IV = aes.Key;
                    using (MemoryStream memoryStream = new MemoryStream()) {
                        using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, aes.CreateDecryptor(), CryptoStreamMode.Write)) {
                            byte[] buffer = Convert.FromBase64String(texto);
                            cryptoStream.Write(buffer, 0, buffer.Length);
                            cryptoStream.Flush();
                        }
                        byte[] bytes = memoryStream.ToArray();
                        return Encoding.UTF8.GetString(bytes, 0, bytes.Length);
                    }
                }
            } catch {
                return string.Empty;
            }
        }
    }
}
