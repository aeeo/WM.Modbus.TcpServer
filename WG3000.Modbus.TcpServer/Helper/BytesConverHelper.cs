using System;
using System.Linq;
using System.Text;

namespace WG3000.Modbus.TcpServer.Helper
{
    public class BytesConvertHelper
    {


        public static byte[] ConvertInt8ToByteArray(byte i8)
        {
            var byteData = BitConverter.GetBytes(i8);
            if (BitConverter.IsLittleEndian) Array.Reverse(byteData);

            return byteData;
        }

        public static byte[] ConvertUInt8ToByteArray(byte i8)
        {
            var byteData = BitConverter.GetBytes(i8);
            if (BitConverter.IsLittleEndian) Array.Reverse(byteData);

            return byteData;
        }

        public static byte[] ConvertInt32ToByteArray(Int32 i32)
        {
            var byteData = BitConverter.GetBytes(i32);
            if (BitConverter.IsLittleEndian) Array.Reverse(byteData);

            return byteData;
        }

        public static byte[] ConvertUInt32ToByteArray(UInt32 i32)
        {
            var byteData = BitConverter.GetBytes(i32);
            if (BitConverter.IsLittleEndian) Array.Reverse(byteData);

            return byteData;
        }

        public static byte[] ConvertInt16ToByteArray(short i16)
        {
            var byteData = BitConverter.GetBytes(i16);
            if (BitConverter.IsLittleEndian) Array.Reverse(byteData);

            return byteData;
        }

        public static byte[] ConvertUInt16ToByteArray(ushort i16)
        {
            var byteData = BitConverter.GetBytes(i16);
            if (BitConverter.IsLittleEndian) Array.Reverse(byteData);

            return byteData;
        }

        public static byte[] ConvertIntToByteArray(Int64 i64)
        {
            var byteData = BitConverter.GetBytes(i64);
            if (BitConverter.IsLittleEndian) Array.Reverse(byteData);

            return byteData;
        }

        public static byte[] ConvertIntToByteArray(UInt64 i64)
        {
            var byteData = BitConverter.GetBytes(i64);
            if (BitConverter.IsLittleEndian) Array.Reverse(byteData);

            return byteData;
        }

        public static byte[] ConvertIntToByteArray(int I)
        {
            var byteData = BitConverter.GetBytes(I);
            if (BitConverter.IsLittleEndian) Array.Reverse(byteData);

            return byteData;
        }

        public static Int32 ConvertByteArrayToInt32(byte[] b, int startIndex)
        {
            var selected = b.Skip(startIndex).Take(4).ToArray();
            if (BitConverter.IsLittleEndian) Array.Reverse(selected);

            return BitConverter.ToInt32(selected, 0); ;
        }

        public static UInt32 ConvertByteArrayToUInt32(byte[] b, int startIndex)
        {
            var selected = b.Skip(startIndex).Take(4).ToArray();
            if (BitConverter.IsLittleEndian) Array.Reverse(selected);

            return BitConverter.ToUInt32(selected, 0); ;
        }

        public static Int16 ConvertByteArrayToInt16(byte[] b, int startIndex)
        {
            var selected = b.Skip(startIndex).Take(2).ToArray();
            if (BitConverter.IsLittleEndian) Array.Reverse(selected);

            return BitConverter.ToInt16(selected, 0); ;
        }

        public static UInt16 ConvertByteArrayToUInt16(byte[] b, int startIndex)
        {
            var selected = b.Skip(startIndex).Take(2).ToArray();
            if (BitConverter.IsLittleEndian) Array.Reverse(selected);

            return BitConverter.ToUInt16(selected, 0);
        }

        public static uint ConvertByteArrayToInt8(byte[] b, int startIndex)
        {
            return b[startIndex]; ;
        }

        public static uint ConvertByteArrayToUInt8(byte[] b, int startIndex)
        {
            return b[startIndex];
        }


        private const string HexDigits = "0123456789ABCDEF";

        /// <summary> 
        /// Convert a byte array to hex string. Example output: "7F2C4A00". 
        ///  
        /// Alternatively, you can also use the BitConverter.ToString method to  
        /// convert byte array to string of hexadecimal pairs separated by hyphens,  
        /// where each pair represents the corresponding element in value; for  
        /// example, "7F-2C-4A-00". 
        /// </summary> 
        /// <param name="bytes">An array of bytes</param> 
        /// <returns>Hex string</returns> 
        public static string BytesToHexString(byte[] bytes)
        {
            var sb = new StringBuilder(bytes.Length * 2);
            foreach (var b in bytes)
            {
                sb.AppendFormat("{0:X2} ", b);
            }
            return sb.ToString();
        }

        public static string BytesToHexString(byte[] bytes, int len)
        {
            var sb = new StringBuilder(bytes.Length * 2);
            for (var i = 0; i < len; i++)
            {
                sb.AppendFormat("{0:X2} ", bytes[i]);
            }
            return sb.ToString();
        }

        /// <summary> 
        /// Convert a hex string to byte array. 
        /// </summary> 
        /// <param name="str">hex string. For example, "FF00EE11"</param> 
        /// <returns>An array of bytes</returns> 
        public static byte[] HexStringToBytes(string str)
        {
            // Determine the number of bytes 
            var bytes = new byte[str.Length >> 1];
            for (var i = 0; i < str.Length; i += 2)
            {
                var highDigit = HexDigits.IndexOf(Char.ToUpperInvariant(str[i]));
                var lowDigit = HexDigits.IndexOf(Char.ToUpperInvariant(str[i + 1]));
                if (highDigit == -1 || lowDigit == -1)
                {
                    throw new ArgumentException("The string contains an invalid digit.", "s");
                }
                bytes[i >> 1] = (byte)((highDigit << 4) | lowDigit);
            }
            return bytes;
        }

        public static string ToHex(byte[] data)
        {
            return ToHex(data, "");
        }

        public static string ToHex(byte[] data, string prefix)
        {
            var lookup = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };
            int i = 0, p = prefix.Length, l = data.Length;
            var c = new char[l * 2 + p];
            for (; i < p; ++i) c[i] = prefix[i];
            i = -1;
            --l;
            --p;
            while (i < l)
            {
                var d = data[++i];
                c[++p] = lookup[d / 0x10];
                c[++p] = lookup[d % 0x10];
            }
            return new string(c, 0, c.Length);
        }

        public static byte[] FromHex(string str)
        {
            return FromHex(str, 0, 0, 0);
        }

        public static byte[] FromHex(string str, int offset, int step)
        {
            return FromHex(str, offset, step, 0);
        }

        public static byte[] FromHex(string str, int offset, int step, int tail)
        {
            var b = new byte[(str.Length - offset - tail + step) / (2 + step)];
            var l = str.Length - tail;
            var s = step + 1;
            for (int y = 0, x = offset; x < l; ++y, x += s)
            {
                var c1 = (byte)str[x];
                if (c1 > 0x60) c1 -= 0x57;
                else if (c1 > 0x40) c1 -= 0x37;
                else c1 -= 0x30;
                var c2 = (byte)str[++x];
                if (c2 > 0x60) c2 -= 0x57;
                else if (c2 > 0x40) c2 -= 0x37;
                else c2 -= 0x30;
                b[y] = (byte)((c1 << 4) + c2);
            }
            return b;
        }

    }
}
