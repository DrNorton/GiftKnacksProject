using System;
using Newtonsoft.Json;

namespace GiftKnackAgentCore.DatabaseSchemas
{
    public class LastMessageDocumentDbSchema
    {
        [JsonProperty(PropertyName = "id")]
        public string Recepient { get; set; }
        public long Sender { get; set; }
        public string LastMessage { get; set; }
        public DateTime Time { get; set; }
        public bool IsRead { get; set; }
    }
}
