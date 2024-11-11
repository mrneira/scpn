using System;
using System.IO;
using Ionic.Zip;
using Ionic.Zlib;

namespace general.util.Compression
{
    public class ZipHelper
    {
        public static string Compress(string[] filesPathToCompress, string outPutFilePath)
        {
            try
            {
                using (ZipFile zip = new ZipFile())
                {
                    using (MemoryStream output = new MemoryStream())
                    {

                        foreach (string file in filesPathToCompress)
                        {
                            if (File.Exists(file))
                                zip.AddFile(file, "");
                        }

                        zip.Save(output);
                        File.WriteAllBytes(outPutFilePath + ".zip", output.ToArray());
                    }
                }
                return string.Empty;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public static byte[] FileCompress(string[] filesPathToCompress, out string salida)
        {
            byte[] compressFile = null;
            salida = string.Empty;
            try
            {
                using (ZipFile zip = new ZipFile())
                {
                    using (MemoryStream output = new MemoryStream())
                    {
                        foreach (string file in filesPathToCompress)
                        {
                            if (File.Exists(file)) zip.AddFile(file, "");
                        }
                        zip.Save(output);
                        compressFile = output.ToArray();
                    }
                }
                return compressFile;
            }
            catch (Exception ex)
            {
                salida = ex.ToString();
                return compressFile;
            }
        }

        public static void Extract(string filesPath, string folderContain)
        {
            using (ZipFile zip = ZipFile.Read(filesPath))
            {
                //zip.ExtractAll(filesPath, ExtractExistingFileAction.DoNotOverwrite);
                foreach (ZipEntry f in zip)
                {
                    f.Extract(folderContain, ExtractExistingFileAction.OverwriteSilently);
                }
            }
        }

    }
}

