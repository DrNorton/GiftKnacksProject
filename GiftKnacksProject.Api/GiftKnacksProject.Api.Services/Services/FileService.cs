using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using GiftKnacksProject.Api.Services.Interfaces;

namespace GiftKnacksProject.Api.Services.Services
{
    public class FileService : IFileService
    {
        private readonly UrlSettings _urlSettings;

        public FileService(UrlSettings urlSettings)
        {
            _urlSettings = urlSettings;
        }

        private string _imagesPath;
        public string SaveBase64FileReturnUrl(FileType fileType,string mimeType, string base64File)
        {
            var imagestr = PrepareBase64StringFromJs(base64File);
            var bytes = Convert.FromBase64String(imagestr);
            var tuple = CreateFileUri(mimeType,_urlSettings.ApiUrl);
            using (var fs = new FileStream(tuple.Item1, FileMode.OpenOrCreate))
            {
                fs.Write(bytes, 0, bytes.Length);
                fs.Close();
            }
            return tuple.Item2;
        }

        private static string PrepareBase64StringFromJs(string base64File)
        {
            var imagestr = base64File.Split(new char[] {','})[1]; //Убираем ненужную инфу о файле
            return imagestr;
        }

        private Tuple<string,string> CreateFileUri(string mimeType,string apiUrl)
        {
            var type = mimeType.Split(new char[] { '/' })[1];
            var guid = Guid.NewGuid();
            var uriBuilder = new StringBuilder();
            uriBuilder.Append(_imagesPath);
            uriBuilder.Append("/");
            uriBuilder.Append(guid);
            uriBuilder.Append(".");
            uriBuilder.Append(type);

            var urlBuilder = new StringBuilder();
            urlBuilder.Append(apiUrl);
            urlBuilder.Append("/images/");
            urlBuilder.Append(guid);
            urlBuilder.Append(".");
            urlBuilder.Append(type);
            return new Tuple<string, string>(uriBuilder.ToString(),urlBuilder.ToString());
        }


        public void CheckNeededFolderAndIfNotExistsCreate()
        {
            var filePath = HttpContext.Current.Server.MapPath("~/images");
            if (!System.IO.Directory.Exists(filePath))
            {
                System.IO.Directory.CreateDirectory(filePath);
            }
            _imagesPath = filePath;
        }
    }

    public enum FileType
    {
        Image
    }
}
