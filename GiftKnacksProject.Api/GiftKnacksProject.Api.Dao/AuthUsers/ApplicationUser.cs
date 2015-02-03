using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;

namespace GiftKnacksProject.Api.Dao.AuthUsers
{
    public class ApplicationUser:IUser<long>
    {
        public long Id { get; set; }
        public string UserName { get; set; }
        public string PasswordHash { get; set; }
     
    }
}
