//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace GiftKnacksProject.Api.EfDao
{
    using System;
    using System.Collections.Generic;
    
    public partial class Contact
    {
        public long Id { get; set; }
        public string Skype { get; set; }
        public string Facebook { get; set; }
        public string Vk { get; set; }
        public string Telephone { get; set; }
    
        public virtual Profile Profile { get; set; }
    }
}