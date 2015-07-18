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
    
    public partial class Wish
    {
        public Wish()
        {
            this.WishGiftLinks = new HashSet<WishGiftLink>();
        }
    
        public long Id { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public long UserId { get; set; }
        public Nullable<System.DateTime> FromDate { get; set; }
        public Nullable<System.DateTime> ToDate { get; set; }
        public string Benefit { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public string Location { get; set; }
        public string ImageUrl { get; set; }
        public int Emergency { get; set; }
    
        public virtual Country Country1 { get; set; }
        public virtual User User { get; set; }
        public virtual WishCategory WishCategory { get; set; }
        public virtual ICollection<WishGiftLink> WishGiftLinks { get; set; }
    }
}
