using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace GiftKnackNotificationAgent.Models
{
    public class BaseNotificationInfo
    {
        [JsonIgnore]
        public long OwnerId { get; set; }
    }
}
