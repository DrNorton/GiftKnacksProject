﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GiftKnackNotificationAgent.Models
{
    public class Notification
    {
        public string Action { get; set; }
        public DateTime Time { get; set; }
        public BaseNotificationInfo Info { get; set; }
    }
}